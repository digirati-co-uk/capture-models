import { action, Action, computed, Computed, createContextStore, debug } from 'easy-peasy';
import { Draft } from 'immer';
import { CaptureModel } from '../types/capture-model';
import { FieldTypes } from '../types/field-types';
import { SelectorTypes } from '../types/selector-types';

type DocumentModel = {
  document: CaptureModel['document'];
  subtreePath: string[];

  subtree: Computed<DocumentModel, CaptureModel['document']>;
  subtreeFieldKeys: Computed<DocumentModel, string[]>;
  subtreeFields: Computed<DocumentModel, Array<CaptureModel['document'] | FieldTypes>>;
  setSubtree: Action<DocumentModel, string[]>;
  pushSubtree: Action<DocumentModel, string>;
  popSubtree: Action<DocumentModel>;

  addField: Action<DocumentModel, { term: string; field: FieldTypes }>;
  removeField: Action<DocumentModel, string>;
  reorderField: Action<DocumentModel, { term: string; startIndex: number; endIndex: number }>;
  setContext: Action<DocumentModel, CaptureModel['document']['@context']>;

  setFieldLabel: Action<DocumentModel, { term: string; label: string }>;
  setFieldDescription: Action<DocumentModel, { term: string; description: string }>;
  setSelector: Action<DocumentModel, { term: string; selector: SelectorTypes }>;
  setSelectorState: Action<DocumentModel, { term: string; selectorType: string; selector: SelectorTypes['state'] }>;
  setFieldValue: Action<DocumentModel, { term: string; value: FieldTypes['value'] }>;
  setFieldTerm: Action<DocumentModel, { oldTerm: string; newTerm: string }>;
};

const createDocument = (doc: Partial<CaptureModel['document']> = {}): CaptureModel['document'] => {
  return {
    type: 'entity',
    term: '@none',
    properties: {},
    ...doc,
  };
};

function resolveSubtree(subtreePath: string[], document: CaptureModel['document']) {
  return subtreePath.reduce(
    (acc, next) => {
      const propValue = acc.properties[next];
      const singleModel = propValue[0];
      if (!propValue.length || !singleModel || singleModel.type !== 'entity') {
        throw Error(`Invalid prop: ${next} in list ${subtreePath.join(',')}`);
      }
      return singleModel;
    },
    document as CaptureModel['document']
  );
}

export const DocumentStore = createContextStore<DocumentModel, CaptureModel>(captureModel => ({
  document: captureModel ? captureModel.document : createDocument(),
  subtreePath: [],

  subtree: computed([state => state.subtreePath, state => state.document], (subtreePath, document) => {
    return resolveSubtree(subtreePath, document);
  }),
  subtreeFieldKeys: computed([state => state.subtree], subtree => Object.keys(subtree.properties)),
  subtreeFields: computed(
    [state => state.subtreeFieldKeys, state => state.subtree],
    (keys: string[], subtree: CaptureModel['document']) => {
      return keys.map(key => {
        const item = subtree.properties[key];
        return item[0] as FieldTypes | CaptureModel['document'];
      });
    }
  ),
  setSubtree: action((state, terms) => {
    state.subtreePath = terms;
  }),
  pushSubtree: action((state, term) => {
    state.subtreePath.push(term);
  }),
  popSubtree: action((state, payload) => {
    state.subtreePath = state.subtreePath.slice(0, -1);
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
  setContext: action((state, payload) => {
    resolveSubtree(state.subtreePath, state.document)['@context'] = payload;
  }),
  setFieldLabel: action((state, payload) => {
    for (let term of resolveSubtree(state.subtreePath, state.document).properties[payload.term]) {
      term.label = payload.label;
    }
  }),
  setFieldDescription: action((state, payload) => {
    for (let term of resolveSubtree(state.subtreePath, state.document).properties[payload.term]) {
      term.description = payload.description;
    }
  }),
  setSelector: action((state, payload) => {
    for (let term of resolveSubtree(state.subtreePath, state.document).properties[payload.term]) {
      term.selector = payload.selector;
    }
  }),
  setSelectorState: action((state, payload) => {
    for (let term of resolveSubtree(state.subtreePath, state.document).properties[payload.term]) {
      if (term.selector) {
        term.selector.state = payload as any;
      }
    }
  }),
  setFieldValue: action((state, payload) => {
    for (let term of resolveSubtree(state.subtreePath, state.document).properties[payload.term]) {
      if (term.type !== 'entity') {
        term.value = payload.value;
      }
    }
  }),
  setFieldTerm: action((state, payload) => {
    const field = state.subtree.properties[payload.oldTerm];
    delete state.subtree.properties[payload.oldTerm];
    state.subtree.properties[payload.newTerm] = field;
  }),
}));
