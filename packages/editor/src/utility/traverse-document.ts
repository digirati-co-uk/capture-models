import { CaptureModel, BaseField, BaseSelector } from '@capture-models/types';
import { isEntity } from './is-entity';

export function traverseDocument(
  document: CaptureModel['document'],
  transforms: {
    visitFirstField?: (field: BaseField, key: string, parent: CaptureModel['document']) => boolean;
    visitField?: (field: BaseField, key: string, parent: CaptureModel['document']) => void;
    visitSelector?: (selector: BaseSelector, parent: CaptureModel['document'] | BaseField) => void;
    visitEntity?: (entity: CaptureModel['document'], key?: string, parent?: CaptureModel['document']) => void;
    visitFirstEntity?: (entity: CaptureModel['document'], key: string, parent: CaptureModel['document']) => boolean;
  }
) {
  for (const propKey of Object.keys(document.properties)) {
    const prop = document.properties[propKey];
    let first = true;
    for (const untypedField of prop) {
      if (isEntity(untypedField)) {
        const field = untypedField as CaptureModel['document'];
        if (first && transforms.visitFirstEntity) {
          first = false;
          if (transforms.visitFirstEntity(field, propKey, document)) {
            traverseDocument(field, transforms);
          }
          break;
        }
        traverseDocument(field, transforms);
      } else {
        const field = untypedField as BaseField;
        if (first && transforms.visitFirstField) {
          first = false;
          if (transforms.visitFirstField(field, propKey, document)) {
            if (field.selector && transforms.visitSelector) {
              transforms.visitSelector(field.selector, field);
            }
            break;
          }
        }
        if (transforms.visitField) {
          transforms.visitField(field, propKey, document);
        }
      }
      const field = untypedField;
      if (field.selector && transforms.visitSelector) {
        transforms.visitSelector(field.selector, field);
      }
    }
  }
  if (document.selector && transforms.visitSelector) {
    transforms.visitSelector(document.selector, document);
  }
  if (transforms.visitEntity) {
    transforms.visitEntity(document);
  }
}
