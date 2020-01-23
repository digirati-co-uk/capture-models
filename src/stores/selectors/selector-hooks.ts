import { useSelector, useSelectors } from '../../core/plugins';
import { ContentTypeMap } from '../../types/content-types';
import { SelectorTypes } from '../../types/selector-types';
import { RevisionStore } from '../revisions/revisions-store';

export function useCurrentSelector(contentType: keyof ContentTypeMap) {
  const updateSelector = RevisionStore.useStoreActions(a => a.updateCurrentSelector);

  return useSelector(
    RevisionStore.useStoreState(s =>
      s.selector.availableSelectors.find(({ id }) => id === s.selector.currentSelectorId)
    ),
    contentType,
    {
      selectorPreview: RevisionStore.useStoreState(s =>
        s.selector.currentSelectorId ? s.selector.selectorPreviewData[s.selector.currentSelectorId] : null
      ),
      updateSelector,
    }
  );
}

export function useSelectorActions() {
  return [
    RevisionStore.useStoreActions(s => ({
      addVisibleSelectorIds: s.addVisibleSelectorIds,
      removeVisibleSelectorIds: s.removeVisibleSelectorIds,
      updateSelectorPreview: s.updateSelectorPreview,
      chooseSelector: s.chooseSelector,
      clearSelector: s.clearSelector,
    })),
    RevisionStore.useStoreState(s => s.selector.availableSelectors),
  ] as const;
}

export function useDisplaySelectors(contentType: keyof ContentTypeMap) {
  return useSelectors(
    RevisionStore.useStoreState(s =>
      s.selector.visibleSelectorIds.map(id => s.selector.availableSelectors.find(r => r.id === id))
    ) as SelectorTypes[],
    contentType,
    { readOnly: true }
  );
}
