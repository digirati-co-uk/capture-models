import generateId from 'nanoid';
import { FieldTypes } from '../types/field-types';

export function createField(field: Partial<FieldTypes> = {}): FieldTypes {
  const finalField = {
    id: generateId(),
    label: field.label || 'Untitled field',
    ...field,
  } as any;

  if (finalField.selector && !finalField.selector.id) {
    finalField.selector.id = generateId();
  }

  return finalField as any;
}
