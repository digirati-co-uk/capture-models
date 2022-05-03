import { BaseField } from '@capture-models/types';
import { Field } from '../entity/Field';
import { toSelector } from './to-selector';

export async function toField({
  type,
  revisionId,
  allowMultiple,
  description,
  selector,
  additionalProperties,
  id,
  revisesId,
  label,
  value,
  profile,
  dataSources,
}: Field): Promise<BaseField> {
  return {
    id,
    type,
    label,
    value,
    revises: revisesId ? revisesId : undefined,
    description: description ? description : undefined,
    profile: profile ? profile : undefined,
    allowMultiple: allowMultiple ? allowMultiple : undefined,
    selector: selector ? await toSelector(selector) : undefined,
    revision: revisionId ? revisionId : undefined,
    dataSources: dataSources ? dataSources : undefined,
    ...additionalProperties,
  };
}
