import { BaseField } from '@capture-models/types';
import { Field } from '../entity/Field';
import { fromSelector } from './from-selector';

export function fromField({
  id,
  selector,
  description,
  allowMultiple,
  label,
  revision,
  type,
  revises,
  value,
  profile,
  dataSources,
  ...additional
}: BaseField): Field {
  const field = new Field();

  field.id = id;
  field.type = type;
  field.value = value;
  field.additionalProperties = additional;
  field.description = description;
  field.label = label;
  field.profile = profile;
  field.allowMultiple = !!allowMultiple;

  if (selector) {
    field.selector = fromSelector(selector);
  }

  if (revision) {
    field.revisionId = revision;
  }

  if (revises) {
    field.revisesId = revises;
  }

  if (dataSources) {
    field.dataSources = dataSources;
  }

  // @todo valueString value from plugin.

  return field;
}
