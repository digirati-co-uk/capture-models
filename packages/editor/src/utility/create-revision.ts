import { traverseDocument } from '@capture-models/editor';
import { isEntityList } from './is-entity';
import { REVISION_CLONE_MODE } from '../stores/revisions';
import { BaseField, CaptureModel } from '@capture-models/types';
import copy from 'fast-copy';

export function forkAllValues(document: CaptureModel['document'], modelRoot: string[]) {}

type FlatDocs = { parent?: CaptureModel['document']; documents: CaptureModel['document'][] };

export function splitDocumentByModelRoot(inputDoc: CaptureModel['document'], modelRoot: string[] = []) {
  // This is what we will be cycling through to clone/copy etc. Everything else is immutable.
  // Since we have a copy of the document above, we are just going to mutate that.
  const immutableDocuments: FlatDocs[] = [];
  let modelRootDocuments: FlatDocs[] = [{ documents: [inputDoc] }];
  let documentCursors: FlatDocs[] = [];
  for (const modelRootLevel of modelRoot) {
    documentCursors = modelRootDocuments;
    modelRootDocuments = [];
    for (const cursor of documentCursors) {
      for (const instanceDocuments of cursor.documents) {
        const entityList = instanceDocuments.properties[modelRootLevel];
        if (!isEntityList(entityList)) {
          throw new Error('Invalid modelRoot provided');
        }
        modelRootDocuments.push({ parent: instanceDocuments, documents: entityList });
      }
    }
    immutableDocuments.push(...documentCursors);
  }

  return {
    immutableDocuments,
    modelRootDocuments,
  };
}

/**
 * FORK_TEMPLATE - The first "allowMultiple" below the root will be copied and
 * it's values nuked, as per template rules in fork template mode, fields above
 * will be copied (and revises set) Everything (immutable) above the model root
 * is marked as "allowMultiple=false"
 *
 * @param inputDoc
 * @param modelRoot
 */
export function forkTemplate(inputDoc: CaptureModel['document'], modelRoot: string[] = []) {
  // New document.
  const document = copy(inputDoc);
  const newRevision = '... create UUID ...';

  const { modelRootDocuments, immutableDocuments } = splitDocumentByModelRoot(document, modelRoot);

  // Iterate through `immutableDocuments` to find properties that are
  // marked as allowMultiple=true and set them to false. (also the doc itself)
  // also do NOT add revision ID to this.
  immutableDocuments.forEach(docList => {
    docList.documents.forEach(doc => {
      if (doc.allowMultiple) {
        doc.allowMultiple = false;
      }
      Object.values(doc.properties).forEach(prop => {
        prop.forEach((field: BaseField | CaptureModel['document']) => {
          if (field.allowMultiple) {
            field.allowMultiple = false;
          }
        });
      });
    });
  });

  // This is an invalid state.
  if (modelRootDocuments.length === 0 || modelRootDocuments[0].documents.length === 0) {
    throw new Error('Document not found at root');
  }

  // Talking in terms of this manifest/canvas analogy.
  // Assuming [ manifests, canvases ] is the path.
  //
  //   modelRootDocuments[0].documents - list of canvases
  //
  // The goal is to get a new empty canvas under the same parent.
  // The problem is, under which manifest.
  // We need more than just an instance ID, we need a mapping.
  //
  // {
  //     manifests: 'id of manifest',
  //     canvases: 'id of canvas'
  // }
  //
  // If these are not provided, then we do ALL
  // But everything immutable, stays immutable.
  // So we would still have the list of manifests and a new canvas under each.
  // Or we would have a list of manifests

  // Focus on FORK_TEMPLATE for now.
  // modelRoot - path to entity that will be duplicated.
  // fields - fields that will be edited
  // instanceId - ID of the item to be forked for values / edited

  // { manifests: { canvases: [ { label: [{ text }] } ] } }
  // path = [ manifests, canvases ]
  // fields = [ manifest.canvases.label ]
  // FORK_TEMPLATE = add new canvas
  // FORK_VALUES = add new canvas from values !! NEED OPTIONAL INSTANCE ID IF ALLOW MULTIPLE.
  // EDIT_ALL_VALUES = edit all fields below !! NEED OPTIONAL INSTANCE ID IF ALLOW MULTIPLE.
  //
  // path = [ manifests ]
  // fields = [ manifest.canvases.label ]
  // FORK_TEMPLATE = add new manifest, empty nuked values (should see single canvas)
  // FORK_VALUES = add new manifest, copying all canvases (should see all canvases + labels)  !! NEED OPTIONAL INSTANCE ID IF ALLOW MULTIPLE.
  // EDIT_ALL_VALUES = edit manifest and canvas with revises (should see all canvases + labels)  !! NEED OPTIONAL INSTANCE ID IF ALLOW MULTIPLE.
  //
  // This "FORK_TEMPLATE" is really creating a new instance, or amending
  // the existing instance (recursively) based on the model root.
  // 1) Delete all other modelRootDocuments.
  if (modelRootDocuments[0].documents[0].allowMultiple) {
    // - clone the first (remove all but the 0, 0, recursively)
    // - nuke the instances
    // - no revises
  } else {
    // - clone the first (remove all but the 0, 0, recursively)
    // - nuke the instances
    // - add revises
  }

  // Module root can either be allowMultiple:
  //  - clone the first field and nuke instances, no revises
  // Or not:
  //  - clone the first field and nuke, adding revises (recursive)
  //
  // With forkAllValues, when the root is allowMultiple
  // - clone the whole thing, but do NOT nuke instances, no revises
  // Or not:
  // - clone the first field, do not nuke, add revises (recursive)
}

export function createRevision(
  document: CaptureModel['document'],
  mode: REVISION_CLONE_MODE,
  modelRoot: string[] = []
) {
  switch (mode) {
    case 'EDIT_ALL_VALUES':
      return document; // @todo clone? filter to modelRoot?
    case 'FORK_ALL_VALUES':
      return forkAllValues(document, modelRoot);
    case 'FORK_TEMPLATE':
      return forkTemplate(document, modelRoot);
  }
}
