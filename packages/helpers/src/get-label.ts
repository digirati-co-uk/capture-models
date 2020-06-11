import { CaptureModel } from '@capture-models/types';
import { isEntity } from './is-entity';

export function getLabel(document: CaptureModel['document']) {
  if (
    document.labelledBy &&
    document.properties[document.labelledBy] &&
    document.properties[document.labelledBy].length > 0
  ) {
    const field = document.properties[document.labelledBy][0];
    if (!isEntity(field) && field.value) {
      return field.value;
    }
  }
  return `Field number (type: ${document.type})`;
}
