import { EntityManager, EntityRepository } from 'typeorm';
import {
  BaseField,
  BaseSelector,
  CaptureModel as CaptureModelType,
  Contributor as ContributorType,
  RevisionRequest,
  StatusTypes,
  Target,
} from '@capture-models/types';
import {
  traverseDocument,
  validateRevision,
  filterDocumentByRevision,
  findStructure,
  createRevisionRequestFromStructure,
  forkExistingRevision,
} from '@capture-models/helpers';
import { generateId } from '@capture-models/helpers';
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
import deepEqual from 'fast-deep-equal';
import { fieldsToInserts } from './utility/fields-to-inserts';
import { partialDocumentsToInserts } from './utility/partial-documents-to-inserts';
import { RevisionAuthors } from './entity/RevisionAuthors';
import { diffAuthors } from './utility/diff-authors';
import { PublishedFields } from './entity/PublishedFields';
import { SelectorInstance } from './entity/SelectorInstance';
import { fromSelector } from './mapping/from-selector';

@EntityRepository()
export class CaptureModelRepository {
  constructor(private manager: EntityManager) {}

  async getCaptureModel(
    id: string,
    {
      includeCanonical,
      revisionStatus,
      revisionStatuses = [],
      revisionId,
      userId,
      context,
    }: {
      includeCanonical?: boolean;
      revisionStatus?: StatusTypes;
      revisionStatuses?: StatusTypes[];
      revisionId?: string;
      userId?: string;
      context?: string[];
    } = {}
  ): Promise<CaptureModelType & { id: string }> {
    const builder = await this.manager
      .createQueryBuilder()
      .select('model')
      .from(CaptureModel, 'model')
      .leftJoinAndSelect('model.document', 'doc')
      .leftJoinAndSelect('model.structure', 'structure')
      .leftJoinAndSelect('structure.flatItems', 'structureFlatItem')
      .leftJoinAndSelect('model.revisions', 'revision')
      .leftJoinAndSelect('model.contributors', 'contributor')
      .leftJoinAndSelect('doc.selector', 'selector')
      .leftJoinAndSelect('doc.nestedProperties', 'property')
      .leftJoinAndSelect('property.fieldInstances', 'fi')
      .leftJoinAndSelect('property.documentInstances', 'di')
      .leftJoinAndSelect('di.selector', 'dis')
      .leftJoinAndSelect('dis.revisedBy', 'dirs')
      .leftJoinAndSelect('fi.selector', 'fis')
      .leftJoinAndSelect('fis.revisedBy', 'firs')
      .leftJoinAndSelect('revision.authors', 'ri')
      .where('doc.captureModelId = :id', { id })
      .addOrderBy('di.revisionOrder', 'ASC')
      .addOrderBy('fi.revisionOrder', 'ASC');

    if (revisionStatuses.length === 0 && revisionStatus) {
      revisionStatuses.push(revisionStatus);
    }

    if (context) {
      builder.andWhere('model.context ?& array[:...ctx]::TEXT[]', { ctx: context });
    }

    if (includeCanonical && !revisionStatus) {
      // @todo find out if there is another case where this DOES need to be set.
      // revisionStatus = 'accepted';
    }

    if (revisionStatus || includeCanonical || userId) {
      builder.leftJoin('fi.revision', 'fir').leftJoin('di.revision', 'dir');
    }

    if (revisionStatus || includeCanonical) {
      if (revisionStatus && ['draft', 'submitted', 'accepted'].indexOf(revisionStatus.toLowerCase()) === -1) {
        throw new Error(
          `Invalid revision status ${revisionStatus}, should be one of ['draft', 'submitted', 'accepted']`
        );
      }
    }

    const captureModel = await builder.getOne();

    if (!captureModel) {
      throw new Error(`Capture model ${id} not found`);
    }

    return (await toCaptureModel(captureModel, { revisionId, userId, revisionStatus })) as any;
  }

