import { hydratePartialDocument, isEntityList } from '@capture-models/editor';
import { CaptureModel as CaptureModelType } from '@capture-models/types';
import { documentToInserts } from './document-to-inserts';

export function partialDocumentsToInserts(docsToHydrate, entityMap: { [id: string]: CaptureModelType['document'] }) {
  const dbInserts = [];
  for (const doc of docsToHydrate) {
    const parent = entityMap[doc.parent.id];
    if (!parent) {
      throw new Error(`Immutable item ${doc.parent.id} was not found in capture model`);
    }
    const term = parent.properties[doc.term];
    if (!term) {
      throw new Error(`Term ${doc.term} was not found on capture model document ${doc.parent.id}`);
    }
    if (!isEntityList(term)) {
      throw new Error(`Term ${doc.term} is not a list of documents`);
    }
    // @todo for editing, we'll need to add a check to see if the entity is already in this map and merge those.
    //   in this case, hydrate _will_ keep the values. This will allow 2 revisions to target the same document
    //   but not the same fields. If the same field is edited, then FOR NOW this will replace the revision ID in
    //   that field with this one, making it impossible to edit. Need support for multiple revisions on fields to
    //   support this case.
    const docToClone = term.find(t => !t.revises);

    if (!docToClone) {
      throw new Error(`Term ${doc.term} contains no canonical values`);
    }

    // This will add any missing fields from the revision.
    const fullDocument = hydratePartialDocument(doc.entity, docToClone);

    dbInserts.push(...documentToInserts(fullDocument, { id: doc.parent.id, term: doc.term }, captureModel.document.id));
  }
  return dbInserts;
}
