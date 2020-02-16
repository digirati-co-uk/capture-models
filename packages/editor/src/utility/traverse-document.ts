import { CaptureModel, BaseField, BaseSelector } from '@capture-models/types';
import { isEntity } from './is-entity';

export function traverseDocument<TempEntityFields = any>(
  document: CaptureModel['document'] & { temp?: Partial<TempEntityFields> },
  transforms: {
    visitFirstField?: (
      field: BaseField,
      key: string,
      parent: CaptureModel['document'] & { temp?: Partial<TempEntityFields> }
    ) => boolean;
    visitField?: (
      field: BaseField,
      key: string,
      parent: CaptureModel['document'] & { temp?: Partial<TempEntityFields> }
    ) => void;
    visitSelector?: (
      selector: BaseSelector,
      parent: (CaptureModel['document'] & { temp?: Partial<TempEntityFields> }) | BaseField
    ) => void;
    visitEntity?: (
      entity: CaptureModel['document'] & { temp?: Partial<TempEntityFields> },
      key?: string,
      parent?: CaptureModel['document'] & { temp?: Partial<TempEntityFields> }
    ) => void;
    visitFirstEntity?: (
      entity: CaptureModel['document'] & { temp?: Partial<TempEntityFields> },
      key: string,
      parent: CaptureModel['document'] & { temp?: Partial<TempEntityFields> }
    ) => boolean;
  }
) {
  for (const propKey of Object.keys(document.properties)) {
    const prop = document.properties[propKey];
    let first = true;
    for (const field of prop) {
      if (isEntity(field)) {
        if (first && transforms.visitFirstEntity) {
          first = false;
          if (transforms.visitFirstEntity(field, propKey, document)) {
            traverseDocument(field, transforms);
          }
          break;
        }
        traverseDocument(field, transforms);
      } else {
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
  if (document.temp) {
    delete document.temp;
  }
}
