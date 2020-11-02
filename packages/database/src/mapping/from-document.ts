import { BaseField, CaptureModel } from '@capture-models/types';
import { isEntityList } from '@capture-models/helpers';
import { Document } from '../entity/Document';
import { Property } from '../entity/Property';
import { fromField } from './from-field';
import { fromSelector } from './from-selector';

export function fromDocument(input: CaptureModel['document'], instances = true): Document {
  const document = new Document();

  document.id = input.id;
  document.label = input.label;
  document.pluralLabel = input.pluralLabel;
  document.labelledBy = input.labelledBy;
  document.description = input.description;
  document.profile = input.profile;
  document.allowMultiple = !!input.allowMultiple;
  document.properties = [];

  if (input.selector) {
    document.selector = fromSelector(input.selector);
  }

  const terms = Object.keys(input.properties);
  for (const term of terms) {
    const fields = input.properties[term];

    const property = new Property();
    property.id = `${document.id}/${term}`;
    property.documentId = document.id;
    property.term = term;

    if (isEntityList(fields)) {
      property.type = 'entity-list';
      if (instances) {
        property.documentInstances = Promise.resolve(
          (fields as CaptureModel['document'][]).map(doc => fromDocument(doc))
        );
      }
    } else {
      property.type = 'field-list';
      if (instances) {
        property.fieldInstances = Promise.resolve((fields as BaseField[]).map(fromField));
      }
    }

    document.properties.push(property);
  }

  if (input.revision) {
    document.revisionId = input.revision;
  }

  if (input.revises) {
    document.revisesId = input.revises;
  }

  return document;
}
