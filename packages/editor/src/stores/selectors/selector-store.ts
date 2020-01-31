import { CaptureModel, BaseSelector } from '@capture-models/types';
import { SelectorModel } from './selector-model';
import { traverseDocument } from '../../utility/traverse-document';

export function createSelectorStore(document?: CaptureModel['document']): SelectorModel {
  const selectors: BaseSelector[] = [];
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
