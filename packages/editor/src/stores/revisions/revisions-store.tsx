import { CaptureModel, BaseField, BaseSelector } from '@capture-models/types';
import { action, computed, createStore, thunk } from 'easy-peasy';
import { original } from 'immer';
import { pluginStore } from '@capture-models/plugin-api';
import { RevisionsModel } from './revisions-model';
import { createSelectorStore } from '../selectors/selector-store';
import {
  copyOriginal,
  createRevisionDocument,
  generateId,
  createRevisionRequest,
  captureModelToRevisionList,
  getRevisionFieldFromPath,
} from '@capture-models/helpers';

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
  currentRevisionReadMode: false,

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
      state.currentRevisionReadMode = !!payload.initialRevisionReadMode;
      state.selector = createSelectorStore(revisions[payload.initialRevision].document);
    } else {
      state.currentRevisionId = null;
      state.currentRevisionReadMode = false;
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

      const path = state.selector.selectorPaths[selectorToUpdate.id];
      const field = getRevisionFieldFromPath<BaseField>(state, path);
      if (field && field.selector) {
        field.selector.state = payload.state;
      }
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
  createRevision: action<RevisionsModel>((state, { revisionId, readMode, cloneMode, modelMapping }) => {
    const baseRevision = state.revisions[revisionId];
    // Structure ID is the structure from the capture model, so if this exists we can set fields.
    if (!baseRevision) {
      // @todo error handling.
      return;
    }
    // Document
    const documentToClone = baseRevision.document;
    // New id
    const newRevisionId = generateId();
    // Create document
    const newDocument = createRevisionDocument(
      newRevisionId,
      original(documentToClone) as CaptureModel['document'],
      cloneMode,
      baseRevision.modelRoot,
      modelMapping
    );

    // Add new revision request
    const newRevisionRequest = createRevisionRequest(
      baseRevision.captureModelId as string,
      baseRevision.revision,
      newDocument
    );
    // Update Id of revision.
    newRevisionRequest.revision = {
      ...baseRevision.revision,
      approved: false, // @todo this is where auto-approval config might go, will still be server checked.
      id: newRevisionId,
    };
    // Save new revision request.
    state.revisions[newRevisionId] = newRevisionRequest;
    // Save it to state.
    state.currentRevisionId = newRevisionId;
    state.currentRevisionReadMode = !!readMode;
    state.selector = createSelectorStore(newDocument);
    state.unsavedRevisionIds.push(newRevisionId);
  }),

  persistRevision: thunk(async (actions, { revisionId: customRevisionId, createRevision, updateRevision }, helpers) => {
    // First persist to get new
    const state = helpers.getState();
    const revisionId = customRevisionId ? customRevisionId : state.currentRevisionId;
    if (!revisionId) {
      // @todo error handling?
      return;
    }
    const oldRevision = state.revisions[revisionId];
    if (state.unsavedRevisionIds.indexOf(revisionId) !== -1) {
      const newRevision = await createRevision(oldRevision);
      actions.importRevision({ revisionRequest: newRevision });
      actions.saveRevision({ revisionId });
    } else {
      const newRevision = await updateRevision(oldRevision);
      actions.importRevision({ revisionRequest: newRevision });
    }
  }),

  importRevision: action((state, { revisionRequest }) => {
    state.revisions[revisionRequest.revision.id] = revisionRequest;
  }),

  setRevisionLabel: action((state, { revisionId: customRevisionId, label }) => {
    const revisionId = customRevisionId ? customRevisionId : state.currentRevisionId;

    if (!revisionId || !state.revisions[revisionId]) {
      // Error?
      return;
    }

    state.revisions[revisionId].revision.label = label;
  }),

  // @todo Not sure what this will do yet, might be a thunk.
  saveRevision: action((state, { revisionId }) => {
    state.unsavedRevisionIds = state.unsavedRevisionIds.filter(unsavedId => unsavedId !== revisionId);
  }),

  // Just sets the id.
  selectRevision: action((state, { revisionId, readMode }) => {
    // @todo this might be where we go through and initialise the selector section of the store. This needs to be
    //    reliable.
    if (state.revisions[revisionId]) {
      // Add the current revision
      state.currentRevisionId = revisionId;
      state.currentRevisionReadMode = !!readMode;
      // Set up our selector store.
      state.selector = createSelectorStore(original(state.revisions[revisionId].document) as CaptureModel['document']);
    }
  }),
  deselectRevision: action(state => {
    state.currentRevisionId = null;
    state.currentRevisionReadMode = false;
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
