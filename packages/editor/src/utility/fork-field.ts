import { isEntity } from '@capture-models/editor';
import { pluginStore } from '@capture-models/plugin-api';
import { BaseField, CaptureModel } from '@capture-models/types';
import copy from 'fast-copy';
import { generateId } from './generate-id';

export function formPropertyValue<T extends BaseField | CaptureModel['document']>(
  field: T,
  {
    generateNewId = true,
    authors,
    revision,
    clone = true,
    forkValue = false,
    revisesFork = true,
  }: { generateNewId?: boolean, clone?: boolean; authors?: string[]; forkValue?: boolean; revision?: string; revisesFork?: boolean } = {},
): T {
  // Copy whole field.
  const id = field.id;
  const newField = clone ? copy(field) : field;

  // Check if we need a new value.
  if (!forkValue && !isEntity(field) && !isEntity(newField)) {
    const description = pluginStore.fields[field.type];
    if (!description) {
      throw new Error('Invalid field');
    }

    (newField as BaseField).value = description.defaultValue;
  }

  // Create revision
  if (revision) {
    newField.revision = revision;
  } else if (newField.revision) {
    delete newField.revision;
  }
  // Create revises.
  if (revisesFork) {
    newField.revises = id;
  } else if (newField.revises) {
    delete newField.revises;
  }
  // Create authors.
  if (newField.authors) {
    if (authors) {
      newField.authors = authors;
    } else {
      delete newField.authors;
    }
  }

  // Finally, set a new ID.
  newField.id = generateId();

  return newField;
}
