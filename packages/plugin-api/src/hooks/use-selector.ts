import { useSelectors } from './use-selectors';
import { BaseSelector } from '@capture-models/types';

export function useSelector<T extends BaseSelector>(
  selectorProps: T | undefined,
  contentType: string,
  customOptions: {
    updateSelector?: any;
    selectorPreview?: any;
    readOnly?: boolean;
    defaultState?: any;
  }
) {
  const selectors = useSelectors(selectorProps ? [selectorProps] : [], contentType, customOptions);

  if (!selectors.length) {
    return null;
  }

  return selectors[0];
}
