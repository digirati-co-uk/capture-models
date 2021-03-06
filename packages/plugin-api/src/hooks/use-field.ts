import { BaseField } from '@capture-models/types';
import { createElement } from 'react';
import { useFieldPlugin } from './use-field-plugin';

export function useField<Props extends BaseField>(
  props: Props,
  value: Props['value'],
  updateValue: (value: Props['value']) => void
) {
  const field = useFieldPlugin(props.type);

  return createElement(field.Component, { ...props, value, updateValue });
}
