import { EntityManager, EntityRepository } from 'typeorm';
import { CaptureModel as CaptureModelType, RevisionRequest } from '@capture-models/types';
import { traverseDocument } from '@capture-models/editor';
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
  createRevision(
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
    const doc = req.document;

    // If the source is `structure` we want to validate that the fields match.
    const source = req.source;

    // If the source is `structure` we want to make sure a user was associated. We add this to the revision.
    // This will be added by the consuming service. (In addition to checking `allowCanonicalChanges`)
    const author = req.author;

    // If the source is `structure` we also want to check the attached structureId and compare it against
    // the fields loaded. Although these may drift
    const structure = req.revision.structureId;

    // We can use the fields to map the properties.
    const fields = req.revision.fields;

    // Using the fields above, we can extract the new values, ensuring that the revision ID is attached.
    const props = doc.properties;

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
   * Remove a revision
   *
   * @param revisionId
   */
  removeRevision(revisionId: string) {
    // Need some options here. Although this will be a reviewer-instantiated call, we want to make sure
    // that the revision has not already been accepted (or config for that) and that it is safe to remove.
  }
}
