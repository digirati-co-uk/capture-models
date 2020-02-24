import { EntityManager, EntityRepository } from 'typeorm';
import { BaseField, CaptureModel as CaptureModelType, RevisionRequest } from '@capture-models/types';
import { traverseDocument } from '@capture-models/editor/lib/utility/traverse-document';
import { filterDocumentByRevision, expandModelFields, validateRevision } from '@capture-models/editor';
import { CaptureModel } from './entity/CaptureModel';
import { Contributor } from './entity/Contributor';
import { Field } from './entity/Field';
import { Document } from './entity/Document';
import { Property } from './entity/Property';
import { Revision } from './entity/Revision';
import { Structure } from './entity/Structure';
import { fromContributor } from './mapping/from-contributor';
import { fromDocument } from './mapping/from-document';
import { fromField } from './mapping/from-field';
import { fromRevision } from './mapping/from-revision';
import { fromStructure } from './mapping/from-structure';
import { toCaptureModel } from './mapping/to-capture-model';

@EntityRepository()
export class CaptureModelRepository {
  constructor(private manager: EntityManager) {}

  /**
   * Get capture model
   * Returns a capture model when given an ID.
   *
   * @param id
   * @param canonical - Only load the canonical document, no revisions.
   */
  async getCaptureModel(
    id: string,
    { canonical = false }: { canonical?: boolean } = {}
  ): Promise<CaptureModelType & { id: string }> {
    const model = await this.manager.findOne(CaptureModel, id);
    if (!model) {
      throw new Error(`Capture model: ${id} was not found`);
    }
    return (await toCaptureModel(model)) as any;
  }

  /**
   * Get all capture models
   * Returns a page of capture models.
   *
   * @todo figure out what fields we actually need for this.
   *
   * @param page The page requested
   * @param pageSize The number of results
   */
  async getAllCaptureModels(page = 0, pageSize = 20) {
    const result: Array<{ capture_model_id: string; structure_label: string }> = await this.manager
      .createQueryBuilder()
      .select(['capture_model.id'])
      .from(CaptureModel, 'capture_model')
      .leftJoin('capture_model.structure', 'structure')
      .addSelect('structure.label')
      .take(pageSize)
      .skip(page * pageSize)
      .getRawMany();

    // eslint-disable-next-line @typescript-eslint/camelcase
    return result.map(({ capture_model_id, structure_label }) => ({ id: capture_model_id, label: structure_label }));
  }

