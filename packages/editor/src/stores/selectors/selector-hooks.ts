import { BaseField, BaseSelector } from '@capture-models/types';
import { useSelector, useSelectors } from '@capture-models/plugin-api';
import { Revisions } from '../revisions';

export function useCurrentSelector(contentType: string, defaultState: any = null) {
  const updateSelector = Revisions.useStoreActions(a => a.updateCurrentSelector);

  return useSelector(
    Revisions.useStoreState(s => s.selector.availableSelectors.find(({ id }) => id === s.selector.currentSelectorId)),
    contentType,
    {
      selectorPreview: Revisions.useStoreState(s =>
        s.selector.currentSelectorId ? s.selector.selectorPreviewData[s.selector.currentSelectorId] : null
      ),
      updateSelector,
      defaultState,
    }
  );
}

export function useFieldSelector(field: BaseField) {
  return Revisions.useStoreState(s =>
    field.selector
      ? s.selector.availableSelectors.find(({ id }) => (field.selector ? id === field.selector.id : false))
      : undefined
  );
}

export function useSelectorActions() {
  return [
    Revisions.useStoreActions(s => ({
      addVisibleSelectorIds: s.addVisibleSelectorIds,
      removeVisibleSelectorIds: s.removeVisibleSelectorIds,
      updateSelectorPreview: s.updateSelectorPreview,
      chooseSelector: s.chooseSelector,
      clearSelector: s.clearSelector,
    })),
    Revisions.useStoreState(s => s.selector.availableSelectors),
  ] as const;
}

export function useDisplaySelectors(contentType: string) {
  const ids = Revisions.useStoreState(s => s.selector.visibleSelectorIds);

  const selectorComponents = useSelectors(
    Revisions.useStoreState(s => {
      return s.selector.visibleSelectorIds
        .filter(id => s.selector.selectorPaths[id].length > 0)
        .map(id => s.selector.availableSelectors.find(r => r.id === id));
    }) as BaseSelector[],
    contentType,
    { readOnly: true }
  );

  const topLevelSelector = useSelector(
    Revisions.useStoreState(s => {
      const selector = s.selector.visibleSelectorIds.find(id => s.selector.selectorPaths[id].length === 0);
      return s.selector.availableSelectors.find(r => r.id === selector);
    }),
    contentType,
    { readOnly: true, isTopLevel: true }
  );

  return [ids, selectorComponents, topLevelSelector] as const;
}
