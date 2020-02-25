import { filterDocumentByRevision } from '@capture-models/editor';
import { CaptureModel, Revision, RevisionRequest } from '@capture-models/types';
import { filterCaptureModel } from './filter-capture-model';
import { expandModelFields } from '../core/structure-editor';

export function createRevisionRequestFromStructure(
  captureModel: CaptureModel,
  structure: CaptureModel['structure']
): RevisionRequest {
  if (structure.type !== 'model') {
    throw new Error('Cannot make revision from choice');
  }

  const flatFields = expandModelFields(structure.fields);
  const structureDocument = filterCaptureModel(structure.id, captureModel.document, flatFields, field => {
    return !field.revision; // Where there is no revision.
  });

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

export function createRevisionRequest(
  captureModel: CaptureModel,
  revision: Revision,
  inputDocument?: CaptureModel['document']
): RevisionRequest {
  const document = inputDocument ? inputDocument : filterDocumentByRevision(captureModel.document, revision);

  if (!document) {
    throw new Error(`Invalid revision ${revision.id} has no document`);
  }

  return {
    captureModelId: captureModel.id,
    revision,
    document,
    source: revision.structureId ? 'structure' : 'unknown',
  };
}
