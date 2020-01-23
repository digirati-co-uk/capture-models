import { CaptureModel } from '../../types/capture-model';
import { SelectorModel } from './selector-model';
import { traverseDocument } from '../../utility/traverse-document';
import { SelectorTypes } from '../../types/selector-types';

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
