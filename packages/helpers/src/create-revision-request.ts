import { filterDocumentByRevision } from './filter-document-by-revision';
import { CaptureModel, Revision, RevisionRequest } from '@capture-models/types';
import { filterCaptureModel } from './filter-capture-model';
import { expandModelFields } from './expand-model-fields';

export function createRevisionRequestFromStructure(
  captureModel: CaptureModel,
  structure: CaptureModel['structure']
): RevisionRequest {
  if (structure.type !== 'model') {
    throw new Error('Cannot make revision from choice');
  }

  const flatFields = expandModelFields(structure.fields);
  const structureDocument = filterCaptureModel(
    structure.id,
    captureModel.document,
    flatFields,
    (field, otherFields) => {
      if (!field.revision) {
        return otherFields.length === 0; // Canonical
      }

      const revision = (captureModel.revisions || []).find(({ id }) => id === field.revision);

      return !!(revision && revision.approved && revision.status === 'accepted');
    }
  );

  if (!structureDocument) {
    throw new Error(`Invalid structure ${structure.id} (${structure.label})`);
  }

  return {
    captureModelId: captureModel.id,
    revision: {
      id: structure.id,
      fields: structure.fields,
      approved: true,
      structureId: structure.id,
      label: structure.label,
    },
    modelRoot: structure.modelRoot,
    source: 'canonical',
    document: structureDocument,
  };
}

export function createRevisionRequest(captureModel: CaptureModel, revision: Revision): RevisionRequest;
export function createRevisionRequest(
  captureModel: CaptureModel,
  revision: Revision,
  inputDocument: CaptureModel['document']
): RevisionRequest;
export function createRevisionRequest(
  captureModel: string,
  revision: Revision,
  inputDocument: CaptureModel['document']
): RevisionRequest;
/** @internal */
export function createRevisionRequest(
  captureModel: CaptureModel | string,
  revision: Revision,
  inputDocument?: CaptureModel['document']
): RevisionRequest {
  if (typeof captureModel === 'string' && !inputDocument) {
    throw new Error('Invalid call');
  }

  const captureModelId = typeof captureModel === 'string' ? captureModel : captureModel.id;

  const document = inputDocument ? inputDocument : filterDocumentByRevision((captureModel as any).document, revision);

  if (!document) {
    throw new Error(`Invalid revision ${revision.id} has no document`);
  }

  return {
    captureModelId,
    revision,
    document,
    source: revision.structureId ? 'structure' : 'unknown',
  };
}
