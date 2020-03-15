import { CaptureModel } from '@capture-models/types';
import { useCallback, useMemo, useState } from 'react';
import { traverseStructure } from '@capture-models/helpers';

type FlatNavigationMap = {
  id: string;
  structure: CaptureModel['structure'];
  path: string[];
};

/**
 * Use navigation
 *
 * Takes in a capture model and will return state for navigation through the structure
 * but not handle forms or revisions. This will be passed on from this component.
 */
export function useNavigation(structure: CaptureModel['structure'], startId?: string) {
  // 1) Create flat capture model structure object map (with stack path)
  const structureMap = useMemo(() => {
    const map: { [id: string]: FlatNavigationMap } = {};
    traverseStructure(structure, (item, path) => {
      map[item.id] = {
        id: item.id,
        structure: item,
        path,
      };
    });
    return map;
  }, [structure]);

  // 2) Set the initial item in the stack
  const [idStack, setIdStack] = useState(startId ? structureMap[startId].path : []);
  const currentId = idStack[idStack.length - 1] ? idStack[idStack.length - 1] : structure.id;

  // 3) Create helpers to push and pop from the id stack
  const push = useCallback((id: string) => {
    // @todo validation?
    setIdStack(stack => [...stack, id]);
  }, []);

  const pop = useCallback(() => {
    setIdStack((stack: string[]) => {
      return stack.slice(0, -1);
    });
  }, []);

  const peek = useCallback(() => {
    if (idStack.length <= 1) {
      return undefined;
    }
    const peekId = idStack[idStack.length - 2];
    return structureMap[peekId];
  }, [idStack, structureMap]);

  // 4) Map response in the hook to return the choice stack, current item and calculate the depth
  const choiceStack: FlatNavigationMap[] = idStack.map(id => structureMap[id]);

  // 5) Implement goto
  const goTo = useCallback(
    (id: string) => {
      const nextStructure = structureMap[id];
      if (nextStructure) {
        setIdStack(nextStructure.path);
      }
    },
    [structureMap]
  );

  return [
    structureMap[currentId].structure,
    {
      currentId,
      goTo,
      push,
      pop,
      peek,
      idStack,
      choiceStack,
      structureMap,
    },
  ] as const;
}
