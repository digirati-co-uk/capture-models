import { BaseField } from '@capture-models/types';
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
    value,
    description: description ? description : undefined,
    allowMultiple: allowMultiple ? allowMultiple : undefined,
    selector: selector ? toSelector(selector) : undefined,
    revision: revisionId ? revisionId : undefined,
    ...additionalProperties,
  };
}
