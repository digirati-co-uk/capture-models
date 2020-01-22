import { action, computed, createContextStore, State, StateMapper } from 'easy-peasy';
import { original } from 'immer';
import { pluginStore } from '../../core/plugins';
import { CaptureModel } from '../../types/capture-model';
import { FieldTypes } from '../../types/field-types';
import { traverseDocument } from '../../utility/traverse-document';
import { RevisionsModel } from './revisions-model';
import { captureModelToRevisionList } from './utility/capture-model-to-revision-list';
import createId from 'nanoid';
import copy from 'fast-copy';

const copyOriginal = <T extends any = any>(i: any) => copy(original(i)) as T;

function getRevisionFieldFromPath<T extends any = any>(
  state: State<RevisionsModel>,
  path: Array<[string, string]>
): T | null {
  if (!state.currentRevisionId || !state.revisions[state.currentRevisionId]) {
    // Error?
    return null;
  }
  let current = state.revisions[state.currentRevisionId].document;
  for (const [prop, id] of path) {
    if (current.type === 'entity') {
      const property = current.properties[prop];
      current = (property as []).find((field: any) => field.id === id) as any;
    }
  }

  return (current as any) as T;
}

export const RevisionStore = createContextStore<RevisionsModel>(({ captureModel }: { captureModel: CaptureModel }) => ({
  // Can we safely assume the structure won't change in this store? - I think so.
  // Do we need a "root" revision for items without a revision ID?
  // Actually – root revisions can have the SAME id as the structure choice, since they are just the revision
  // for that actual structure. If it's not in the structure AND not in a revision then it can't be edited in
  // the capture model editor, unless you edit the whole document at once.
  revisions: captureModelToRevisionList(captureModel, true).reduce((mapOfRevisions, nextRevision) => {
    mapOfRevisions[nextRevision.revision.id] = nextRevision;
    return mapOfRevisions;
  }, {} as any),

  // The revision.
  currentRevisionId: null,
  currentRevision: computed(state =>
    state.currentRevisionId && state.revisions[state.currentRevisionId]
      ? state.revisions[state.currentRevisionId]
      : null
  ),
  unsavedRevisionIds: [],

  // Where does this get a selector from?
  // Does it HAVE to be on the current revision?
  // Is this computed value going to be walking the whole revision?
  currentSelectorItemId: null,
  currentSelector: computed(state => null),

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
    // - enumerable types -> keep first, remove rest @todo add case for not doing this (tuple-like)
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
        // output as EDIT_ALL_VALUES in many common cases without enumerable types.
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
    state.currentSelectorItemId = null;
    state.unsavedRevisionIds.push(newRevisionId);

    // => Verification
    // - Does this work with single values (allowMultiple=false) where users can edit the field directly?
    // - Does this work with single values (allowMultiple=false) where users can revise the field
    // - Does this work with adding a new item to a list (allowMultiple=true)
    // - Does this work with amending an item on a list (allowMultiple=true)
    // - Does this work with a mix of the above (single transcription, multiple comments)
    // - Does this work with a mix of the above, but editing revision
  }),

  // Not sure what this will do yet, might be a thunk.
  saveRevision: action((state, { revisionId }) => {
    // Grab revisions from unsavedRevisionIds
    // Call passed in callback for saving revisions
    // set unsavedRevisionIds to []
    return null as any;
  }),

  // Just sets the id.
  selectRevision: action((state, { revisionId }) => {
    if (state.revisions[revisionId]) {
      state.currentRevisionId = revisionId;
    }
  }),
  deselectRevision: action((state, { revisionId }) => {
    state.currentRevisionId = null;
  }),

  // These will probably have to walk through the revision.
  // @todo strategy for this.
  // @todo UI for this will work well as there just needs to be a single "Document editor"
  //   as the revisions are documents.
  updateFieldValue: action((state, { value, path }) => {
    const field = getRevisionFieldFromPath<FieldTypes>(state, path);
    if (field) {
      field.value = value;
    }
  }),
  updateFieldSelector: action((state, { state: selectorState, path }) => {
    const field = getRevisionFieldFromPath<FieldTypes>(state, path);
    if (field && field.selector) {
      field.selector.state = selectorState;
    }
  }),
  updateEntitySelector: action((state, { state: selectorState, path }) => {
    const entity = getRevisionFieldFromPath<CaptureModel['document']>(state, path);
    if (entity && entity.selector) {
      entity.selector.state = selectorState;
    }
  }),

  // @todo look into allowMultiple and allowMultiple in same revision as this
  //   may not be the desired behaviour. Could be configuration that's passed
  //   in and controlled by UI.
  createNewFieldInstance: action((state, { path, property }) => {
    // Grab the parent entity where we want to add a new field.
    const entity = getRevisionFieldFromPath<CaptureModel['document']>(state, path);
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
    const newField = copyOriginal<FieldTypes>(template);
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
  removeFieldInstance: action((state, { path }) => {
    const [fieldProp, fieldId] = path.slice(-1)[0];
    const pathToResource = path.slice(0, -1);
    const entity = getRevisionFieldFromPath<CaptureModel['document']>(state, pathToResource);

    if (entity && entity.properties[fieldProp]) {
      entity.properties[fieldProp] = (entity.properties[fieldProp] as any[]).filter(field => field.id !== fieldId);
    }
  }),
  createNewEntityInstance: action((state, { path }) => {
    // @todo this will be much the same as adding a new field instance, but instead it will
    //   have to recurse through all of the properties and apply the same logic as the field logic.
    //   This is probably the point where that logic will have to be split out.
    //   Moving the nuking code to the plugin store will make sense I think.
    return null as any;
  }),
  removeEntityInstance: action((state, { path }) => {
    // @todo could be merged into a single removeInstance({ path }) action.
    const [fieldProp, fieldId] = path.slice(-1)[0];
    const pathToResource = path.slice(0, -1);
    const entity = getRevisionFieldFromPath<CaptureModel['document']>(state, pathToResource);

    if (entity && entity.properties[fieldProp]) {
      entity.properties[fieldProp] = (entity.properties[fieldProp] as any[]).filter(field => field.id !== fieldId);
    }
  }),
}));
