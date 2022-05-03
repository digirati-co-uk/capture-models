import { CaptureModel } from '@capture-models/types';
import { formPropertyValue } from '@capture-models/helpers';
import { Document } from '../entity/Document';
import { Property } from '../entity/Property';
import { toField } from './to-field';
import { toSelector } from './to-selector';

export async function toDocument(
  doc: Document,
  parentRootProperties?: Property[],
  filters?: {
    revisionIds?: string[];
    publishedRevisionIds?: string[];
    idsRemovedByPublishedRevisions?: string[];
    onlyRevisionFields?: boolean;
  }
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
    profile,
    dataSources,
  } = doc;

  const returnDocument: CaptureModel['document'] = {
    id,
    type: 'entity',
    label,
    profile: profile ? profile : undefined,
    pluralLabel: pluralLabel ? pluralLabel : undefined,
    description: description ? description : undefined,
    allowMultiple: allowMultiple ? allowMultiple : undefined,
    labelledBy: labelledBy ? labelledBy : undefined,
    revision: revisionId ? revisionId : undefined,
    revises: revisesId ? revisesId : undefined,
    dataSources: dataSources ? dataSources : undefined,
    properties: {},
  };
  // toDocument {
  //   revisionIds: [ '7b0052c9-ff2c-4463-b198-c6bcc6d18606' ],
  //   publishedRevisionIds: [ '7b0052c9-ff2c-4463-b198-c6bcc6d18606' ],
  //   idsRemovedByPublishedRevisions: [],
  //   onlyRevisionFields: undefined
  // }

  if (filters.revisionIds && filters.revisionIds.indexOf(returnDocument.revision) === -1) {
    returnDocument.immutable = true;
  }

  const nestedProperties = parentRootProperties ? parentRootProperties : rootNestedProperties;
  const flatProperties = (nestedProperties || []).filter(prop => prop.documentId === id);

  for (const prop of flatProperties || []) {
    if (prop.type !== 'entity-list') {
      // Field list.
      const fields = (await prop.fieldInstances).filter(field => {
        // Normal filers.
        if (filters.idsRemovedByPublishedRevisions) {
          return filters.idsRemovedByPublishedRevisions.indexOf(field.id) === -1;
        }

        // Default all.
        return true;
      });

      // revises to be removed
      // @todo maybe this will be an option?
      // const revisesFields = fields
      //   .filter(field => {
      //     // Filter fields with revises and published.
      //     return (
      //       field.revisesId &&
      //       (filters.publishedRevisionIds ? filters.publishedRevisionIds.indexOf(field.revisionId) !== -1 : true)
      //     );
      //   })
      //   .map(field => {
      //     return field.revisesId;
      //   });

      const filteredFields = filters.revisionIds
        ? fields.filter(field => {
            // The field has been revised.
            // if (revisesFields.indexOf(field.id) !== -1) {
            //   return false;
            // }

            // If it has a revision, filter it against the revisions.
            if (field.revisionId && filters.revisionIds.indexOf(field.revisionId) === -1) {
              return false;
            }

            if (filters.onlyRevisionFields && !field.revisionId) {
              return false;
            }

            return true;
          })
        : fields;

      // If we filtered everything, then we create a new blank value.
      if (filteredFields.length === 0 && fields.length !== 0 && !filters.onlyRevisionFields) {
        // Add an empty field.
        returnDocument.properties[prop.term] = [formPropertyValue(await toField(fields[0]), {})];

        // If there are filtered items, then we map them.
      } else if (filteredFields.length) {
        returnDocument.properties[prop.term] = await Promise.all(filteredFields.map(toField));
        // Otherwise
      } else {
        delete returnDocument.properties[prop.term];
      }
    } else {
      // Entity list.
      const entities = (await prop.documentInstances).filter(entity => {
        // Normal entity filters.
        if (filters.idsRemovedByPublishedRevisions) {
          return filters.idsRemovedByPublishedRevisions.indexOf(entity.id) === -1;
        }
      });

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
    returnDocument.selector = await toSelector(selector);
  }

  return returnDocument;
}
