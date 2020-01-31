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
    for (const field of prop) {
      if (isEntity(field)) {
        if (first && transforms.visitFirstEntity) {
          if (transforms.visitFirstEntity(field, propKey, document)) {
            traverseDocument(field, transforms);
          }
          break;
        }
        traverseDocument(field, transforms);
      } else {
        if (first && transforms.visitFirstField) {
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
