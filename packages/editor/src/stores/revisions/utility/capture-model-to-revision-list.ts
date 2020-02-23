import { RevisionRequest } from '@capture-models/types';
import { expandModelFields } from '../../../core/structure-editor';
import { CaptureModel } from '@capture-models/types';
import { filterCaptureModel } from '../../../utility/filter-capture-model';
import { flattenStructures } from '../../../utility/flatten-structures';

export function captureModelToRevisionList(captureModel: CaptureModel, includeStructures = false): RevisionRequest[] {
  const models: RevisionRequest[] = [];

  if (includeStructures) {
    const flatStructures = flattenStructures(captureModel.structure);
    for (const structure of flatStructures) {
      const flatFields = expandModelFields(structure.fields);
      const structureDocument = filterCaptureModel(structure.id, captureModel.document, flatFields, field => {
        return !field.revision; // Where there is no revision.
      });

      if (structureDocument) {
        models.push({
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
        });
      }
    }
  }

  for (const revision of captureModel.revisions || []) {
    const flatFields = expandModelFields(revision.fields);
    const document = filterCaptureModel(revision.id, captureModel.document, flatFields, field => {
      return field.revision ? field.revision === revision.id : false;
    });
    if (document) {
      models.push({
        captureModelId: captureModel.id,
        revision,
        document,
        source: revision.structureId ? 'structure' : 'unknown',
      });
    }
  }

  return models;
}
