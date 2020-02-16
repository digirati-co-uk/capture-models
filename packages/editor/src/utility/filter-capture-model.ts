import { isEntityList } from '@capture-models/editor';
import { CaptureModel, BaseField } from '@capture-models/types';

export function filterCaptureModel(
  id: string,
  document: CaptureModel['document'],
  flatFields: string[][],
  predicate: (field: BaseField) => boolean
): CaptureModel['document'] | null {
  const newDocument: CaptureModel['document'] = {
    id,
    ...document,
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

  // Now we filter.
  const propertyNames = Object.keys(newDocument.properties);
  for (const prop of propertyNames) {
    const possibleEntityList = newDocument.properties[prop];
    if (isEntityList(possibleEntityList)) {
      // Now we need to merge.
      const newProperties: {
        [key: string]: CaptureModel['document'];
      } = {};
      for (const instance of possibleEntityList) {
        if (newProperties[instance.id]) {
          Object.assign(newProperties[instance.id].properties, instance.properties);
        } else {
          newProperties[instance.id] = instance;
        }
      }
      newDocument.properties[prop] = Object.values(newProperties);
    }
  }

  if (Object.keys(newDocument.properties).length > 0) {
    return newDocument;
  }

  return null;
}
