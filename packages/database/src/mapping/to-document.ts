import { CaptureModel } from '@capture-models/types';
import { Document } from '../entity/Document';
import { Property } from '../entity/Property';
import { fromSelector } from './from-selector';
import { toField } from './to-field';

export async function toDocument(doc: Document, parentRootProperties?: Property[]): Promise<CaptureModel['document']> {
  const {
    id,
    selector,
    allowMultiple,
    labelledBy,
    description,
    nestedProperties: rootNestedProperties,
    label,
    revisionId,
  } = doc;

  const returnDocument: CaptureModel['document'] = {
    id,
    type: 'entity',
    label,
    description: description ? description : undefined,
    allowMultiple: allowMultiple ? allowMultiple : undefined,
    labelledBy: labelledBy ? labelledBy : undefined,
    revision: revisionId ? revisionId : undefined,
    properties: {},
  };

  const nestedProperties = parentRootProperties ? parentRootProperties : rootNestedProperties;
  const flatProperties = nestedProperties.filter(prop => prop.documentId === id);
  for (const prop of flatProperties || []) {
    if (prop.type !== 'entity-list') {
      // Field list.
      const fields = await prop.fieldInstances;
      returnDocument.properties[prop.term] = fields.map(toField);
    } else {
      // Entity list.
      const entities = await prop.documentInstances;
      returnDocument.properties[prop.term] = await Promise.all(
        entities.map(entity => toDocument(entity, nestedProperties))
      );
    }
  }

  if (selector) {
    returnDocument.selector = fromSelector(selector);
  }

  return returnDocument;
}
