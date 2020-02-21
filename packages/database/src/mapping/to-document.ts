import { CaptureModel } from '@capture-models/types';
import { Document } from '../entity/Document';
import { fromSelector } from './from-selector';
import { toField } from './to-field';

export async function toDocument(doc: Document): Promise<CaptureModel['document']> {
  const { id, selector, properties: flatProperties, allowMultiple, labelledBy, description, label, revisionId } = doc;

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

  for (const prop of flatProperties) {
    if (prop.type === 'entity-list') {
      // Entity list.
      const entities = await prop.documentInstances;
      returnDocument.properties[prop.term] = await Promise.all(entities.map(toDocument));
    } else {
      // Field list.
      const fields = await prop.fieldInstances;
      returnDocument.properties[prop.term] = fields.map(toField);
    }
  }

  if (selector) {
    returnDocument.selector = fromSelector(selector);
  }

  return returnDocument;
}
