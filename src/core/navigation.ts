import { UseNavigation } from '../types/navigation';
import { useCallback, useMemo, useState } from 'react';
import { CaptureModel } from '../types/capture-model';
import { useContext } from './context';

export function useNavigation(): UseNavigation {
  const { currentView, currentPath, replacePath } = useContext();

  const pushPath = useCallback(
    (index: number) => {
      replacePath([...currentPath, index]);
    },
    [currentPath, replacePath]
  );

  const popPath = useCallback(() => {
    replacePath(currentPath.slice(0, currentPath.length - 1));
  }, [currentPath, replacePath]);

  const resetPath = useCallback(() => {
    replacePath([]);
  }, [replacePath]);

  return useMemo(
    () => ({
      currentView,
      currentPath,
      pushPath,
      popPath,
      replacePath,
      resetPath,
    }),
    [currentView, currentPath, pushPath, popPath, replacePath, resetPath]
  );
}

export function useInternalNavigationState(captureModel: CaptureModel) {
  // Navigation actions.
  const [currentView, setCurrentView] = useState<CaptureModel['structure']>(() => captureModel.structure);
  const [currentPath, replacePathRaw] = useState<number[]>([]);

  const replacePath = useCallback(
    (path: number[]) => {
      setCurrentView(
        path.reduce((level, next) => {
          if (level.type === 'choice') {
            return level.items[next];
          }
          return level;
        }, captureModel.structure)
      );
      replacePathRaw(path);
    },
    // @todo The structure should never change. Check if this will cause any issues.
    [captureModel.structure]
  );

  return {
    currentPath,
    replacePath,
    currentView,
  };
}
