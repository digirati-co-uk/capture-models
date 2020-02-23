import { pluginStore } from '@capture-models/plugin-api';
import { BaseField, CaptureModel } from '@capture-models/types';
import copy from 'fast-copy';
import { REVISION_CLONE_MODE } from '../stores/revisions';
import { filterDocumentGraph } from './filter-document-graph';
import { generateId } from './generate-id';
import { isEntity } from './is-entity';
import { splitDocumentByModelRoot } from './split-document-by-model-root';
import { traverseDocument } from './traverse-document';

/**
 * Fork template - The first "allowMultiple" below the root will be copied and
 * it's values nuked, as per template rules in fork template mode, fields above
 * will be copied (and revises set) Everything (immutable) above the model root
 * is marked as "allowMultiple=false"
 *
 * @param inputDoc
 * @param modelRoot
 * @param modelMapping
 * @param removeValues
 * @param removeDefaultValues
 * @param editValues
 * @param editableAboveRoot
 * @param preventAdditionsAdjacentToRoot
 */
export function forkDocument<Fields extends string>(
  inputDoc: CaptureModel['document'],
  {
    modelRoot = [],
    modelMapping: inputModelMapping = {},
    removeValues = true,
    removeDefaultValues = false,
    editValues = false,
    editableAboveRoot = true,
    preventAdditionsAdjacentToRoot = true,
  }: {
    modelMapping?: Partial<{ [key in Fields]: string }>;
    modelRoot?: Fields[];
    removeValues?: boolean;
    removeDefaultValues?: boolean;
    editValues?: boolean;
    editableAboveRoot?: boolean;
    preventAdditionsAdjacentToRoot?: boolean;
  }
) {
  // New document.
  const document = copy(inputDoc);
  const modelMapping: Partial<typeof inputModelMapping> = {};

  // Filter out any items from the mapping that are not on the root.
  // Model mapping is used to filter the path to what you want to edit.
  for (const root of modelRoot) {
    if (inputModelMapping[root as Fields]) {
      modelMapping[root] = inputModelMapping[root];
    }
  }

  const [immutableDocuments, mutableDocuments] = splitDocumentByModelRoot(document, modelRoot);
  const documentsToPreventFurtherAdditions: CaptureModel['document'][] = [];
  // Iterate through `immutableDocuments` to find properties that are
  // marked as allowMultiple=true and set them to false. (also the doc itself)
  // also do NOT add revision ID to this.
  // @todo do this at the end when we do the full traverse + filter.
  immutableDocuments.forEach(docList => {
    docList.documents.forEach(doc => {
      doc.immutable = true;
      if (doc.allowMultiple) {
        doc.allowMultiple = false;
      }

      Object.keys(doc.properties).forEach(term => {
        const prop = doc.properties[term];
        prop.forEach((field: BaseField | CaptureModel['document']) => {
          // These are all of the fields above the root.
          if (!isEntity(field) && !editableAboveRoot) {
            field.immutable = true;
            field.allowMultiple = false;
          }
          if (isEntity(field)) {
            documentsToPreventFurtherAdditions.push(field);
          }
        });
      });
    });
  });

  // This is an invalid state.
  if (mutableDocuments.length === 0 || mutableDocuments[0].documents.length === 0) {
    throw new Error('Document not found at root');
  }

  const [documentsToKeep, documentsToRemove] = filterDocumentGraph(immutableDocuments, modelMapping);

  // This is the glue between the top and bottom. If something has been removed in the top, we want it removed
  // from the bottom.
  for (const mutableDocument of mutableDocuments) {
    if (mutableDocument.parent && documentsToRemove.indexOf(mutableDocument.parent) !== -1) {
      documentsToRemove.push(...mutableDocument.documents);
    } else {
      const filteredId = modelMapping[mutableDocument.property as Fields];
      if (filteredId) {
        for (const doc of mutableDocument.documents) {
          if (doc.id === filteredId) {
            documentsToKeep.push(doc);
          } else {
            documentsToRemove.push(doc);
          }
        }
      } else {
        documentsToKeep.push(...mutableDocument.documents);
      }
    }
  }

  const actions = {
    parentRemoved(item: any) {
      return actions.setValue(item, 'isParentRemoved', true);
    },
    isParentRemoved(item: any) {
      return actions.getValue(item, 'isParentRemoved');
    },

    filterParent(item: any) {
      return actions.setValue(item, 'isParentFiltered', true);
    },

    isParentFiltered(item: any) {
      return actions.getValue(item, 'isParentFiltered');
    },

    parentHasBranched(item: any) {
      if (!item) {
        return false;
      }
      return item.temp && item.temp.hasBranched;
    },

    branch(item: any) {
      return actions.setValue(item, 'hasBranched', true);
    },

    setValue(item: any, key: string, value: any) {
      item.temp = item.temp ? item.temp : {};
      item.temp[key] = value;
    },
    getValue(item: any, key: string) {
      return !!(item && item.temp && item.temp[key]);
    },
  };

  traverseDocument<{ hasBranched?: boolean; parentRemoved?: boolean; parentKept?: boolean }>(document, {
    visitField(field, key, parent) {
      // This is partially a validation step to ensure the plugin exists.
      const description = pluginStore.fields[field.type];
      if (!description) {
        // error? delete?
        parent.properties[key] = [];
        return;
      }

      // Remove the value from the field if we need to.
      if (!editValues && removeValues && (removeDefaultValues || field.revision)) {
        field.value = copy(description.defaultValue);
      }
      // If we're not editing, then we're copying. There's only so much we're allow to copy.
      // If the field is part of an entity that has already been copied, then it's a new field
      // and should be marked as one, without a revises.
      // If the field allows multiple (and not part of a new branch) then we can add a new instance
      // to the value.
      if (!editValues && !field.immutable) {
        // In this case, we've branched out.
        if (actions.parentHasBranched(parent)) {
          // Set id, don't set revises.
          field.id = generateId();
          // Make only one item.
          parent.properties[key] = [field];
        } else if (description.allowMultiple && field.allowMultiple) {
          // If the parent has _NOT_ branched yet, set ID, no revises.
          field.id = generateId();
        } else {
          //console.log(`Field marked with revises ${key} ${actions.parentHasBranched(parent) && '(branched)'}`);
          // The field is marked as not allowing multiple values, so we are forking.
          field.revises = field.id;
          field.id = generateId();
        }
      }
    },
    visitEntity(entity, key, parent) {
      // If the parent has multiple values, and we're not editing and removing values (fork)
      if (parent && key && !actions.isParentFiltered(parent) && !editValues && removeValues) {
        // Then we want to make this the only entity, I think. This will already be pre-filtered if
        // an ID is selected.
        parent.properties[key] = [entity];
        actions.filterParent(parent);
      }
    },
    beforeVisitEntity(entity, key, parent) {
      const filteredId = modelMapping[key as Fields];
      if (filteredId && entity.id === filteredId) {
        if (parent && key) {
          parent.properties[key] = [entity];
          actions.filterParent(parent);
        }
      }

      if (documentsToRemove.indexOf(entity) !== -1 || actions.isParentRemoved(parent)) {
        if (parent && key) {
          actions.parentRemoved(entity);
          parent.properties[key] = (parent.properties[key] as CaptureModel['document'][]).filter(
            prop => prop !== entity
          );
        }
        return;
      }

      const hasParentDocumentBranched = actions.parentHasBranched(parent);
      const isDocumentImmutable = !!entity.immutable; // i.e. the forking has to start later in the tree.
      const willBranch = !!parent && (hasParentDocumentBranched || (!isDocumentImmutable && !editValues));

      // - if parent has branched, we NEED to branch. This can only happen if other cases pass, so we can
      // safely do this.
      // - if the document is immutable, we cannot branch, other items adjacent to this document _may_ have
      // been removed.
      // - if we are forking, then we can check if the item allows multiple values and create a new one, or
      // if it does not and create a revises, similar to fields.
      // - If we do fork, we mark the item as branched for the fields to pick up
      if (willBranch) {
        // console.log('BRANCHING', entity);

        if (entity.allowMultiple || hasParentDocumentBranched) {
          entity.id = generateId();
        } else {
          entity.revises = entity.id;
          entity.id = generateId();
        }
        actions.branch(entity);
      }
    },
  });

  if (preventAdditionsAdjacentToRoot) {
    // Prevent the documents at the root from being added to.
    for (const doc of documentsToPreventFurtherAdditions) {
      doc.immutable = true;
      doc.allowMultiple = false;
    }
  }

  return document;
}

/**
 * Wrapper around fork document.
 * @param document
 * @param mode
 * @param modelRoot
 * @param modelMapping
 */
export function createRevisionDocument(
  document: CaptureModel['document'],
  mode: REVISION_CLONE_MODE,
  modelRoot: string[] = [],
  modelMapping: Partial<{ [key: string]: string }> = {}
) {
  switch (mode) {
    case 'EDIT_ALL_VALUES':
      return forkDocument(document, { modelRoot, modelMapping, editValues: true });
    case 'FORK_ALL_VALUES':
      return forkDocument(document, { modelRoot, modelMapping, removeValues: false });
    case 'FORK_TEMPLATE':
      return forkDocument(document, { modelRoot, removeDefaultValues: true, removeValues: true });
  }
}
