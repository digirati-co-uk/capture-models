import { CaptureModel } from '../types/capture-model';
import { FieldTypes } from '../types/field-types';

export function filterCaptureModel(
  id: string,
  document: CaptureModel['document'],
  flatFields: string[][],
  predicate: (field: FieldTypes) => boolean
): CaptureModel['document'] | null {
  const newDocument: CaptureModel['document'] = {
    id,
    type: 'entity',
    label: document.label,
    properties: {},
  };
  for (const [rootFieldKey, ...flatField] of flatFields) {
    const rootField = document.properties[rootFieldKey];
    // These are instances of the root field. The first field indicates the type
    for (const field of rootField) {
      if ((field as CaptureModel['document']).type === 'entity') {
        const filteredModel = filterCaptureModel(field.id, field as CaptureModel['document'], [flatField], predicate);
        if (filteredModel) {
          if (!newDocument.properties[rootFieldKey]) {
            newDocument.properties[rootFieldKey] = [];
          }
          // This would be a new entity.
          newDocument.properties[rootFieldKey].push(filteredModel as any);
        }
      } else {
        if (predicate(field as any)) {
          if (!newDocument.properties[rootFieldKey]) {
            newDocument.properties[rootFieldKey] = [];
          }
          // This is a new field.
          newDocument.properties[rootFieldKey].push(field as any);
        }
        // check if matches condition and add it to new field list.
      }
    }
  }

  if (Object.keys(newDocument.properties).length > 0) {
    return newDocument;
  }

  return null;
}
