import { useSelectors } from './use-selectors';
import { BaseSelector, InjectedSelectorProps } from '@capture-models/types';

export function useSelector<T extends BaseSelector>(
  selectorProps: T | undefined,
  contentType: string,
  customOptions: {
    updateSelector?: any;
    selectorPreview?: any;
    updateSelectorPreview?: (value: any) => void;
    readOnly?: boolean;
    defaultState?: any;
    isTopLevel?: boolean;
    isAdjacent?: boolean;
    onClick?: (selector: T & InjectedSelectorProps<T['state']>) => void;
  }
) {
  const selectors = useSelectors(selectorProps ? [selectorProps] : [], contentType, customOptions);

  if (!selectors.length) {
    return null;
  }

  return selectors[0];
}