  /**
   * Get all capture models
   * Returns a page of capture models.
   *
   * @todo figure out what fields we actually need for this.
   *
   * @param page The page requested
   * @param pageSize The number of results
   * @param context
   * @param includeDerivatives
   * @param target
   * @param derivedFrom
   */
  async getAllCaptureModels(
    page = 0,
    pageSize = 20,
    {
      context,
      includeDerivatives = false,
      target,
      derivedFrom,
    }: {
      context?: string[];
      includeDerivatives?: boolean;
      target?: { id: string; type: string };
      derivedFrom?: string;
    } = {}
  ) {
    const query = this.manager
      .createQueryBuilder()
      .select(['capture_model.id as id', 'COUNT(df.id) as derivatives'])
      .from(CaptureModel, 'capture_model')
      .leftJoin('capture_model.structure', 'structure')
      .leftJoin('capture_model.derivedFrom', 'df')
      .addSelect('structure.label', 'label')
      .groupBy('capture_model.id')
      .addGroupBy('structure.id');

    if (derivedFrom) {
      query.andWhere('capture_model.derivedFromId = :derivedFrom::uuid', { derivedFrom });
    } else if (!includeDerivatives) {
      query.where('capture_model.derivedFromId IS NULL');
    }

    if (target) {
      query.andWhere(
        `jsonb_path_query_first(capture_model.target, '$[*] ? (@.type == $type && @.id == $id)', :target::jsonb) is not null`,
        {
          target: { id: target.id, type: target.type },
        }
      );
    }

    if (context) {
      query.andWhere('capture_model.context ?& array[:...ctx]::TEXT[]', { ctx: context });
    }

    query.take(pageSize).skip(page * pageSize);

    return await query.getRawMany();
  }

  /**
   * Get all revisions
   *
   * Returns a page of revisions.
   *
   * @param page The page requested
   * @param pageSize The number of results
   */
  async getAllRevisions(page = 0, pageSize = 20) {
    const result: Array<{ revision_label: string; revision_id: string }> = await this.manager
      .createQueryBuilder()
      .select(['revision.id', 'revision.label'])
      .from(Revision, 'revision')
      .take(pageSize)
      .skip(page * pageSize)
      .getRawMany();

    // eslint-disable-next-line @typescript-eslint/camelcase
    return result.map(r => ({ id: r.revision_id, label: r.revision_label }));
  }

