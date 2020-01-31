import { BaseSelector } from '@capture-models/types';
import { useSelector, useSelectors } from '@capture-models/plugin-api';
import { RevisionStore } from '../revisions/revisions-store';

export function useCurrentSelector(contentType: string) {
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

export function useDisplaySelectors(contentType: string) {
  return useSelectors(
    RevisionStore.useStoreState(s =>
      s.selector.visibleSelectorIds.map(id => s.selector.availableSelectors.find(r => r.id === id))
    ) as BaseSelector[],
    contentType,
    { readOnly: true }
  );
}
