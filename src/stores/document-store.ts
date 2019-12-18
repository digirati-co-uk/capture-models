import { action, Action, computed, Computed, createContextStore, debug, thunk, Thunk } from 'easy-peasy';
import { Draft, original } from 'immer';
import { Simulate } from 'react-dom/test-utils';
import { CaptureModel } from '../types/capture-model';
import { FieldTypes } from '../types/field-types';
import { SelectorTypes } from '../types/selector-types';

type DocumentModel = {
  document: CaptureModel['document'];
  subtreePath: string[];
  selectedFieldKey: string | null;

  subtree: Computed<DocumentModel, CaptureModel['document']>;
  subtreeFieldKeys: Computed<DocumentModel, string[]>;
  subtreeFields: Computed<DocumentModel, Array<{ term: string; value: CaptureModel['document'] | FieldTypes }>>;
  setSubtree: Action<DocumentModel, string[]>;
  pushSubtree: Action<DocumentModel, string>;
  popSubtree: Action<DocumentModel>;

  selectField: Action<DocumentModel, string>;
  deselectField: Action<DocumentModel>;

  addField: Action<DocumentModel, { term: string; field: FieldTypes }>;
  removeField: Action<DocumentModel, string>;
  reorderField: Action<DocumentModel, { term: string; startIndex: number; endIndex: number }>;

  // @todo re-implement when JSON-LD extension
  // setContext: Action<DocumentModel, CaptureModel['document']['@context']>;

  setLabel: Action<DocumentModel, string>;
  setDescription: Action<DocumentModel, string>;

  setField: Thunk<DocumentModel, { term?: string; field: FieldTypes }, any, DocumentModel>;
  setCustomProperty: Action<DocumentModel, { term?: string; key: string; value: any }>;

  setFieldLabel: Action<DocumentModel, { term?: string; label: string }>;
  setFieldDescription: Action<DocumentModel, { term?: string; description: string | undefined }>;
  setSelector: Action<DocumentModel, { term?: string; selector: SelectorTypes }>;
  setSelectorState: Action<DocumentModel, { term?: string; selectorType: string; selector: SelectorTypes['state'] }>;
  setFieldValue: Action<DocumentModel, { term?: string; value: FieldTypes['value'] }>;
  setFieldTerm: Action<DocumentModel, { oldTerm: string; newTerm: string }>;
};

const createDocument = (doc: Partial<CaptureModel['document']> = {}): CaptureModel['document'] => {
  return {
    type: 'entity',
    properties: {},
    ...doc,
  };
};

function resolveSubtree(subtreePath: string[], document: CaptureModel['document']) {
  return subtreePath.reduce((acc, next) => {
    const propValue = acc.properties[next];
    const singleModel = propValue[0];
    if (!propValue.length || !singleModel || singleModel.type !== 'entity') {
      throw Error(`Invalid prop: ${next} in list ${subtreePath.join(',')}`);
    }
    return singleModel;
  }, document as CaptureModel['document']);
}

export const DocumentStore = createContextStore<DocumentModel, CaptureModel>(captureModel => ({
  document: captureModel ? captureModel.document : createDocument(),
  subtreePath: [],
  selectedFieldKey: null,

  subtree: computed([state => state.subtreePath, state => state.document], (subtreePath, document) => {
    return resolveSubtree(subtreePath, document);
  }),
  subtreeFieldKeys: computed([state => state.subtree], subtree => Object.keys(subtree.properties)),
  subtreeFields: computed(
    [state => state.subtreeFieldKeys, state => state.subtree],
    (keys: string[], subtree: CaptureModel['document']) => {
      return keys.map(key => {
        const item = subtree.properties[key];

        return { term: key, value: item[0] as FieldTypes | CaptureModel['document'] };
      });
    }
  ),
  setSubtree: action((state, terms) => {
    state.selectedFieldKey = null;
    state.subtreePath = terms;
  }),
  pushSubtree: action((state, term) => {
    state.selectedFieldKey = null;
    state.subtreePath.push(term);
  }),
  popSubtree: action((state, payload) => {
    state.selectedFieldKey = null;
    state.subtreePath = state.subtreePath.slice(0, -1);
  }),

  selectField: action((state, fieldKey) => {
    if (resolveSubtree(state.subtreePath, state.document).properties[fieldKey]) {
      state.selectedFieldKey = fieldKey;
    }
  }),
  deselectField: action(state => {
    state.selectedFieldKey = null;
  }),

  addField: action((state, payload) => {
    resolveSubtree(state.subtreePath, state.document).properties[payload.term] = [payload.field];
  }),
  removeField: action((state, payload) => {
    delete resolveSubtree(state.subtreePath, state.document).properties[payload];
  }),
  reorderField: action((state, payload) => {
    // @todo
  }),

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
    // Creat new action for setting custom property on field
    // This will allow all of the field setters to be generic and look for all fields that need to be updated, at the
    // same level but in different trees.
  }),

  setCustomProperty: action((state, payload) => {
    const prop = (payload.term ? payload.term : state.selectedFieldKey) as string;
    for (let term of resolveSubtree(state.subtreePath, state.document).properties[prop]) {
      (term as any)[payload.key] = payload.value;
    }
  }),

  setLabel: action((state, label) => {
    resolveSubtree(state.subtreePath, state.document).label = label;
  }),
  setDescription: action((state, description) => {
    resolveSubtree(state.subtreePath, state.document).description = description;
  }),

  // setContext: action((state, payload) => {
  //   resolveSubtree(state.subtreePath, state.document)['@context'] = payload;
  // }),

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
  setSelector: action((state, payload) => {
    const prop = (payload.term ? payload.term : state.selectedFieldKey) as string;
    for (let term of resolveSubtree(state.subtreePath, state.document).properties[prop]) {
      term.selector = payload.selector;
    }
  }),
  setSelectorState: action((state, payload) => {
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
      if (term.type !== 'entity') {
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
}));
