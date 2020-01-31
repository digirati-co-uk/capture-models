import { BaseSelector } from '@capture-models/types';
import { createElement, useContext } from 'react';
import { PluginContext } from '../context';

export function useSelectorStatus<T extends BaseSelector>(
  props: T | undefined,
  updateSelector: any,
  selectorPreview?: any
) {
  const ctx = useContext(PluginContext);

  if (!props) {
    return null;
  }

  const selector = ctx.selectors[props.type];
  if (!selector) {
    throw new Error('Plugin does not exist');
  }

  return [createElement(selector.FormComponent, { ...props, updateSelector, selectorPreview })];
}
