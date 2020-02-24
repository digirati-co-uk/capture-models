import { CaptureModel, BaseField, BaseSelector } from '@capture-models/types';
import { action, computed, createStore, thunk } from 'easy-peasy';
import { original } from 'immer';
import { pluginStore } from '@capture-models/plugin-api';
import { createRevisionDocument } from '../../utility/create-revision-document';
import { generateId } from '../../utility/generate-id';
import { RevisionsModel } from './revisions-model';
import { captureModelToRevisionList } from './utility/capture-model-to-revision-list';
import { createSelectorStore } from '../selectors/selector-store';
import { getRevisionFieldFromPath } from './utility/get-revision-field-from-path';
import { copyOriginal } from '../../utility/copy-original';

export const revisionStore: RevisionsModel = {
  // Can we safely assume the structure won't change in this store? - I think so.
  // Do we need a "root" revision for items without a revision ID?
  // Actually – root revisions can have the SAME id as the structure choice, since they are just the revision
  // for that actual structure. If it's not in the structure AND not in a revision then it can't be edited in
  // the capture model editor, unless you edit the whole document at once.
  revisions: {},

  // The revision.
  currentRevisionId: null,
  currentRevision: computed(state =>
    state.currentRevisionId && state.revisions[state.currentRevisionId]
      ? state.revisions[state.currentRevisionId]
      : null
  ),
  unsavedRevisionIds: [],

  // Empty state for selectors. This will be populated when you select a revision and be reset when you deselect one.
  // It contains the basic state for what's currently selected.
  selector: createSelectorStore(),

  setCaptureModel: action((state, payload) => {
    const revisions = captureModelToRevisionList(payload.captureModel, !payload.excludeStructures).reduce(
      (mapOfRevisions, nextRevision) => {
        mapOfRevisions[nextRevision.revision.id] = nextRevision;
        return mapOfRevisions;
      },
      {} as any
    );

    if (payload.initialRevision && revisions[payload.initialRevision]) {
      state.currentRevisionId = payload.initialRevision;
      state.selector = createSelectorStore(revisions[payload.initialRevision].document);
    } else {
      state.currentRevisionId = null;
      state.selector = createSelectorStore();
    }

    state.revisions = revisions;
    state.unsavedRevisionIds = [];
  }),

  chooseSelector: action((state, payload) => {
    if (state.selector.availableSelectors.find(selector => selector.id === payload.selectorId)) {
      state.selector.currentSelectorId = payload.selectorId;
    }
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

  // @todo update selector in revision too (not ideal, but avoids traversing tree each time to find a selector)
  updateSelector: action((state, payload) => {
    const selectorToUpdate = state.selector.availableSelectors.find(selector => selector.id === payload.selectorId);
    if (selectorToUpdate) {
      selectorToUpdate.state = payload.state;
      // if (onUpdateSelector) {
      //   onUpdateSelector(payload.selectorId, payload.state);
      // }
    }
  }),
  // @todo update selector on revision
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
  createRevision: action<RevisionsModel>((state, { revisionId, cloneMode, modelMapping }) => {
    // Structure ID is the structure from the capture model, so if this exists we can set fields.
    if (!state.revisions[revisionId]) {
      // @todo error handling.
      return;
    }
    const documentToClone = state.revisions[revisionId].document;

    // Structure ID if we need it.
    // state.revisions[revisionId].revision.structureId
    const newRevisionId = generateId(); // Do I need this here?
    const newDocument = createRevisionDocument(
      newRevisionId,
      original(documentToClone),
      cloneMode,
      state.revisions[revisionId].modelRoot,
      modelMapping
    );

    // @todo split out into createRevision
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
      state.selector = createSelectorStore(original(state.revisions[revisionId].document) as CaptureModel['document']);
    }
  }),
  deselectRevision: action(state => {
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
    newField.id = generateId();
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

export const createRevisionStore = (initialData?: {
  captureModel: CaptureModel;
  initialRevision?: string;
  excludeStructures?: boolean;
}) => {
  const store = createStore(revisionStore);

  if (initialData && initialData.captureModel) {
    store.getActions().setCaptureModel(initialData);
  }

  return store;
};
