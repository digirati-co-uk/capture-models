import { CaptureModel, BaseField, BaseSelector } from '@capture-models/types';
import { action, computed, createContextStore, thunk } from 'easy-peasy';
import { original } from 'immer';
import { pluginStore } from '../../core/plugins';
import { traverseDocument } from '../../utility/traverse-document';
import { RevisionsModel } from './revisions-model';
import { captureModelToRevisionList } from './utility/capture-model-to-revision-list';
import createId from 'nanoid';
import { createSelectorStore } from '../selectors/selector-store';
import { getRevisionFieldFromPath } from './utility/get-revision-field-from-path';
import { copyOriginal } from '../../utility/copy-original';

type RevisionData = {
  captureModel: CaptureModel;
  initialRevision?: string;
};

export const RevisionStore = createContextStore<RevisionsModel>(({ captureModel, initialRevision }: RevisionData) => {
  // Calculated revisions for the store from the capture models, including structures.
  const revisions = captureModelToRevisionList(captureModel, true).reduce((mapOfRevisions, nextRevision) => {
    mapOfRevisions[nextRevision.revision.id] = nextRevision;
    return mapOfRevisions;
  }, {} as any);

  return {
    // Can we safely assume the structure won't change in this store? - I think so.
    // Do we need a "root" revision for items without a revision ID?
    // Actually – root revisions can have the SAME id as the structure choice, since they are just the revision
    // for that actual structure. If it's not in the structure AND not in a revision then it can't be edited in
    // the capture model editor, unless you edit the whole document at once.
    revisions,

    // The revision.
    currentRevisionId: initialRevision ? initialRevision : null,
    currentRevision: computed(state =>
      state.currentRevisionId && state.revisions[state.currentRevisionId]
        ? state.revisions[state.currentRevisionId]
        : null
    ),
    unsavedRevisionIds: [],

    // Empty state for selectors. This will be populated when you select a revision and be reset when you deselect one.
    // It contains the basic state for what's currently selected.
    selector: initialRevision ? createSelectorStore(revisions[initialRevision].document) : createSelectorStore(),
    chooseSelector: action((state, payload) => {
      state.selector.currentSelectorId = payload.selectorId;
    }),
    clearSelector: action(state => {
      state.selector.currentSelectorId = null;
    }),
    clearTopLevelSelector: action((state, payload) => {
      state.selector.topLevelSelector = null;
    }),
    setTopLevelSelector: action((state, payload) => {
      state.selector.topLevelSelector = payload.selectorId;
    }),
    updateSelector: action((state, payload) => {
      const selectorToUpdate = state.selector.availableSelectors.find(selector => selector.id === payload.selectorId);
      if (selectorToUpdate) {
        selectorToUpdate.state = payload.state;
        // if (onUpdateSelector) {
        //   onUpdateSelector(payload.selectorId, payload.state);
        // }
      }
    }),
    updateSelectorPreview: action((state, payload) => {
      state.selector.selectorPreviewData[payload.selectorId] = payload.preview;
    }),
    addVisibleSelectorIds: action((state, payload) => {
      for (const id of payload.selectorIds) {
        if (state.selector.visibleSelectorIds.indexOf(id) === -1) {
          state.selector.visibleSelectorIds.push(id);
        }
      }
    }),
    removeVisibleSelectorIds: action((state, payload) => {
      state.selector.visibleSelectorIds = state.selector.visibleSelectorIds.filter(
        selector => payload.selectorIds.indexOf(selector) === -1
      );
    }),
    updateCurrentSelector: thunk<RevisionsModel, BaseSelector['state']>((actions, payload, helpers) => {
      const state = helpers.getState().selector;
      if (state.currentSelectorId) {
        actions.updateSelector({ selectorId: state.currentSelectorId, state: payload });
      }
    }),

    // This method assumes we have the latest capture model available, which may not
    // be the case. This needs to be more generic.
    createRevision: action((state, { revisionId, cloneMode }) => {
      // Structure ID is the structure from the capture model, so if this exists we can set fields.
      if (!state.revisions[revisionId]) {
        // @todo error handling.
        return;
      }
      const documentToClone = state.revisions[revisionId].document;

      // Structure ID if we need it.
      // state.revisions[revisionId].revision.structureId
      const newRevisionId = createId(); // Do I need this here?
      const newDocument = copyOriginal(documentToClone);
      // Then we nuke the values recursively if revises=null (unless specified)
      // - field id -> generate new (if allowMultiple=true on field)
      // - entity id -> generate new (if allowMultiple=true on entity)
      // - selector states -> set to default
      // - field values -> set to default
      // - enumerable @types -> keep first, remove rest @todo add case for not doing this (tuple-like)
      // @todo question cases where revises!=null and there are enumerable values. Will this break things?
      // @todo should revises be a field ID or a revision? Do we need both? Could be the same value: `{revision}/{entityId}`
      switch (cloneMode) {
        case 'EDIT_ALL_VALUES':
          // Straight clone, same IDs. Does this even need to be a clone? Or is this just selecting?
          // I think it does, as this will be used when a user wants to edit something they cannot directly.
          // Once copied, don't need to do anything.
          // newDocument
          break;
        case 'FORK_ALL_VALUES':
          // Visit every entity + field.
          // Change ID (mutation in place)
          // Clone + change IDs
          traverseDocument(newDocument, {
            visitSelector(selector) {
              // Not really we need selector IDs.
              selector.id = createId();
            },
            visitField(field) {
              if (field.allowMultiple) {
                field.id = createId();
              }
            },
            visitEntity(entity) {
              if (entity.allowMultiple) {
                entity.id = createId();
              }
            },
          });
          break;
        case 'FORK_TEMPLATE':
          // Clone + apply template logic to remove values. Might produce same
          // output as EDIT_ALL_VALUES in many common cases without enumerable @types.
          // This is different in the case where there are a list of items anywhere
          // in the revision, as the template rules will produce a new single value
          // instead of a new list. IDs will be dependant on allowMultiple=true
          // Visit every entity + field.
          // Change ID (mutation in place) depending on custom logic.
          newDocument.id = createId();
          traverseDocument(newDocument, {
            visitFirstField(field, key, parent) {
              const description = pluginStore.fields[field.type];
              if (!description) {
                // error? delete?
                parent.properties[key] = [];
                return true;
              }

              if (description.allowMultiple && field.allowMultiple) {
                // Supported in both the base and in the field.
                // If this is true then we need to clone
                // We want to create a new field here, based on the first (the one here).
                // If we have a revision, nuke the value and use the default
                // Otherwise, if we don't have a revision it was added during the set
                // up phase, so we do want the value copied over.
                field.id = createId();
                if (field.revision) {
                  field.value = copyOriginal(description.defaultValue);
                }
              }

              parent.properties[key] = [field];
              return true;
            },
            visitSelector(selector, parent) {
              const description = pluginStore.selectors[selector.type];
              if (!description) {
                // Error? Delete?
                parent.selector = undefined;
                return;
              }
              selector.id = createId();

              if (parent.type !== 'entity' && parent.revision) {
                selector.state = copyOriginal(description.defaultState);
              }
            },
            visitFirstEntity(entity, key, parent) {
              if (entity.allowMultiple) {
                entity.id = createId();
              }
              parent.properties[key] = [entity];
              return true;
            },
          });
          break;
        default:
          break;
      }

      state.revisions[newRevisionId] = {
        revision: {
          id: newRevisionId,
          label: state.revisions[revisionId].revision.label,
          fields: state.revisions[revisionId].revision.fields,
          structureId: state.revisions[revisionId].revision.structureId,
          revises: state.revisions[revisionId].revision.id, // This might be a structure id.
          approved: false, // for now.
        },
        document: newDocument,
      };

      state.currentRevisionId = newRevisionId;
      state.selector = createSelectorStore(newDocument);
      state.unsavedRevisionIds.push(newRevisionId);

      // => Verification
      // - Does this work with single values (allowMultiple=false) where users can edit the field directly?
      // - Does this work with single values (allowMultiple=false) where users can revise the field
      // - Does this work with adding a new item to a list (allowMultiple=true)
      // - Does this work with amending an item on a list (allowMultiple=true)
      // - Does this work with a mix of the above (single transcription, multiple comments)
      // - Does this work with a mix of the above, but editing revision
    }),

    // @todo Not sure what this will do yet, might be a thunk.
    saveRevision: action((state, { revisionId }) => {
      // Grab revisions from unsavedRevisionIds
      // Call passed in callback for saving revisions
      // set unsavedRevisionIds to []
      return null as any;
    }),

    // Just sets the id.
    selectRevision: action((state, { revisionId }) => {
      // @todo this might be where we go through and initialise the selector section of the store. This needs to be
      //    reliable.
      if (state.revisions[revisionId]) {
        // Add the current revision
        state.currentRevisionId = revisionId;
        // Set up our selector store.
        state.selector = createSelectorStore(
          original(state.revisions[revisionId].document) as CaptureModel['document']
        );
      }
    }),
    deselectRevision: action((state, { revisionId }) => {
      state.currentRevisionId = null;
      state.selector = createSelectorStore();
    }),

    // These will probably have to walk through the revision.
    updateFieldValue: action((state, { value, path, revisionId }) => {
      const field = getRevisionFieldFromPath<BaseField>(state, path, revisionId);
      if (field) {
        field.value = value;
      }
    }),
    updateFieldSelector: action((state, { state: selectorState, path, revisionId }) => {
      const field = getRevisionFieldFromPath<BaseField>(state, path, revisionId);
      if (field && field.selector) {
        field.selector.state = selectorState;
      }
    }),
    updateEntitySelector: action((state, { state: selectorState, path, revisionId }) => {
      const entity = getRevisionFieldFromPath<CaptureModel['document']>(state, path, revisionId);
      if (entity && entity.selector) {
        entity.selector.state = selectorState;
      }
    }),

    createNewFieldInstance: action((state, { property, path, revisionId }) => {
      // Grab the parent entity where we want to add a new field.
      const entity = getRevisionFieldFromPath<CaptureModel['document']>(state, path, revisionId);
      if (!entity) {
        throw new Error('invalid entity');
      }
      // Grab the property itself from the entity.
      const prop = entity.properties[property];
      if (!prop || prop.length <= 0) {
        throw new Error('invalid property');
      }

      // Grab the template value (first) and ensure it allows multiple instances
      const template = prop[0];
      if (template.allowMultiple) {
        throw new Error('field does not support multiple values.');
      }

      // Clone the template field.
      const newField = copyOriginal<BaseField>(template);
      const description = pluginStore.fields[newField.type];
      if (!description) {
        throw new Error(`field plugin not found of type ${newField.type}`);
      }

      // Modify the new field with defaults form the plugin store
      newField.id = createId();
      newField.value = copyOriginal(description.defaultValue);

      // @todo nuke selector.. maybe
      entity.properties[property].push(newField as any);
    }),
    createNewEntityInstance: action((state, { path, revisionId }) => {
      // @todo this will be much the same as adding a new field instance, but instead it will
      //   have to recurse through all of the properties and apply the same logic as the field logic.
      //   This is probably the point where that logic will have to be split out.
      //   Moving the nuking code to the plugin store will make sense I think.
      return null as any;
    }),
    removeInstance: action((state, { path, revisionId }) => {
      const [fieldProp, fieldId] = path.slice(-1)[0];
      const pathToResource = path.slice(0, -1);
      const entity = getRevisionFieldFromPath<CaptureModel['document']>(state, pathToResource, revisionId);

      if (entity && entity.properties[fieldProp]) {
        entity.properties[fieldProp] = (entity.properties[fieldProp] as any[]).filter(field => field.id !== fieldId);
      }
    }),
  };
});
