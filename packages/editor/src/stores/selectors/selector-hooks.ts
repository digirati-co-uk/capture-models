import { BaseField, BaseSelector } from '@capture-models/types';
import { useSelector, useSelectors } from '@capture-models/plugin-api';
import { useCallback, useRef } from 'react';
import { Revisions } from '../revisions';
import { useDebouncedCallback } from 'use-debounce';
import { unstable_batchedUpdates } from 'react-dom';

export function useCurrentSelector(contentType: string, defaultState: any = null) {
  const updateSelector = Revisions.useStoreActions(a => a.updateCurrentSelector);

  return useSelector(
    Revisions.useStoreState(s => s.resolvedSelectors.find(({ id }) => id === s.selector.currentSelectorId)),
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
      ? s.resolvedSelectors.find(({ id }) => (field.selector ? id === field.selector.id : false))
      : undefined
  );
}

export function useSelectorWithId(targetId: string) {
  return Revisions.useStoreState(s => targetId ? s.resolvedSelectors.find( ({ id }) => id === targetId ) : undefined);
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
    Revisions.useStoreState(s => s.resolvedSelectors),
  ] as const;
}

export function useDisplaySelectors(contentType: string) {
  const updateSelectorPreviewQueue = useRef<any[]>([]);

  const allSelectors = Revisions.useStoreState(state => {
    return {
      visibleCurrentLevelSelectorIds: state.visibleCurrentLevelSelectorIds,
      visibleAdjacentSelectors: state.visibleAdjacentSelectors,
      visibleCurrentLevelSelectors: state.visibleCurrentLevelSelectors,
      topLevelSelector: state.topLevelSelector,
    };
  });

  const { paths, subtreePath } = Revisions.useStoreState(s => ({
    paths: s.selector.selectorPaths,
    subtreePath: s.revisionSubtreePath,
  }));

  const { pop, push, setPath, realUpdateSelectorPreview } = Revisions.useStoreActions(a => ({
    pop: a.revisionPopTo,
    push: a.revisionPushSubtree,
    setPath: a.revisionSetSubtree,
    realUpdateSelectorPreview: a.updateSelectorPreview,
  }));

  const [flushSelectors] = useDebouncedCallback(
    () => {
      const queue = updateSelectorPreviewQueue.current;
      if (!queue.length) {
        return;
      }
      unstable_batchedUpdates(() => {
        for (const action of queue) {
          realUpdateSelectorPreview(action);
        }
      });
      updateSelectorPreviewQueue.current = [];
    },
    200,
    { maxWait: 200, trailing: true }
  );

  const updateSelectorPreview = useCallback(
    (action: any) => {
      updateSelectorPreviewQueue.current.push(action);
      flushSelectors();
    },
    [flushSelectors]
  );

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

  // Selector components.
  const selectorComponents = useSelectors(allSelectors.visibleCurrentLevelSelectors, contentType, {
    readOnly: true,
    onClick: onClickDisplaySelector,
    updateSelectorPreview,
  });

  const topLevelSelectorComponents = useSelector(allSelectors.topLevelSelector, contentType, {
    readOnly: true,
    isTopLevel: true,
    onClick: onClickTopLevelSelector,
    updateSelectorPreview,
  });

  const adjacentSelectorComponents = useSelectors(allSelectors.visibleAdjacentSelectors, contentType, {
    readOnly: true,
    isAdjacent: true,
    onClick: onClickAdjacentSelector,
    updateSelectorPreview,
  });

  return [
    allSelectors.visibleCurrentLevelSelectorIds,
    selectorComponents,
    topLevelSelectorComponents,
    adjacentSelectorComponents,
  ] as const;
}
