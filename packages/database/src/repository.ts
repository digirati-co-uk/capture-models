import { Brackets, EntityManager, EntityRepository } from 'typeorm';
import { BaseField, CaptureModel as CaptureModelType, RevisionRequest, StatusTypes } from '@capture-models/types';
import { traverseDocument } from '@capture-models/editor/lib/utility/traverse-document';
import { validateRevision, filterDocumentByRevision } from '@capture-models/editor';
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
import { fromRevisionRequest } from './mapping/from-revision-request';
import { fromStructure } from './mapping/from-structure';
import { toCaptureModel } from './mapping/to-capture-model';
import { toRevision } from './mapping/to-revision';
import { documentToInserts } from './utility/document-to-inserts';
import * as deepEqual from 'fast-deep-equal';
import { fieldsToInserts } from './utility/fields-to-inserts';
import { partialDocumentsToInserts } from './utility/partial-documents-to-inserts';

@EntityRepository()
export class CaptureModelRepository {
  constructor(private manager: EntityManager) {}

  async getCaptureModel(
    id: string,
    {
      includeCanonical,
      revisionStatus,
      revisionId,
      userId,
    }: { includeCanonical?: boolean; revisionStatus?: StatusTypes; revisionId?: string; userId?: string } = {}
  ): Promise<CaptureModelType & { id: string }> {
    const builder = await this.manager
      .createQueryBuilder()
      .select('model')
      .from(CaptureModel, 'model')
      .leftJoinAndSelect('model.document', 'doc')
      .leftJoinAndSelect('model.structure', 'structure')
      .leftJoinAndSelect('structure.flatItems', 'structureFlatItem')
      .leftJoinAndSelect('model.revisions', 'revision')
      .leftJoinAndSelect('doc.selector', 'selector')
      .leftJoinAndSelect('doc.nestedProperties', 'property')
      .leftJoinAndSelect('property.fieldInstances', 'fi')
      .leftJoinAndSelect('property.documentInstances', 'di')
      .leftJoinAndSelect('di.selector', 'dis')
      .leftJoinAndSelect('fi.selector', 'fis')
      .where('doc.captureModelId = :id', { id });

    if (revisionStatus || includeCanonical) {
      if (['draft', 'submitted', 'accepted'].indexOf(revisionStatus.toLowerCase()) === -1) {
        throw new Error(
          `Invalid revision status ${revisionStatus}, should be one of ['draft', 'submitted', 'accepted']`
        );
      }
      builder.andWhere(
        new Brackets(qb =>
          qb
            // Add the revision id.
            .where('di.status = :status', { status: revisionStatus.toLowerCase() })
            .orWhere('fi.status = :status', { status: revisionStatus.toLowerCase() })
        )
      );
      if (includeCanonical) {
        // @todo this will include canonical items
        //    (field.revision.accepted === status OR no revision)
        throw new Error('Not yet implemented');
      }
    }

    if (userId) {
      // @todo This will
      //   - filter contributors.
      //   - filter revisions based on contributions
      //   - optionally, with revision ID filter those down further.
      // di.revisionId IN (selector revision where revision.author = author)
      // fi.revisionId IN (selector revision where revision.author = author)
      throw new Error('Not yet implemented');
    }

    if (revisionId) {
      builder.andWhere(
        new Brackets(qb =>
          qb
            // Add the revision id.
            .where('di.revisionId = :rid', { rid: revisionId })
            .orWhere('fi.revisionId = :rid', { rid: revisionId })
        )
      );
    }

    const captureModel = await builder.getOne();

    if (!captureModel) {
      throw new Error(`Capture model ${id} not found`);
    }

    return (await toCaptureModel(captureModel)) as any;
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
    const newModel = await this.manager.transaction(async manager => {
      // The order of operations is as follows:
      // - the structure, depends on nothing
      // - contributors, depends on nothing
      // - revisions, depends on structures and contributors
      // - documents, depends on revisions and contributors
      // - document properties, depends on documents
      // - fields, depends on revisions and document properties
      // - capture model, depends on everything.
      try {
        // Structure - no dependencies.
        const mappedStructure = fromStructure(structure);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
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
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    return this.getCaptureModel(newModel.id);
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

  async getRevision(id: string): Promise<RevisionRequest> {
    const model = await this.manager.findOne(Revision, id);
    if (!model) {
      throw new Error(`Revision: ${id} was not found`);
    }
    const revision = toRevision(model);
    const fullModel = await this.getCaptureModel(model.captureModelId, { revisionId: id });

    return {
      captureModelId: model.captureModelId,
      source: model.source,
      document: fullModel.document,
      revision,
    };
  }

  searchRevisions() {
    throw new Error('Not implemented yet');
  }

  async revisionExists(id: string) {
    const count = await this.manager
      .createQueryBuilder()
      .select('r.id')
      .from(Revision, 'r')
      .where({ id })
      .getCount();

    return count !== 0;
  }

  async captureModelExists(id: string) {
    const count = await this.manager
      .createQueryBuilder()
      .select('c.id')
      .from(CaptureModel, 'c')
      .where({ id })
      .getCount();

    return count !== 0;
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

    // @todo only return the canonical model.
    const captureModel = await this.getCaptureModel(req.captureModelId, {
      /*canonical: true*/
    });

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

    // Everything we need to add into the database.
    const dbInserts: (Field | Document | Property)[][] = [
      // Map the documents, adding missing fields if required.
      ...partialDocumentsToInserts(docsToHydrate, entityMap, captureModel.document.id),
      // Map the fields
      fieldsToInserts(fieldsToAdd),
    ];

    const revision = fromRevisionRequest(req);
    // Save the revision.
    await this.manager.transaction(async manager => {
      const rev = await manager.save(revision);
      for (const insert of dbInserts) {
        // @todo change this to insert() and expand list of inserts to other entities.
        //   This will avoid updates and allow the whole list to be inserted flat.
        await manager.save(insert);
      }
      return rev;
    });

    return this.getRevision(req.revision.id);
  }

  /**
   * Updating of existing revision.
   *
   * @param req
   * @param allowAdditionalFields
   * @param allowDeletedFields
   */
  async updateRevision(
    req: RevisionRequest,
    {
      allowAdditionalFields = false,
      allowDeletedFields = false,
    }: { allowAdditionalFields?: boolean; allowDeletedFields?: boolean } = {}
  ) {
    const storedRevision = await this.getRevision(req.revision.id);
    const captureModel = await this.getCaptureModel(req.captureModelId);

    // Filter the new document with the stored revision (to be sure.)
    const newFilteredDocument = filterDocumentByRevision(req.document, storedRevision.revision);
    if (!newFilteredDocument) {
      throw new Error('Invalid revision');
    }

    const entityIds = [];
    const fieldIds = [];
    const selectorIds = [];
    const fieldMap = {};
    const selectorMap = {};

    // Extract old document values.
    traverseDocument(storedRevision.document, {
      visitField(field) {
        fieldIds.push(field.id);
        fieldMap[field.id] = field;
        if (field.selector) {
          selectorIds.push(field.selector.id);
          selectorMap[field.selector.id] = field.selector;
        }
      },
      visitEntity(entity) {
        entityIds.push(entity.id);
        if (entity.selector) {
          selectorIds.push(entity.selector.id);
          selectorMap[entity.selector.id] = entity.selector.state;
        }
      },
    });

    const fieldsToAdd: Array<{ field: BaseField; term: string; parent: CaptureModelType['document'] }> = [];
    const docsToHydrate: Array<{
      entity: CaptureModelType['document'];
      term?: string;
      parent?: CaptureModelType['document'];
    }> = [];

    // Apply new document changes.
    // @todo find entities that have been deleted (and option to allow deletions)
    traverseDocument(req.document, {
      visitField(field, term, parent) {
        if (fieldIds.indexOf(field.id) === -1) {
          if (!parent.immutable) {
            // This does need to be created, but will be created when creating document.
            return;
          }
          // Create.
          fieldsToAdd.push({ field, term, parent });
          return;
        }
        fieldIds.splice(fieldIds.indexOf(field.id), 1);

        if (!deepEqual(fieldMap[field.id].value, field.value)) {
          // UPDATE @todo treating this the same as creation.
          fieldsToAdd.push({ field, term, parent });
          return;
        }
      },
      visitEntity(entity, term, parent) {
        if (entity.immutable === false && parent && parent.immutable && entityIds.indexOf(entity.id) === -1) {
          docsToHydrate.push({ entity, term, parent });
          return;
        }
        entityIds.splice(fieldIds.indexOf(entity.id), 1);
      },
    });

    if (allowDeletedFields === false && (fieldIds.length || entityIds.length)) {
      throw new Error('Cannot remove fields');
    }

    const entityMap: { [id: string]: CaptureModelType['document'] } = {};
    traverseDocument(captureModel.document, {
      visitEntity(entity) {
        entityMap[entity.id] = entity;
      },
    });

    // Everything we need to add into the database.
    const dbInserts: (Field | Document | Property)[][] = [
      // Map the documents, adding missing fields if required.
      ...partialDocumentsToInserts(docsToHydrate, entityMap, captureModel.document.id),
      // Map the fields
      fieldsToInserts(fieldsToAdd),
    ];

    const dbRemovals: (Field | Document)[] = [
      ...fieldIds.map(id => fromField(fieldMap[id])),
      ...entityIds.map(id => fromDocument(entityMap[id]), false),
    ];

    // Save the revision.
    await this.manager.transaction(async manager => {
      for (const insert of dbInserts) {
        // @todo change this to insert() and expand list of inserts to other entities.
        //   This will avoid updates and allow the whole list to be inserted flat.
        await manager.save(insert);
      }
      // Double check.
      if (allowDeletedFields && dbRemovals.length) {
        await manager.remove(dbRemovals);
      }
    });

    return this.getRevision(req.revision.id);
  }

  /**
   * Remove a revision
   *
   * @param revisionId
   * @param allowRemoveCanonical
   */
  async removeRevision(revisionId: string, { allowRemoveCanonical = false }: { allowRemoveCanonical?: boolean } = {}) {
    // Need some options here. Although this will be a reviewer-instantiated call, we want to make sure
    // that the revision has not already been accepted (or config for that) and that it is safe to remove.
    const revision = await this.getRevision(revisionId);

    if (allowRemoveCanonical) {
      await this.manager.remove(fromRevision(revision.revision), { transaction: true });
    }

    if (!allowRemoveCanonical) {
      throw new Error('Not yet implemented');
    }
  }
}
