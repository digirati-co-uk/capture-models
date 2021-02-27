import copy from 'fast-copy';
import { Document } from '../../types/src/capture-model';
import { createNewFieldInstance } from './create-new-field-instance';
import { generateId } from './generate-id';
import { isEntityList } from './is-entity';

export function createNewEntityInstance(
  entity: Document,
  property: string,
  multipleOverride = false,
  revisionId?: string | null
): Document {
  // Grab the property itself from the entity.
  const prop = entity.properties[property];
  if (!prop || prop.length <= 0) {
    throw new Error('invalid property');
  }

  // Grab the template value (first) and ensure it allows multiple instances
  const template = prop[0] as Document;
  if (!template.allowMultiple && !multipleOverride) {
    throw new Error('entity does not support multiple values.');
  }

  const { properties, ...restOfTemplate } = template;

  const clonedRestOfEntity = copy<Partial<Document>>(restOfTemplate);

  const propNames = Object.keys(properties);
  const newProperties: Document['properties'] = {};

  for (const propName of propNames) {
    if (isEntityList(template.properties[propName])) {
      newProperties[propName] = [createNewEntityInstance(template, propName, true, revisionId)];
    } else {
      newProperties[propName] = [createNewFieldInstance(template, propName, true, revisionId)];
    }
  }

  clonedRestOfEntity.id = generateId();
  clonedRestOfEntity.properties = newProperties;
  if (clonedRestOfEntity.selector) {
    clonedRestOfEntity.selector.id = generateId();
    clonedRestOfEntity.selector.state = null;
  }
  clonedRestOfEntity.immutable = false;
  if (clonedRestOfEntity.revises) {
    clonedRestOfEntity.revises = undefined;
  }
  if (revisionId) {
    clonedRestOfEntity.revision = revisionId;
  }

  return clonedRestOfEntity as Document;
}
