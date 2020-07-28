import { BaseField, BaseSelector } from '@capture-models/types';
import { useSelector, useSelectors } from '@capture-models/plugin-api';
import { useCallback } from 'react';
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
  const ids = Revisions.useStoreState(s => s.visibleCurrentLevelSelectorIds);

  const paths = Revisions.useStoreState(s => s.selector.selectorPaths);
  const subtreePath = Revisions.useStoreState(s => s.revisionSubtreePath);

  const pop = Revisions.useStoreActions(a => a.revisionPopTo);
  const push = Revisions.useStoreActions(a => a.revisionPushSubtree);
  const setPath = Revisions.useStoreActions(a => a.revisionSetSubtree);
  const updateSelectorPreview = Revisions.useStoreActions(a => a.updateSelectorPreview);

  const onClickDisplaySelector = useCallback(
    (s: BaseSelector) => {
      const id = s.id;
      const path = paths[id];
      if (!path) {
        return;
      }

      const [property, fieldId] = path[path.length - 1];

      push({ term: property, id: fieldId });
    },
    [push, paths]
  );

  const selectorComponents = useSelectors(
    Revisions.useStoreState(s => {
      return s.visibleCurrentLevelSelectorIds
        .filter(id => s.selector.selectorPaths[id].length !== s.revisionSubtreePath.length)
        .map(id => s.selector.availableSelectors.find(r => r.id === id));
    }) as BaseSelector[],
    contentType,
    { readOnly: true, onClick: onClickDisplaySelector, updateSelectorPreview }
  );
  const onClickTopLevelSelector = useCallback(
    (s: BaseSelector) => {
      // @todo make this "popTo" and get the id from the selector.
      const id = s.id;
      const path = paths[id];
      if (!path) {
        return;
      }

      const [, fieldId] = path[path.length - 1];

      pop({ id: fieldId });
    },
    [paths, pop]
  );

  const topLevelSelector = useSelector(
    Revisions.useStoreState(s => {
      const selector = s.visibleCurrentLevelSelectorIds.find(id => {
        return s.selector.selectorPaths[id].length === s.revisionSubtreePath.length;
      });
      return s.selector.availableSelectors.find(r => r.id === selector);
    }),
    contentType,
    { readOnly: true, isTopLevel: true, onClick: onClickTopLevelSelector, updateSelectorPreview }
  );

  const onClickAdjacentSelector = useCallback(
    (s: BaseSelector) => {
      const id = s.id;
      const path = paths[id];
      if (!path) {
        return;
      }

      // @todo this might need to be more complex if we are to support skipping in adjacency
      const [property, fieldId] = path[path.length - 1];
      // const newPath = [...path.slice(0, -1), [property, fieldId]]
      const [currentProp, currentFieldId] = subtreePath[subtreePath.length - 1];

      if (property === currentProp && fieldId !== currentFieldId) {
        setPath([...subtreePath.slice(0, -1), [property, fieldId, false]]);
      }
    },
    [paths, setPath, subtreePath]
  );

  const adjacentSelectors = useSelectors(
    Revisions.useStoreState(s => {
      return s.visibleAdjacentSelectorIds.map(id => s.selector.availableSelectors.find(r => r.id === id));
    }) as BaseSelector[],
    contentType,
    { readOnly: true, isAdjacent: true, onClick: onClickAdjacentSelector, updateSelectorPreview }
  );

  return [ids, selectorComponents, topLevelSelector, adjacentSelectors] as const;
}
