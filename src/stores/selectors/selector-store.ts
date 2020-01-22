import { CaptureModel } from '../../types/capture-model';
import { SelectorModel } from './selector-model';
import { traverseDocument } from '../../utility/traverse-document';
import { SelectorTypes } from '../../types/selector-types';
import { action, State } from 'easy-peasy';

export function createSelectorStore(document?: CaptureModel['document']): SelectorModel {
  const selectors: SelectorTypes[] = [];
  if (document) {
    traverseDocument(document, {
      visitSelector(selector) {
        selectors.push(selector);
      },
    });
  }

  return {
    availableSelectors: selectors,
    currentSelectorId: null,
    selectorPreviewData: {},
    currentSelectorState: null,
    topLevelSelector: null,
    visibleSelectorIds: [],
  };
}

export function createSelectorActions<T extends object = {}>(
  resolveStore: (s: State<T>) => State<SelectorModel>,
  onUpdateSelector: (selectorId: string, state: SelectorTypes['state']) => void = () => {}
) {
  // Quick helper for resolving the store defined above.
  function storeAction<P = any>(func: (state: State<SelectorModel>, payload: P) => void) {
    return action<T, P>((state, payload) => func(resolveStore(state), payload));
  }

  return {
    chooseSelector: storeAction((state, payload) => {
      state.currentSelectorId = payload.selectorId;
    }),
    clearSelector: storeAction(state => {
      state.currentSelectorId = null;
    }),
    clearTopLevelSelector: storeAction((state, payload) => {
      state.topLevelSelector = null;
    }),
    setTopLevelSelector: storeAction((state, payload) => {
      state.topLevelSelector = payload.selectorId;
    }),
    updateSelector: storeAction((state, payload) => {
      const selectorToUpdate = state.availableSelectors.find(selector => selector.id === payload.selectorId);
      if (selectorToUpdate) {
        selectorToUpdate.state = payload.state;
        onUpdateSelector(payload.selectorId, payload.state);
      }
    }),
    updateSelectorPreview: storeAction((state, payload) => {
      state.selectorPreviewData[payload.selectorId] = payload.preview;
    }),
    addVisibleSelectorIds: storeAction((state, payload) => {
      for (const id of payload.selectorIds) {
        if (state.visibleSelectorIds.indexOf(id) === -1) {
          state.visibleSelectorIds.push(id);
        }
      }
    }),
    removeVisibleSelectorIds: storeAction((state, payload) => {
      state.visibleSelectorIds = state.visibleSelectorIds.filter(
        selector => payload.selectorIds.indexOf(selector) === -1
      );
    }),
    // Leaving these for now.
    // currentSelector: computed((state: State<T>) => {
    //   const storeState = resolveStore(state);
    //   console.log('=> current selector', storeState.availableSelectors, storeState.currentSelectorId);
    //   return resolveStore(state).availableSelectors.find(
    //     selector => selector.id === storeState.currentSelectorId
    //   ) as SelectorTypes;
    // }),
    // visibleSelectors: computed((state: State<T>) => {
    //   const storeState = resolveStore(state);
    //   return storeState.visibleSelectorIds.map(id =>
    //     storeState.availableSelectors.find(selector => selector.id === id)
    //   ) as SelectorTypes[];
    // }),
  };
}
