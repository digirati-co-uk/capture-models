import { BaseField } from '@capture-models/types';
import { createElement, useContext } from 'react';
import { PluginContext } from '../context';

export function useField<Props extends BaseField>(
  props: Props,
  value: Props['value'],
  updateValue: (value: Props['value']) => void
) {
  const ctx = useContext(PluginContext);

  const field = ctx.fields[props.type];
  if (!field) {
    throw new Error('Plugin does not exist');
  }

  return [createElement(field.Component, { ...props, value, updateValue })];
}
