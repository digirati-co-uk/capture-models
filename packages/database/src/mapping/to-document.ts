import { CaptureModel } from '@capture-models/types';
import { Document } from '../entity/Document';
import { Property } from '../entity/Property';
import { toField } from './to-field';
import { toSelector } from './to-selector';

export async function toDocument(
  doc: Document,
  parentRootProperties?: Property[],
  filters?: { revisionIds?: string[]; publishedRevisionIds?: string[] }
): Promise<CaptureModel['document']> {
  const {
    id,
    selector,
    allowMultiple,
    labelledBy,
    description,
    nestedProperties: rootNestedProperties,
    label,
    pluralLabel,
    revisionId,
    revisesId,
  } = doc;

  const returnDocument: CaptureModel['document'] = {
    id,
    type: 'entity',
    label,
    pluralLabel: pluralLabel ? pluralLabel : undefined,
    description: description ? description : undefined,
    allowMultiple: allowMultiple ? allowMultiple : undefined,
    labelledBy: labelledBy ? labelledBy : undefined,
    revision: revisionId ? revisionId : undefined,
    revises: revisesId ? revisesId : undefined,
    properties: {},
  };

  if (filters.revisionIds && filters.revisionIds.indexOf(returnDocument.revision) === -1) {
    returnDocument.immutable = true;
  }

  const nestedProperties = parentRootProperties ? parentRootProperties : rootNestedProperties;
  const flatProperties = (nestedProperties || []).filter(prop => prop.documentId === id);

  for (const prop of flatProperties || []) {
    if (prop.type !== 'entity-list') {
      // Field list.
      const fields = await prop.fieldInstances;

      // revises to be removed
      const revisesFields = fields
        .filter(field => {
          // Filter fields with revises and published.
          return (
            field.revisesId &&
            (filters.publishedRevisionIds ? filters.publishedRevisionIds.indexOf(field.revisionId) !== -1 : true)
          );
        })
        .map(field => {
          return field.revisesId;
        });

      const filteredFields = filters.revisionIds
        ? fields.filter(field => {
            // The field has been revised.
            if (revisesFields.indexOf(field.id) !== -1) {
              return false;
            }

            // If it has a revision, filter it against the revisions.
            if (field.revisionId && filters.revisionIds.indexOf(field.revisionId) === -1) {
              return false;
            }

            return true;
          })
        : fields;

      if (filteredFields.length) {
        returnDocument.properties[prop.term] = filteredFields.map(toField);
      } else {
        delete returnDocument.properties[prop.term];
      }
    } else {
      // Entity list.
      const entities = await prop.documentInstances;

      const revisesEntities = entities.map(field => field.revisesId).filter(e => e);

      returnDocument.properties[prop.term] = await Promise.all(
        entities
          .filter(entity => {
            return revisesEntities.indexOf(entity.id) === -1;
          })
          .map(entity => toDocument(entity, nestedProperties, filters))
      );

      returnDocument.properties[prop.term] = (returnDocument.properties[prop.term] as any[]).filter((d: any) => {
        return Object.keys(d.properties).length;
      });

      if (returnDocument.properties[prop.term].length === 0) {
        delete returnDocument.properties[prop.term];
      }
    }
  }

  if (selector) {
    returnDocument.selector = toSelector(selector);
  }

  return returnDocument;
}
