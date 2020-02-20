import { BaseField } from '../../../types/src/field-types';
import { Field } from '../entity/Field';
import { toSelector } from './to-selector';

export function toField({
  type,
  revisionId,
  allowMultiple,
  description,
  selector,
  additionalProperties,
  id,
  label,
  value,
}: Field): BaseField {
  return {
    id,
    type,
    label,
    description,
    value,
    allowMultiple,
    selector: selector ? toSelector(selector) : undefined,
    revision: revisionId,
    ...additionalProperties,
  };
}
