import { expandModelFields } from '../../../core/structure-editor';
import { CaptureModel, ModelFields, Revision, StructureType } from '../../../types/capture-model';
import { filterCaptureModel } from '../../../utility/filter-capture-model';
import { flattenStructures } from '../../../utility/flatten-structures';

export type RevisionItem = {
  document: CaptureModel['document'];
  revision: Revision;
};

export function captureModelToRevisionList(captureModel: CaptureModel, includeStructures = false): RevisionItem[] {
  const models: RevisionItem[] = [];

  for (const revision of captureModel.revisions || []) {
    const flatFields = expandModelFields(revision.fields);
    const document = filterCaptureModel(revision.id, captureModel.document, flatFields, field => {
      return field.revision ? field.revision === revision.id : false;
    });
    if (document) {
      models.push({
        revision,
        document,
      });
    }
  }
  if (includeStructures) {
    const flatStructures = flattenStructures(captureModel.structure);

    for (const structure of flatStructures) {
      const flatFields = expandModelFields(structure.fields);
      const structureDocument = filterCaptureModel(structure.id, captureModel.document, flatFields, field => {
        return !field.revision; // Where there is no revision.
      });
      if (structureDocument) {
        models.push({
          revision: {
            id: structure.id,
            fields: structure.fields,
            approved: true,
            structureId: structure.id,
            label: structure.label,
          },
          document: structureDocument,
        });
      }
    }
  }

  return models;
}
