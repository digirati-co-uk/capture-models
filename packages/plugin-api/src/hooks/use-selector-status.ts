import { BaseSelector, InjectedSelectorProps } from '@capture-models/types';
import { createElement, useContext } from 'react';
import { PluginContext } from '../context';

export function useSelectorStatus<T extends BaseSelector>(
  props: T | undefined,
  actions: InjectedSelectorProps<T> = {}
) {
  const ctx = useContext(PluginContext);

  console.log({ props });

  if (!props) {
    return null;
  }

  const selector = ctx.selectors[props.type];
  if (!selector) {
    throw new Error('Plugin does not exist');
  }

  return createElement(selector.FormComponent, { ...props, ...actions });
}
