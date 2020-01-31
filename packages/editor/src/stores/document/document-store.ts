import { CaptureModel, BaseField } from '@capture-models/types';
import { action, computed, createContextStore, thunk, thunkOn } from 'easy-peasy';

import { createDocument } from '../../utility/create-document';
import { createField } from '../../utility/create-field';
import { isEntity } from '../../utility/is-entity';
import { resolveSubtree } from '../../utility/resolve-subtree';
import { DocumentModel } from './document-model';

export const DocumentStore = createContextStore<
  DocumentModel,
  { captureModel: CaptureModel; onDocumentChange?: (model: CaptureModel['document']) => void }
>(initial => {
  return {
    // The actual capture model document we're working on.
    document: initial ? initial.captureModel.document : createDocument(),

    // A path through the document, for example: [ fieldA, fieldB ] would be represent a subtree at:
    // root.properties.fieldA[0].properties.fieldB[0]
    subtreePath: [],

    // The state tracks a single field, in order to offer an optional ergonomic API for editing individual fields.
    selectedFieldKey: null,

    // This will use the `subtreePath` value to compute the actual subtree when it updates, allowing it to be computed
    // once and used in multiple places.
    subtree: computed([state => state.subtreePath, state => state.document], (subtreePath, document) => {
      return resolveSubtree(subtreePath, document);
    }),

    // These are the property keys for a single subtree. This can be used an index for the properties.
    subtreeFieldKeys: computed([state => state.subtree], subtree => Object.keys(subtree.properties)),

    // This flattens a subtree into an enumerable list of keys and values.
    subtreeFields: computed(
      [state => state.subtreeFieldKeys, state => state.subtree],
      (keys: string[], subtree: CaptureModel['document']) => {
        return keys.map(key => {
          const item = subtree.properties[key];

          return { term: key, value: item[0] as BaseField | CaptureModel['document'] };
        });
      }
    ),

    // A way to replace the whole subtree path in one go.
    setSubtree: action((state, terms) => {
      state.selectedFieldKey = null;
      state.subtreePath = terms;
    }),

    // A helper to push a new subtree path, useful for navigation.
    pushSubtree: action((state, term) => {
      state.selectedFieldKey = null;
      state.subtreePath.push(term);
    }),

    // A helper to pop the last subtree path, useful for navigation.
    popSubtree: action((state, payload) => {
      state.selectedFieldKey = null;
      state.subtreePath = state.subtreePath.slice(0, payload && payload.count ? -1 * payload.count : -1);
    }),

    // A way to set the selected field.
    selectField: action((state, fieldKey) => {
      if (resolveSubtree(state.subtreePath, state.document).properties[fieldKey]) {
        state.selectedFieldKey = fieldKey;
      }
    }),

    // A simple way to deselect all fields.
    deselectField: action(state => {
      state.selectedFieldKey = null;
    }),

    // Adds a new field to the current subtree, and then selects it.
    addField: action((state, payload) => {
      resolveSubtree(state.subtreePath, state.document).properties[payload.term] = [createField(payload.field)];
      if (payload.select) {
        if ((payload.field.type as string) === 'entity') {
          state.selectedFieldKey = null;
          state.subtreePath.push(payload.term);
        } else {
          state.selectedFieldKey = payload.term;
        }
      }
    }),

    // Removes a field.
    removeField: action((state, payload) => {
      delete resolveSubtree(state.subtreePath, state.document).properties[payload];
    }),

    reorderField: action((state, payload) => {
      // @todo
    }),

    // This sets the non-state values, such as metadata on ALL instances of the
    // capture model field.
    setField: thunk((actions, payload) => {
      // get the keys.
      const keys = Object.keys(payload.field);
      // Add the following by dispatching the actions
      const skipKeys = ['selector', 'creator', 'revision', 'value'];
      // Loop the keys and apply custom values.
      for (const key of keys) {
        if (skipKeys.indexOf(key) !== -1) continue;
        actions.setCustomProperty({ term: payload.term, key, value: (payload.field as any)[key] });
      }

      actions.setFieldValue({ term: payload.term, value: payload.field.value });
      actions.setFieldSelector({ term: payload.term, selector: payload.field.selector });

      // Creat new action for setting custom property on field
      // This will allow all of the field setters to be generic and look for all fields that need to be updated, at the
      // same level but in different trees.
    }),

    // Sets a custom property on the selected field.
    setCustomProperty: action((state, payload) => {
      const prop = (payload.term ? payload.term : state.selectedFieldKey) as string;
      for (let term of resolveSubtree(state.subtreePath, state.document).properties[prop]) {
        (term as any)[payload.key] = payload.value;
      }
    }),

    // Sets label on the selected field.
    setLabel: action((state, label) => {
      resolveSubtree(state.subtreePath, state.document).label = label;
    }),

    // Sets description on the selected field.
    setDescription: action((state, description) => {
      resolveSubtree(state.subtreePath, state.document).description = description;
    }),

    setSelector: action((state, payload) => {
      resolveSubtree(state.subtreePath, state.document).selector = payload.selector;
    }),

    setSelectorState: action((state, payload) => {
      const selector = resolveSubtree(state.subtreePath, state.document).selector;
      if (selector) {
        selector.state = payload as any;
      }
    }),

    // setContext: action((state, payload) => {
    //   resolveSubtree(state.subtreePath, state.document)['@context'] = payload;
    // }),

    // Same as the helpers above but pre-filled with the currently selected field.
    // @todo all of these need support for nested resources. They should update cousin items too.
    //   - label: resource A
    //     collectionA:
    //       - label: resource A1
    //         collectionB:
    //           - label: resource B1 <-- changing this label should change B2 and B3 too, all the way up.
    //       - label: resource A1
    //         collectionB:
    //           - label: resource B2
    //       - label: resource A1
    //         collectionB:
    //           - label: resource B3
    setFieldLabel: action((state, payload) => {
      const prop = (payload.term ? payload.term : state.selectedFieldKey) as string;
      for (let term of resolveSubtree(state.subtreePath, state.document).properties[prop]) {
        term.label = payload.label;
      }
    }),
    setFieldDescription: action((state, payload) => {
      const prop = (payload.term ? payload.term : state.selectedFieldKey) as string;
      for (let term of resolveSubtree(state.subtreePath, state.document).properties[prop]) {
        term.description = payload.description;
      }
    }),
    setFieldSelector: action((state, payload) => {
      const prop = (payload.term ? payload.term : state.selectedFieldKey) as string;
      for (let term of resolveSubtree(state.subtreePath, state.document).properties[prop]) {
        term.selector = payload.selector;
      }
    }),
    setFieldSelectorState: action((state, payload) => {
      const prop = (payload.term ? payload.term : state.selectedFieldKey) as string;
      for (let term of resolveSubtree(state.subtreePath, state.document).properties[prop]) {
        if (term.selector) {
          term.selector.state = payload as any;
        }
      }
    }),
    setFieldValue: action((state, payload) => {
      const prop = (payload.term ? payload.term : state.selectedFieldKey) as string;
      for (let term of resolveSubtree(state.subtreePath, state.document).properties[prop]) {
        if (!isEntity(term)) {
          term.value = payload.value;
        }
      }
    }),
    setFieldTerm: action((state, payload) => {
      // @todo validation for overriding?
      const field = state.subtree.properties[payload.oldTerm];
      delete state.subtree.properties[payload.oldTerm];
      state.subtree.properties[payload.newTerm] = field;
    }),

    onDocumentChange: thunkOn(
      actions => [
        actions.addField,
        actions.removeField,
        actions.reorderField,
        actions.setLabel,
        actions.setDescription,
        actions.setField,
        actions.setCustomProperty,
        actions.setFieldLabel,
        actions.setFieldDescription,
        actions.setSelector,
        actions.setSelectorState,
        actions.setFieldValue,
        actions.setFieldTerm,
      ],
      async (_, payload, store) => {
        if (initial && initial.onDocumentChange) {
          const state = store.getStoreState() as DocumentModel;
          initial.onDocumentChange(state.document);
        }
      }
    ),
  };
});
