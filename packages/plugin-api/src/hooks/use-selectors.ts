import { BaseSelector, InjectedSelectorProps } from '@capture-models/types';
import React, { useContext } from 'react';
import { PluginContext } from '../context';

export function useSelectors<T extends BaseSelector>(
  selectorProps: T[] | undefined,
  contentType: string,
  customOptions: {
    updateSelector?: any;
    selectorPreview?: any;
    readOnly?: boolean;
  }
) {
  const { updateSelector = null, selectorPreview = null, readOnly = false } = customOptions;
  const ctx = useContext(PluginContext);

  if (!selectorProps) {
    return [];
  }

  const returnSelectors = [];
  for (const props of selectorProps) {
    const selector = ctx.selectors[props.type];
    if (!selector) {
      // throw new Error('Plugin does not exist');
      continue;
    }

    returnSelectors.push([
      React.createElement(selector.contentComponents[contentType], {
        ...props,
        key: props.id,
        readOnly,
        selectorPreview,
        updateSelector,
      } as T & InjectedSelectorProps<T>),
    ]);
  }

  return returnSelectors;
}
