import { EntityManager, EntityRepository } from 'typeorm';
import { BaseField, CaptureModel as CaptureModelType, RevisionRequest } from '@capture-models/types';
import { traverseDocument } from '@capture-models/editor/lib/utility/traverse-document';
import {
  filterDocumentByRevision,
  hydratePartialDocument,
  expandModelFields,
  validateRevision,
} from '@capture-models/editor';
import { isEntityList } from '../../editor/src/utility/is-entity';
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
import { toField } from './mapping/to-field';
import { toRevision } from './mapping/to-revision';
import { documentToInserts } from './utility/document-to-inserts';

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

      // Document - depends on revisions and itself.
      // Split the document into a list of inserts, in the correct order for saving.
      const dbInserts = documentToInserts(document);
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

    const entityMap: { [id: string]: CaptureModelType['document'] } = {};
    traverseDocument(captureModel.document, {
      visitEntity(entity) {
        entityMap[entity.id] = entity;
      },
    });

    if (createNewCaptureModel) {
      // @todo Create new capture model, forking the entire thing. How does this change? Can this use hydrate at the root?
      throw new Error('Not yet implemented');
    }

    if (allowOverwrite) {
      // @todo, we need to validate that the fields do not already exist in the DB.
      throw new Error('Not yet implemented');
    }

    const dbInserts: (Field | Document | Property)[][] = [];
    for (const doc of docsToHydrate) {
      const parent = entityMap[doc.parent.id];
      if (!parent) {
        throw new Error(`Immutable item ${doc.parent.id} was not found in capture model`);
      }
      const term = parent.properties[doc.term];
      if (!term) {
        throw new Error(`Term ${doc.term} was not found on capture model document ${doc.parent.id}`);
      }
      if (!isEntityList(term)) {
        throw new Error(`Term ${doc.term} is not a list of documents`);
      }
      // @todo for editing, we'll need to add a check to see if the entity is already in this map and merge those.
      //   in this case, hydrate _will_ keep the values. This will allow 2 revisions to target the same document
      //   but not the same fields. If the same field is edited, then FOR NOW this will replace the revision ID in
      //   that field with this one, making it impossible to edit. Need support for multiple revisions on fields to
      //   support this case.
      const docToClone = term[0];

      // This will add any missing fields from the revision.
      const fullDocument = hydratePartialDocument(doc.entity, docToClone);

      dbInserts.push(
        ...documentToInserts(fullDocument, { id: doc.parent.id, term: doc.term }, captureModel.document.id)
      );
    }

    const fieldInserts: Field[] = [];
    for (const field of fieldsToAdd) {
      // In this case, the property will already exist. So we just need to add a field.
      const fieldObj = fromField(field.field);
      fieldObj.parentId = `${field.parent.id}/${field.term}`;
      fieldInserts.push(fieldObj);
    }
    dbInserts.push(fieldInserts);

    const revision = fromRevision(req.revision);
    const savedRevision = await this.manager.transaction(async manager => {
      const rev = await manager.save(revision);
      for (const insert of dbInserts) {
        // @todo change this to insert() and expand list of inserts to other entities.
        //   This will avoid updates and allow the whole list to be inserted flat.
        await manager.save(insert);
      }
      return rev;
    });

    // @todo optimised this so we're only fetching the fields we need.
    const finalModel = await this.getCaptureModel(captureModel.id);

    const mappedRevision = toRevision(savedRevision);
    const revisionRequest: RevisionRequest = {
      revision: mappedRevision,
      document: filterDocumentByRevision(finalModel.document, mappedRevision),
      source: req.source,
      author: req.author,
      captureModelId: captureModel.id,
      modelRoot: req.modelRoot,
      target: req.target,
    };

    return revisionRequest;
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
    // Get capture model
    // Take revision
    // Get mapping of old fields (in revision)
    // Get mapping of old entities (in revision)
    // Traverse revision and make lists
    // - field changes
    // - new fields
    // - new documents
    // - deleted fields
    // Check configuration, apply changes.
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
