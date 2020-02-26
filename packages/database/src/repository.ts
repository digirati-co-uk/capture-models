import { Brackets, EntityManager, EntityRepository } from 'typeorm';
import { BaseField, CaptureModel as CaptureModelType, RevisionRequest, StatusTypes } from '@capture-models/types';
import { traverseDocument } from '@capture-models/editor/lib/utility/traverse-document';
import { hydratePartialDocument, validateRevision, isEntityList } from '@capture-models/editor';
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

    try {
      return (await toCaptureModel(await builder.getOne())) as any;
    } catch (err) {
      throw new Error(`Capture model ${id} not found`);
    }
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

    return this.getCaptureModel(captureModel.id, { revisionId: revision.id });
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
    throw new Error('Not yet implemented');
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
  async removeRevision(revisionId: string) {
    // Need some options here. Although this will be a reviewer-instantiated call, we want to make sure
    // that the revision has not already been accepted (or config for that) and that it is safe to remove.
    throw new Error('Not yet implemented');
  }
}