  /**
   * Create Capture Model
   * Creates a canonical capture model. This should be an admin operation only.
   *
   * @param model
   * @param context
   * @param user
   */
  async saveCaptureModel(
    {
      // list of fields
      integrity,
      document,
      contributors,
      id,
      revisions,
      structure,
      target,
      derivedFrom,
    }: CaptureModelType,
    { context, user }: { context?: string[]; user?: ContributorType } = {}
  ) {
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
        if (user && (!contributors || !contributors[user.id])) {
          contributors = contributors ? contributors : {};
          contributors[user.id] = user;
        }

        const mappedContributors = Object.values(contributors || {}).map(fromContributor);
        if (contributors) {
          await manager.save(Contributor, mappedContributors);
        }

        // Revision - depends on Contributors & Structures
        const mappedRevisions = (revisions || []).map(fromRevision);

        if (mappedRevisions) {
          for (const rev of mappedRevisions) {
            const allAuthors = rev.authors || [];
            const dbRevision = await manager.findOne(Revision, rev.id);

            if (dbRevision) {
              // Find diff of authors.
              const { toAdd, toRemove } = diffAuthors(dbRevision, rev);
              // Then remove the authors field.
              delete rev.authors;
              // Merge and save the revision.
              await manager.save(Revision, rev);
              // Save the new authors
              await manager.save(toAdd);
              // Remove the old authors.
              await manager.remove(toRemove);
            } else {
              delete rev.authors;
              await manager.save(Revision, rev);
              await manager.save(allAuthors);
            }
          }
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
        captureModel.derivedFromId = derivedFrom;
        captureModel.document = fromDocument(document, false); // technically document[0]
        captureModel.structure = mappedStructure;
        if (revisions) {
          captureModel.revisions = mappedRevisions;
        }
        if (contributors) {
          captureModel.contributors = mappedContributors;
        }

        captureModel.context = context;
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
   * @param deleteDerivatives
   */
  async removeCaptureModel(id: string, version?: number, deleteDerivatives = true) {
    const toRemove = await this.manager.findOne(CaptureModel, { id });

    if (!toRemove) {
      throw new Error(`Capture model ${id} not found`);
    }

    if (typeof version !== 'undefined' && toRemove.version !== version) {
      throw new Error('Version does not match');
    }

    const structureId = toRemove.structureId;
    return await this.manager.transaction(async manager => {
      if (deleteDerivatives) {
        // We need to look for derived.
        const query = this.manager
          .createQueryBuilder()
          .select(['capture_model.id as id'])
          .from(CaptureModel, 'capture_model')
          .where({
            derivedFromId: id,
          });
        // Remove models derived from this model.
        const derivatives = await query.getRawMany();
        if (derivatives.length) {
          for (const result of derivatives) {
            await this.removeCaptureModel(result.id);
          }
        }
      }

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

  async forkCaptureModel(
    id: string,
    target: Target[],
    creator?: ContributorType,
    context?: string[]
  ): Promise<CaptureModelType> {
    const model = await this.getCaptureModel(id, { context });

    // { context, user }: { context?: string[]; user?: ContributorType } = {}

    // This might be able to check if a field exists at a target, but that is for the
    // application calling to decide. It's valid in here to have 2 capture models that are
    // derived form the same model against the same target.
    // Create json_populate_recordset and then query for target and type

    traverseDocument(model.document, {
      visitEntity(entity) {
        entity.id = generateId();
      },
      visitField(field) {
        field.id = generateId();
      },
      visitSelector(selector) {
        selector.id = generateId();
      },
    });

    model.id = generateId();
    model.revisions = [];
    model.contributors = creator ? { [creator.id]: creator } : {};
    model.derivedFrom = id;
    model.target = target;

    return await this.saveCaptureModel(model, { user: creator, context });
  }

  async getRevision(id: string, context?: string[]): Promise<RevisionRequest> {
    const model = await this.manager.findOne(Revision, id);
    if (!model) {
      throw new Error(`Revision: ${id} was not found`);
    }
    const revision = toRevision(model);
    const fullModel = await this.getCaptureModel(model.captureModelId, {
      revisionId: id,
      context,
    });

    return {
      captureModelId: model.captureModelId,
      source: model.source,
      document: fullModel.document,
      revision,
    };
  }

  async searchPublishedFields(
    where: {
      canvas?: string;
      manifest?: string;
      collection?: string;
      field_type?: string;
      selector_type?: string;
      parent_property?: string;
      capture_model_id?: string;
    },
    query?: string,
    context?: string[]
  ) {
    const builder = this.manager
      .createQueryBuilder()
      .select('p')
      .from(PublishedFields, 'p')
      .where(where)
      .andWhere('(p.selector is not null or p.parent_selector is not null)');

    if (query) {
      builder.andWhere('p.value::text ILIKE :search', { search: `%${query}%` });
    }

    if (context) {
      builder.andWhere('p.context::jsonb ?& array[:ctx]::TEXT[]', { ctx: context[0] });
    }

    return await builder.getMany();
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

  async captureModelExists(id: string, context?: string[]) {
    const query = this.manager
      .createQueryBuilder()
      .select('c.id')
      .from(CaptureModel, 'c')
      .where({ id });

    if (context) {
      query.andWhere('c.context ?& array[:...ctx]::TEXT[]', { ctx: context });
    }

    const count = await query.getCount();

    return count !== 0;
  }

  async cloneRevision(
    captureModelId: string,
    revisionId: string,
    { context, user }: { context?: string[]; user?: ContributorType }
  ) {
    const req = await this.getRevisionTemplate(captureModelId, revisionId, {
      context,
      includeRevisions: true,
      includeStructures: false,
    });

    // Add additional author.
    if (user && req.revision.authors.indexOf(user.id) === -1) {
      req.revision.authors.push(user.id);
    }

    // Add user as owner of clone.
    if (user) {
      req.author = user;
    }

    // Add new id.
    const originalId = req.revision.id;
    const newId = generateId();
    req.revision.revises = originalId;
    req.revision.id = newId;

    traverseDocument(req.document, {
      visitField(field) {
        if (field.revision === originalId) {
          field.id = generateId();
          field.revision = newId;
          if (field.selector) {
            field.selector.id = generateId();
          }
        }
      },
      visitEntity(entity) {
        if (entity.revision === originalId) {
          entity.id = generateId();
          entity.revision = newId;
          if (entity.selector) {
            entity.selector.id = generateId();
            if (entity.selector.revisedBy) {
              for (const selector of entity.selector.revisedBy) {
                if (selector.revisionId && selector.revisionId === originalId) {
                  selector.id = generateId();
                  selector.revisionId = newId;
                  if (selector.revises) {
                    selector.revises = entity.selector.id;
                  }
                }
              }
            }
          }
        }
      },
    });

    return req;
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
   * @param context
   * @param user
   * @param createNewCaptureModel Creates a new capture model from the one provided
   * @param allowCanonicalChanges Allows the request to make canonical changes to the document in this revision
   * @param allowCustomStructure Allows the request to deviate from the structure stored in the database
   * @param allowOverwrite Allows the request to mutate existing fields
   * @param allowAnonymous Allows `author` to be omitted
   */
  async createRevision(
    req: RevisionRequest,
    {
      context,
      user,
      createNewCaptureModel = false,
      allowCanonicalChanges = false,
      allowCustomStructure = false,
      allowOverwrite = false,
      allowAnonymous = false,
    }: {
      context?: string[];
      user?: ContributorType;
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

    if (user) {
      req.author = user;
    }

    // @todo only return the canonical model.
    // @todo If this doesn't exist, then we're creating a new one?
    const captureModel = await this.getCaptureModel(req.captureModelId, {
      includeCanonical: true,
      context,
    });

    // Fix for when the base document is not marked as immutable.
    if (!req.document.immutable) {
      req.document.immutable = true;
    }

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
    const selectorsToHydrate: Array<{
      selector: BaseSelector;
      parentSelector: BaseSelector;
    }> = [];

    traverseDocument(req.document, {
      visitField(field, term, parent) {
        if (parent.immutable && field.revision === req.revision.id) {
          fieldsToAdd.push({ field, term, parent });
        }
      },
      visitEntity(entity, term, parent) {
        if (entity.immutable === false && parent && parent.immutable) {
          docsToHydrate.push({ entity, term, parent });
        }
      },
      visitSelector(selector, parent, isRevision, parentSelector) {
        if (isRevision && selector.revisionId && selector.revisionId === req.revision.id) {
          selectorsToHydrate.push({
            selector,
            parentSelector,
          });
        }
      },
    });

    const requestedToDelete = req.revision.deletedFields || [];
    const revisionToDelete = [];
    const entityMap: { [id: string]: CaptureModelType['document'] } = {};
    traverseDocument(captureModel.document, {
      visitEntity(entity) {
        entityMap[entity.id] = entity;
        if (!entity.immutable && requestedToDelete.indexOf(entity.id) !== -1) {
          revisionToDelete.push(entity.id);
        }
      },
      visitField(field) {
        if (!field.immutable && requestedToDelete.indexOf(field.id) !== -1) {
          revisionToDelete.push(field.id);
        }
      },
    });

    if (createNewCaptureModel) {
      // @todo Create new capture model, forking the entire thing. How does this change? Can this use hydrate at the root?
      throw new Error('Not yet implemented [create new capture model]');
    }

    if (allowOverwrite) {
      // @todo, we need to validate that the fields do not already exist in the DB.
      throw new Error('Not yet implemented [allow overwrite]');
    }

    if (
      fieldsToAdd.length === 0 &&
      docsToHydrate.length === 0 &&
      revisionToDelete.length === 0 &&
      selectorsToHydrate.length === 0
    ) {
      throw new Error('Invalid revision - no valid fields or documents found');
    }

    const contributor = req.author ? fromContributor(req.author) : null;

    // Everything we need to add into the database.
    const dbInserts: (Field | Document | Property | Contributor | RevisionAuthors | SelectorInstance)[][] = [
      // Map the documents, adding missing fields if required.
      ...partialDocumentsToInserts(docsToHydrate, entityMap, captureModel.document.id),
      // Map the fields
      fieldsToInserts(fieldsToAdd),
      // Map the selectors (should be good as is?)
      selectorsToHydrate.map(s => {
        return fromSelector(s.selector, s.parentSelector);
      }),
    ];

    const revision = fromRevisionRequest(req);

    if (allowCanonicalChanges) {
      revision.approved = req.revision.status === 'accepted';
    } else if (req.revision.status === 'accepted') {
      revision.status = 'submitted';
    }

    if (contributor) {
      const author = new RevisionAuthors();
      author.revisionId = revision.id;
      author.contributorId = contributor.id;
      dbInserts.push([author]);
    }

    // Save the revision.
    await this.manager.transaction(async manager => {
      if (contributor) {
        await manager.save(contributor);
      }
      const rev = await manager.save(revision);

      for (const insert of dbInserts) {
        // @todo change this to insert() and expand list of inserts to other entities.
        //   This will avoid updates and allow the whole list to be inserted flat.
        for (const single of insert) {
          await manager.save(single);
        }
      }
      return rev;
    });

    return this.getRevision(req.revision.id, context);
  }

  /**
   * Updating of existing revision.
   *
   * @param req
   * @param user
   * @param context
   * @param allowAdditionalFields
   * @param allowUserMismatch
   * @param allowDeletedFields
   * @param allowReview
   */
  async updateRevision(
    req: RevisionRequest,
    {
      user,
      context,
      allowAdditionalFields = false,
      allowUserMismatch = false,
      allowDeletedFields = false,
      allowReview = false,
    }: {
      user?: ContributorType;
      allowAdditionalFields?: boolean;
      allowDeletedFields?: boolean;
      allowUserMismatch?: boolean;
      allowReview?: boolean;
      context?: string[];
    } = {}
  ) {
    const storedRevision = await this.getRevision(req.revision.id);
    const captureModel = await this.getCaptureModel(req.captureModelId, { context });

    if (!allowUserMismatch) {
      if (!user) {
        throw new Error('User is required when using `allowUserMismatch`');
      }
      if ((storedRevision.revision.authors || []).length === 0) {
        throw new Error('No user is assigned to this revision');
      }
      if (storedRevision.revision.authors.indexOf(user.id) === -1) {
        throw new Error('User is not allowed to edit this revision');
      }
    }

    // Filter the new document with the stored revision (to be sure.)
    const newFilteredDocument = filterDocumentByRevision(req.document, storedRevision.revision, captureModel.revisions);
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
        if (field.revision && field.revision === req.revision.id) {
          fieldIds.push(field.id);
          fieldMap[field.id] = field;
          if (field.selector) {
            selectorIds.push(field.selector.id);
            selectorMap[field.selector.id] = field.selector;
          }
        }
      },
      visitEntity(entity) {
        if (entity.revision && entity.revision === req.revision.id) {
          entityIds.push(entity.id);
          if (entity.selector) {
            selectorIds.push(entity.selector.id);
            selectorMap[entity.selector.id] = entity.selector.state;
            if (entity.selector.revisedBy) {
              for (const revisedSelector of entity.selector.revisedBy) {
                if (revisedSelector.revisionId && revisedSelector.revisionId === req.revision.id) {
                  selectorIds.push(revisedSelector.id);
                  selectorMap[revisedSelector.id] = revisedSelector.state;
                }
              }
            }
          }
        }
      },
    });

    const fieldsToAdd: Array<{
      field: BaseField;
      term: string;
      parent: CaptureModelType['document'];
      index?: number;
    }> = [];
    const docsToHydrate: Array<{
      entity: CaptureModelType['document'];
      term?: string;
      parent?: CaptureModelType['document'];
      index?: number;
    }> = [];
    const selectorsToHydrate: Array<{
      selector: BaseSelector;
      parentSelector: BaseSelector;
    }> = [];

    // Apply new document changes.
    // @todo find entities that have been deleted (and option to allow deletions)
    traverseDocument(req.document, {
      visitField(field, term, parent) {
        const index = parent.properties[term].indexOf(field as any);

        if (fieldIds.indexOf(field.id) === -1) {
          // if (!parent.immutable) {
          //   // This does need to be created, but will be created when creating document.
          //   return;
          // }
          // Create.
          fieldsToAdd.push({ field, term, parent, index });
          return;
        }
        fieldIds.splice(fieldIds.indexOf(field.id), 1);

        if (
          !deepEqual(fieldMap[field.id].value, field.value) ||
          (field.selector &&
            selectorMap[field.selector.id] &&
            !deepEqual(selectorMap[field.selector.id].state, field.selector.state))
        ) {
          // UPDATE @todo treating this the same as creation.
          fieldsToAdd.push({ field, term, parent, index });
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
      visitSelector(selector, parent, isRevision, parentSelector) {
        if (
          isRevision &&
          selector.revisionId &&
          selector.revisionId === req.revision.id &&
          selector &&
          !deepEqual(selectorMap[selector.id].state, selector.state)
        ) {
          selectorsToHydrate.push({
            selector,
            parentSelector,
          });
        }
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
      // And selectors
      selectorsToHydrate.map(s => {
        return fromSelector(s.selector, s.parentSelector);
      }),
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

      if (
        req.revision.status !== storedRevision.revision.status ||
        req.revision.label !== storedRevision.revision.label
      ) {
        if (allowReview || req.revision.status === 'submitted' || req.revision.status === 'draft') {
          const toSave = fromRevision(storedRevision.revision);
          toSave.status = req.revision.status;
          await manager.update(
            Revision,
            { id: req.revision.id },
            // @ts-ignore
            {
              label: req.revision.label,
              status: req.revision.status,
              approved: req.revision.status === 'accepted',
            }
          );
        }
      }
    });

    return this.getRevision(req.revision.id);
  }

  async forkRevision(
    captureModelId: string,
    revisionId: string,
    {
      context,
      includeRevisions,
      includeStructures,
      cloneMode = 'FORK_TEMPLATE',
      modelMapping = {},
      modelRoot = [],
    }: {
      context?: string[];
      includeRevisions?: boolean;
      includeStructures?: boolean;
      cloneMode?: string; // @todo REVISION_CLONE_MODE has inter-dependency issues
      modelMapping?: any;
      modelRoot?: [];
    } = {}
  ) {
    const baseRevision = await this.getRevisionTemplate(captureModelId, revisionId, {
      context,
      includeRevisions,
      includeStructures,
    });

    return forkExistingRevision(baseRevision, {
      cloneMode,
      modelMapping,
      modelRoot,
    });
  }

  async getRevisionTemplate(
    captureModelId: string,
    revisionId: string,
    {
      context,
      includeRevisions,
      includeStructures,
    }: { context?: string[]; includeRevisions?: boolean; includeStructures?: boolean } = {}
  ) {
    if (includeStructures) {
      const captureModel = await this.getCaptureModel(captureModelId, {
        includeCanonical: false /* @todo change to true */,
        context,
      });
      const foundStructure = findStructure(captureModel, revisionId);
      if (foundStructure) {
        return createRevisionRequestFromStructure(captureModel, foundStructure);
      } // fallthrough to check revisions.
    }

    if (includeRevisions) {
      const revision = await this.getRevision(revisionId);
      if (revision.captureModelId !== captureModelId) {
        throw new Error(
          `Revision does not exist on capture model, found: ${revision.captureModelId}, expected: ${captureModelId}`
        );
      }
      return revision;
    }

    throw new Error('Revision does not exist on capture model');
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
      throw new Error('Not yet implemented [allow remove canonical]');
    }
  }
}
