import { RevisionRequest } from '@capture-models/types';
import { expandModelFields } from './expand-model-fields';
import { CaptureModel } from '@capture-models/types';
import { createRevisionRequest, createRevisionRequestFromStructure } from './create-revision-request';
import { filterCaptureModel } from './filter-capture-model';
import { flattenStructures } from './flatten-structures';

export function captureModelToRevisionList(captureModel: CaptureModel, includeStructures = false): RevisionRequest[] {
  const models: RevisionRequest[] = [];

  if (!captureModel.id) {
    throw new Error('Cannot make revision on model that has not yet been saved.');
  }

  if (includeStructures) {
    const flatStructures = flattenStructures(captureModel.structure);
    for (const structure of flatStructures) {
      try {
        models.push(createRevisionRequestFromStructure(captureModel, structure));
      } catch (err) {
        console.error(err);
      }
    }
  }

  for (const revision of captureModel.revisions || []) {
    const flatFields = expandModelFields(revision.fields);
    const document = filterCaptureModel(revision.id, captureModel.document, flatFields, field => {
      return field.revision ? field.revision === revision.id : false;
    });
    if (document) {
      models.push(createRevisionRequest(captureModel, revision));
    }
  }

  return models;
}
