import { CaptureModel } from './capture-model';

export type NavigationContext<Model extends CaptureModel = CaptureModel> = {
  currentView: Model['structure'];
  replacePath: (path: number[]) => void;
  currentPath: number[];
};

export type UseNavigation<Model extends CaptureModel = CaptureModel> = NavigationContext<Model> & {
  pushPath: (index: number) => void;
  popPath: () => void;
  resetPath: () => void;
};