  /**
   * Create Capture Model
   * Creates a canonical capture model. This should be an admin operation only.
   *
   * @param model
   */
  async saveCaptureModel({
    // list of fields
    integrity,
    document,
    contributors,
    id,
    revisions,
    structure,
    target,
  }: CaptureModelType) {
    // @todo validation of capture model.
    return this.manager.transaction(async manager => {
      // The order of operations is as follows:
      // - the structure, depends on nothing
      // - contributors, depends on nothing
      // - revisions, depends on structures and contributors
      // - documents, depends on revisions and contributors
      // - document properties, depends on documents
      // - fields, depends on revisions and document properties
      // - capture model, depends on everything.

      const dbInserts: (Field | Document | Property)[][] = [];
      traverseDocument<{ parentAdded?: boolean }>(document, {
        beforeVisitEntity(entity, term, parent) {
          const entityDoc = fromDocument(entity, false);
          if (parent) {
            entityDoc.parentId = `${parent.id}/${term}`;
          }
          dbInserts.push([entityDoc]);
          dbInserts.push(
            entityDoc.properties.map(prop => {
              prop.rootDocumentId = document.id;
              return prop;
            })
          );
          const fieldInserts = [];
          entityDoc.properties.forEach(prop => {
            entity.properties[prop.term].forEach(field => {
              if (field.type !== 'entity') {
                const fieldToSave = fromField(field);
                fieldToSave.parentId = `${entityDoc.id}/${prop.term}`;
                fieldInserts.push(fieldToSave);
              }
            });
          });
          dbInserts.push(fieldInserts);
        },
      });

      // Structure - no dependencies.
      const mappedStructure = fromStructure(structure);
      await manager.save(Structure, mappedStructure);

      // Contributors - no dependencies.
      const mappedContributors = Object.values(contributors || {}).map(fromContributor);
      if (contributors) {
        await manager.save(Contributor, mappedContributors);
      }

      // Revision - depends on Contributors & Structures
      const mappedRevisions = (revisions || []).map(fromRevision);
      if (revisions) {
        await manager.save(Revision, mappedRevisions);
      }

      // Document - depends on revisions.
      for (const inserts of dbInserts) {
        await manager.save(inserts);
      }

      // Capture model - depends on everything.
      const captureModel = new CaptureModel();
      // Set some basic fields.
      captureModel.id = id;
      captureModel.integrity = integrity;
      captureModel.target = target;
      captureModel.document = fromDocument(document, false); // technically document[0]
      captureModel.structure = mappedStructure;
      if (revisions) {
        captureModel.revisions = mappedRevisions;
      }
      if (contributors) {
        captureModel.contributors = mappedContributors;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      return await manager.save(CaptureModel, captureModel);
    });
  }

  /**
   * Remove Capture Model
   * Removes a capture model. This should be an admin operation only.
   *
   * @param id
   * @param version
   */
  async removeCaptureModel(id: string, version?: number) {
    const toRemove = await this.manager.findOne(CaptureModel, { id });

    if (!toRemove) {
      throw new Error(`Capture model ${id} not found`);
    }

    if (typeof version !== 'undefined' && toRemove.version !== version) {
      throw new Error('Version does not match');
    }

    const structureId = toRemove.structureId;
    return await this.manager.transaction(async manager => {
      // Remove the capture model.
      await manager.remove(CaptureModel, toRemove);

      // Check if the structure should be removed.
      const structure = await manager
        .createQueryBuilder()
        .select('c.id')
        .from(CaptureModel, 'c')
        .where({ structureId })
        .getRawOne();

      if (!structure) {
        await manager.remove(Structure, toRemove.structure);
      }
    });
  }

  getRevision(id: string) {
    throw new Error('Not implemented yet');
  }

  searchRevisions() {
    throw new Error('Not implemented yet');
  }

  /**
   * Create revision
   *
   * When creating a revision it's important to know that you do not have all of the capture
   * model fields. You have the original canonical fields and the current revision.
   *
   * The purpose of this is to merge in that revision and it's fields into the main document.
   *
   * @param req The revision request
   * @param createNewCaptureModel Creates a new capture model from the one provided
   * @param allowCanonicalChanges Allows the request to make canonical changes to the document in this revision
   * @param allowCustomStructure Allows the request to deviate from the structure stored in the database
   * @param allowOverwrite Allows the request to mutate existing fields
   * @param allowAnonymous Allows `author` to be omitted
   */
  async createRevision(
    req: RevisionRequest,
    {
      createNewCaptureModel = false,
      allowCanonicalChanges = false,
      allowCustomStructure = false,
      allowOverwrite = false,
      allowAnonymous = false,
    }: {
      createNewCaptureModel?: boolean;
      allowCanonicalChanges?: boolean;
      allowCustomStructure?: boolean;
      allowOverwrite?: boolean;
      allowAnonymous?: boolean;
    } = {}
  ) {
    if (!req.captureModelId) {
      throw new Error('Capture model ID is required');
    }

    // We will need this anyway!
    const captureModel = await this.getCaptureModel(req.captureModelId, { canonical: true });

    // Validation for the request.
    validateRevision(req, captureModel, {
      allowAnonymous,
      allowCanonicalChanges,
      allowCustomStructure,
    });

    const fieldsToAdd: Array<{ field: BaseField; term: string; parent: CaptureModelType['document'] }> = [];
    const docsToHydrate: Array<{
      entity: CaptureModelType['document'];
      term?: string;
      parent?: CaptureModelType['document'];
    }> = [];

    traverseDocument(req.document, {
      visitField(field, term, parent) {
        console.log(parent);
        if (parent.immutable) {
          fieldsToAdd.push({ field, term, parent });
        }
      },
      visitEntity(entity, term, parent) {
        if (entity.immutable === false && parent && parent.immutable) {
          docsToHydrate.push({ entity, term, parent });
        }
      },
    });

    console.log();
    console.log('fieldsToAdd');
    console.log(fieldsToAdd);
    console.log();
    console.log('docsToHydrate');
    console.log(docsToHydrate);

    // Docs
    // - get parent ID, find in document (error if not found)
    // - hydrate any missing fields on property (use mapping if that exists) @todo add more to revision request?
    // - Create DB insertion instruction, reusing create capture model code @todo split this out
    //
    // Fields
    // - Loop through, create DB instruction for each
    //
    // Commit order
    // - Saving new contributors
    // - Add new documents first
    // - Then add edits

    // Create new capture model, forking the entire thing. How does this change? Can this use hydrate at the root?
    if (createNewCaptureModel) {
      // @todo.
      throw new Error('Not yet implemented');
    }

    // Allow overwriting existing fields?
    if (!allowOverwrite) {
      // @todo, we need to validate that the fields do not already exist in the DB.
    }

    // We can also do additional checks for `allowMultiple` fields too.
    // The first instance without a revision ID in the `Property` is considered canonical, so we fetch those to
    // verify. In an efficient way.
    // We might have to create a new capture model
    // - shared structure
    // - new document
    // - fresh list of contributors
    // - target from previous, unless in request.
    // - canonical document structure from old model
    // - new additions applied
    // We DONT want to upsert this endpoint, so INSERT only with fail.
    // For saving an existing revision, that will be another function.
    // Updating will have some modes: noAdditionalFields, noDeletedFields
  }

  /**
   * Updating of existing revision.
   *
   * @param req
   * @param allowAdditionalFields
   * @param allowDeletedFields
   */
  updateRevision(
    req: RevisionRequest,
    {
      allowAdditionalFields = false,
      allowDeletedFields = false,
    }: { allowAdditionalFields?: boolean; allowDeletedFields?: boolean } = {}
  ) {
    throw new Error('Not implemented');
  }

  /**
   * Remove a revision
   *
   * @param revisionId
   */
  removeRevision(revisionId: string) {
    // Need some options here. Although this will be a reviewer-instantiated call, we want to make sure
    // that the revision has not already been accepted (or config for that) and that it is safe to remove.
    throw new Error('Not implemented');
  }
}
