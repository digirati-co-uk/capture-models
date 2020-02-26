import { BaseField, CaptureModel as CaptureModelType } from '@capture-models/types';
import { Field } from '../entity/Field';
import { fromField } from '../mapping/from-field';

export function fieldsToInserts(
  fieldsToAdd: Array<{ field: BaseField; term: string; parent: CaptureModelType['document'] }>
) {
  const fieldInserts: Field[] = [];
  for (const field of fieldsToAdd) {
    // In this case, the property will already exist. So we just need to add a field.
    const fieldObj = fromField(field.field);
    fieldObj.parentId = `${field.parent.id}/${field.term}`;
    fieldInserts.push(fieldObj);
  }
  return fieldInserts;
}
