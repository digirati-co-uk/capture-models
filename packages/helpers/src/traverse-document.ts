import { CaptureModel, BaseField, BaseSelector } from '@capture-models/types';
import { isEntity } from './is-entity';

export function traverseDocument<TempEntityFields = any>(
  document: CaptureModel['document'] & { temp?: Partial<TempEntityFields> },
  transforms: {
    visitFirstField?: (
      field: BaseField & { temp?: Partial<TempEntityFields> },
      key: string,
      parent: CaptureModel['document'] & { temp?: Partial<TempEntityFields> }
    ) => boolean;
    visitField?: (
      field: BaseField & { temp?: Partial<TempEntityFields> },
      key: string,
      parent: CaptureModel['document'] & { temp?: Partial<TempEntityFields> }
    ) => void;
    visitSelector?: (
      selector: BaseSelector & { temp?: Partial<TempEntityFields> },
      parent:
        | (CaptureModel['document'] & { temp?: Partial<TempEntityFields> })
        | (BaseField & { temp?: Partial<TempEntityFields> })
    ) => void;
    visitProperty?: (
      property: string,
      list:
        | Array<BaseField & { temp?: Partial<TempEntityFields> }>
        | Array<CaptureModel['document'] & { temp?: Partial<TempEntityFields> }>,
      parent: CaptureModel['document'] & { temp?: Partial<TempEntityFields> }
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
    beforeVisitEntity?: (
      entity: CaptureModel['document'] & { temp?: Partial<TempEntityFields> },
      key?: string,
      parent?: CaptureModel['document'] & { temp?: Partial<TempEntityFields> }
    ) => void;
  },
  key?: string,
  rootParent?: CaptureModel['document'] & { temp?: Partial<TempEntityFields> }
) {
  if (transforms.beforeVisitEntity) {
    transforms.beforeVisitEntity(document, key, rootParent);
  }
  for (const propKey of Object.keys(document.properties)) {
    const prop = document.properties[propKey];
    if (transforms.visitProperty) {
      transforms.visitProperty(propKey, prop, document);
    }
    let first = true;
    for (const field of prop) {
      if (isEntity(field)) {
        if (first && transforms.visitFirstEntity) {
          first = false;
          if (transforms.visitFirstEntity(field, propKey, document)) {
            traverseDocument(field, transforms, propKey, document);
          }
          break;
        }
        traverseDocument(field, transforms, propKey, document);
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
      if ((field as any).temp) {
        delete (field as any).temp;
      }
    }
  }
  if (document.selector && transforms.visitSelector) {
    transforms.visitSelector(document.selector, document);
  }
  if (transforms.visitEntity) {
    transforms.visitEntity(document, key, rootParent);
  }
  if (document.temp) {
    delete document.temp;
  }
}
