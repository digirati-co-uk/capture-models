import { BaseField, BaseSelector } from '@capture-models/types';
import { PluginContext, useSelector, useSelectors } from '@capture-models/plugin-api';
import React, { useCallback, useContext, useRef } from 'react';
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

export function useSelectorHandlers() {
  const updateSelectorPreviewQueue = useRef<any[]>([]);

  const visibleSelectors = Revisions.useStoreState(state => {
    return {
      current: state.selector.currentSelectorId,
      currentLevel: state.visibleCurrentLevelSelectorIds,
      adjacent: state.visibleAdjacentSelectorIds,
      topLevel: state.topLevelSelector?.id,
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

  return {
    visibleSelectors,
    onClickDisplaySelector,
    onClickAdjacentSelector,
    onClickTopLevelSelector,
    updateSelectorPreview,
  };
}

/**
 * @deprecated
 * @param contentType
 */
export function useDisplaySelectors(contentType: string) {
  const {
    updateSelectorPreview,
    onClickAdjacentSelector,
    onClickDisplaySelector,
    onClickTopLevelSelector,
  } = useSelectorHandlers();

  const allSelectors = Revisions.useStoreState(state => {
    return {
      visibleCurrentLevelSelectorIds: state.visibleCurrentLevelSelectorIds,
      visibleAdjacentSelectors: state.visibleAdjacentSelectors,
      visibleCurrentLevelSelectors: state.visibleCurrentLevelSelectors,
      topLevelSelector: state.topLevelSelector,
    };
  });

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

export function SelectorRenderer({
  contentType,
  selector,
  options,
}: {
  contentType: string;
  selector: BaseSelector;
  options: {
    updateSelector?: any;
    selectorPreview?: any;
    updateSelectorPreview?: (data: { selectorId: string; preview: string }) => void;
    readOnly?: boolean;
    isTopLevel?: boolean;
    isAdjacent?: boolean;
    hidden?: boolean;
    defaultState?: any;
    onClick?: (selector: any) => void;
  };
}) {
  const ctx = useContext(PluginContext);
  const ref = ctx.selectors[selector.type];
  if (!ref) {
    return null;
  }
  const Component = ref?.contentComponents?.atlas;
  if (!Component) {
    return null;
  }

  if (!selector.state && !options.readOnly) {
    selector.state = ref.defaultState;
  }

  return React.createElement(ref.contentComponents[contentType], {
    key: selector.id,
    ...selector,
    ...options,
  } as any);
}

export function useAllSelectors(
  contentType: string,
  selectorVisibility: {
    adjacentSelectors?: boolean;
    topLevelSelectors?: boolean;
    displaySelectors?: boolean;
    currentSelector?: boolean;
  } = {}
) {
  const selectors = Revisions.useStoreState(state => state.selector.availableSelectors);
  const selectorHandlers = useSelectorHandlers();

  const topLevel = [];
  const currentLevel = [];
  const adjacent = [];
  const hidden = [];

  for (const selector of selectors) {
    if (selectorHandlers.visibleSelectors.current === selector.id) {
      continue;
    }

    if (selectorHandlers.visibleSelectors.topLevel === selector.id) {
      // The top level one.
      topLevel.push(
        React.createElement(SelectorRenderer, {
          contentType,
          selector,
          options: {
            isTopLevel: true,
            hidden: !selectorVisibility.topLevelSelectors,
            readOnly: true,
            onClick: selectorHandlers.onClickTopLevelSelector,
            updateSelectorPreview: selectorHandlers.updateSelectorPreview,
          },
        })
      );
      continue;
    }

    if (selectorHandlers.visibleSelectors.currentLevel.indexOf(selector.id) !== -1) {
      // Render  current level.
      currentLevel.push(
        React.createElement(SelectorRenderer, {
          contentType,
          selector,
          options: {
            hidden: !selectorVisibility.currentSelector,
            readOnly: true,
            onClick: selectorHandlers.onClickDisplaySelector,
            updateSelectorPreview: selectorHandlers.updateSelectorPreview,
          },
        })
      );
      continue;
    }

    if (selectorHandlers.visibleSelectors.adjacent.indexOf(selector.id) !== -1) {
      // Render adjacent level.
      adjacent.push(
        React.createElement(SelectorRenderer, {
          contentType,
          selector,
          options: {
            isAdjacent: true,
            readOnly: true,
            onClick: selectorHandlers.onClickAdjacentSelector,
            hidden: !selectorVisibility.adjacentSelectors,
          },
        })
      );
      continue;
    }

    // Render hidden selectors.
    hidden.push(
      React.createElement(SelectorRenderer, {
        contentType,
        selector,
        options: {
          hidden: true,
          readOnly: true,
        },
      })
    );
  }

  return [...adjacent, ...topLevel, ...currentLevel, ...hidden];
}
