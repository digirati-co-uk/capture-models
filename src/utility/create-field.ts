import generateId from 'nanoid';
import { FieldTypes } from '../types/field-types';

export function createField(field: Partial<FieldTypes> = {}): FieldTypes {
  return {
    id: generateId(),
    label: field.label || 'Untitled field',
    ...field,
  };
}
