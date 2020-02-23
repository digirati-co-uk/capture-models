import { EntityManager, EntityRepository } from 'typeorm';
import { BaseField, CaptureModel as CaptureModelType, RevisionRequest } from '@capture-models/types';
import { traverseDocument } from '@capture-models/editor/lib/utility/traverse-document';
import { filterDocumentByRevision } from '@capture-models/editor';
import { expandModelFields } from '../../editor/src/core/structure-editor';
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
  async getCaptureModel(id: string, { canonical = false }: { canonical?: boolean } = {}): Promise<CaptureModelType> {
    return toCaptureModel(await this.manager.findOne(CaptureModel, id));
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

      const fields: Field[] = [];
      const documents: Document[] = [];

      // First we need to flatten the document, plucking out the fields, and documents.
      traverseDocument(document, {
        visitEntity(entity) {
          // Documents will instantiate their own `Property` instances.
          documents.push(fromDocument(entity, false));
        },
        visitField(field, propKey, parent) {
          // The field needs to know the `Property` identifier
          const fieldToSave = fromField(field);
          fieldToSave.parentId = `${parent.id}/${propKey}`;
          fields.push(fieldToSave);
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
      await manager.save(Document, documents);

      // Flatten all of the properties from the documents.
      const properties = [];
      for (const entity of documents) {
        properties.push(...entity.properties);
      }

      // Property - depends on documents.
      await manager.save(Property, properties);

      // Field - depends on revisions and properties
      await manager.save(Field, fields);

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

    if (toRemove.version !== version) {
      throw new Error('Version does not match');
    }

    if (!toRemove) {
      throw new Error(`Capture model ${id} not found`);
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

  getRevision(id: string) {}

  searchRevisions() {}

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
    const example = {
      revision: {
        id: 'bb5d55b1-6c38-4bb9-a6e6-ed236347671b',
        structureId: 'fd847948-11bf-42ca-bfdd-cab85ea818f3',
        fields: ['transcription'],
      },
      document: {
        id: '47e8a9d8-76f8-422b-91af-b457d1c624a0',
        type: 'entity',
        label: 'Name of entity',
        properties: {
          transcription: [
            {
              id: '892f3abe-bbbe-4b1e-9167-a52ec76ea5c1',
              type: 'text-field',
              label: 'Transcription',
              allowMultiple: true,
              revision: 'bb5d55b1-6c38-4bb9-a6e6-ed236347671b',
              value: 'Person C created this one',
            },
          ],
        },
      },
      source: 'structure',
    };

    // We parse our document, the top level here is immutable.
    // We need to, like the capture model, traverse this.
    let document = req.document;

    // If the source is `structure` we want to validate that the fields match
    // and that there is a user associated with the change.
    const source = req.source;
    if (source === 'structure' && !allowCanonicalChanges) {
      // We will re-apply the filter that was applied to the frontend.
      // Even if this does not match the structure, it still _needs_ to be
      // describe the fields correctly in order to be valid.
      document = filterDocumentByRevision(req.document, req.revision);

      // If the source is `structure` we want to make sure a user was associated. We add this to the revision.
      // This will be added by the consuming service. (In addition to checking `allowCanonicalChanges`)
      const author = req.author;
      if (!allowAnonymous && !author) {
        throw new Error('No user associated with change');
      }

      if (!req.revision.structureId) {
        throw new Error('Revision requires structure ID, use { allowCanonicalChanges: true } to override');
      }

      if (!allowCustomStructure) {
        // If the source is `structure` we also want to check the attached structureId and compare it against
        // the fields loaded. Although these may drift over time, for new items they must match.
        const structure = await this.manager
          .createQueryBuilder()
          .select(['c.id', 'c.fields'])
          .from(Structure, 'c')
          .where({ id: req.revision.structureId })
          .getOne();

        // Model Root field (new option - allowCustomModelRoot)
        // Fork Values boolean
        // Editable above root option.
        // Prevent additions adjacent to root
        // We need a test to detect and then test that each of these hold. With options to override.
        // Then we need to traverse, from the structure root (can split doc with utility)
        // And only save new fields from the model root – downwards. MAKE SURE THEY ARE CONNECTED

        // Diff the keys.
        const keysInStructure = new Set(...expandModelFields(structure.fields).map(f => f.join('.')));
        const keysInRevision = new Set(...expandModelFields(req.revision.fields).map(f => f.join('.')));
        if (
          keysInRevision.size !== keysInStructure.size ||
          [...keysInRevision.values()].reduce((fail, key) => keysInStructure.has(key) || fail, false)
        ) {
          throw new Error('Revision fields do not match structure, use { allowCustomStructure: true } to override');
        }
      }
    }

    const fields: Field[] = [];
    const documents: Document[] = [];
    // First we need to flatten the document, plucking out the fields, and
    // documents.
    traverseDocument(document, {
      visitEntity(entity: CaptureModelType['document'], key, parent) {
        // We don't want the top level document.
        if (parent) {
          // Documents will instantiate their own `Property` instances.
          documents.push(fromDocument(entity, false));
        }
      },
      visitField(field: BaseField, propKey, parent) {
        // The field needs to know the `Property` identifier
        const fieldToSave = fromField(field);
        fieldToSave.parentId = `${parent.id}/${propKey}`;
        fields.push(fieldToSave);
      },
    });

    // We can use the fields to map the properties.
    // const fields = req.revision.fields;

    // Using the fields above, we can extract the new values, ensuring that the revision ID is attached.
    const props = req.document.properties;

    if (createNewCaptureModel) {
      // @todo.
      throw new Error('Not yet implemented');
    }

    if (!allowOverwrite) {
      // @todo, we need to validate that the fields do not already exist in the DB.
    }

    // Persisting.
    // ModelRoot - this is the path at where all entities are immutable, after this
    //   nesting level. If provided in the model, it will be used as an override. Default
    //   is highest common entity in the tree that contains all fields (excluding entities)
    //
    // ReplicationRoot - this is highest common allowMultiple entity in the tree,
    //   under and including the model root (excluding entity fields).

    // Once we calculate the replication root, we should know where the model root is.

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
    // @todo
  }

  /**
   * Remove a revision
   *
   * @param revisionId
   */
  removeRevision(revisionId: string) {
    // Need some options here. Although this will be a reviewer-instantiated call, we want to make sure
    // that the revision has not already been accepted (or config for that) and that it is safe to remove.
  }
}
