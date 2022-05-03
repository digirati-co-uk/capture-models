import { traverseDocument } from '@capture-models/helpers';
import { CaptureModel as CaptureModelType } from '@capture-models/types';
import { Document } from '../entity/Document';
import { Field } from '../entity/Field';
import { Property } from '../entity/Property';
import { fromDocument } from '../mapping/from-document';
import { fromField } from '../mapping/from-field';
import { SelectorInstance } from '../entity/SelectorInstance';
import { fromSelector } from '../mapping/from-selector';

export function documentToInserts(
  document: CaptureModelType['document'],
  parentDocument?: { id: string; term: string },
  rootDocumentId?: string,
  index?: number
) {
  let count = 0;
  const dbInserts: (Field | Document | Property | SelectorInstance)[][] = [];
  traverseDocument<{ parentAdded?: boolean }>(document, {
    beforeVisitEntity(entity, term, parent) {
      const entityDoc = fromDocument(entity, false);
      count++;
      entityDoc.revisionOrder = typeof index === 'undefined' ? count : index;
      if (parent) {
        if (!parent.id) {
          throw new Error(`No id on parent entity ${JSON.stringify(parent)}`);
        }
        entityDoc.parentId = `${parent.id}/${term}`;
      } else if (parentDocument) {
        entityDoc.parentId = `${parentDocument.id}/${parentDocument.term}`;
      }
      if (entity.selector && entity.selector.revisedBy) {
        const selectorInserts = [];
        for (const innerSelector of entity.selector.revisedBy) {
          selectorInserts.push(fromSelector(innerSelector));
        }
        dbInserts.push(selectorInserts);
      }

      dbInserts.push([entityDoc]);
      dbInserts.push(
        entityDoc.properties.map(prop => {
          if (rootDocumentId) {
            prop.rootDocumentId = rootDocumentId;
          } else if (parentDocument) {
            prop.rootDocumentId = parentDocument.id;
          } else {
            prop.rootDocumentId = document.id;
          }
          return prop;
        })
      );
      const fieldInserts = [];
      entityDoc.properties.forEach(prop => {
        entity.properties[prop.term].forEach((field, order) => {
          if (field.type !== 'entity') {
            const fieldToSave = fromField(field);
            fieldToSave.revisionOrder = order;
            fieldToSave.parentId = `${entityDoc.id}/${prop.term}`;
            fieldInserts.push(fieldToSave);
          }
        });
      });
      dbInserts.push(fieldInserts);
    },
  });
  return dbInserts;
}
