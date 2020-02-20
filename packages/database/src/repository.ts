import { EntityManager, EntityRepository } from 'typeorm';
import { CaptureModel as CaptureModelType } from '@capture-models/types';
import { traverseDocument } from '../../editor/src/utility/traverse-document';
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
   */
  async getCaptureModel(id: string): Promise<CaptureModelType> {
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

  /**
   * Create revision
   *
   * When creating a revision it's important to know that you do not have all of the capture
   * model fields. You have the original canonical fields and the current revision.
   *
   * The purpose of this is to merge in that revision and it's fields into the main document.
   *
   * @param revisionId The ID of the revision, should be generated on the frontend. This will be checked
   *                   as a unique value.
   * @param documentId The ID of the original document that is being revised.
   * @param revision The partial capture model with revisions.
   */
  createRevision(revisionId: string, documentId: string, revision: CaptureModelType) {}

  /**
   * Update a revision
   *
   * @param revisionId
   * @param revision
   */
  updateRevision(revisionId: string, revision: CaptureModelType) {}

  /**
   * Remove a revision
   *
   * @param revisionId
   */
  removeRevision(revisionId: string) {}
}
