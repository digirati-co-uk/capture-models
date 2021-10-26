import React from 'react';
import { registerField } from '@capture-models/plugin-api';
import { FieldSpecification } from '@capture-models/types';
import { CheckboxFieldList, CheckboxListFieldProps } from './CheckboxFieldList';
import { CheckboxListFieldPreview } from './CheckboxListField.preview';

declare module '@capture-models/types' {
  export interface FieldTypeMap {
    'checkbox-list-field': CheckboxListFieldProps;
  }
}

const specification: FieldSpecification<CheckboxListFieldProps> = {
  defaultValue: {},
  type: 'checkbox-list-field',
  label: 'Checkbox list field',
  defaultProps: {},
  allowMultiple: true,
  TextPreview: CheckboxListFieldPreview,
  description: 'List of checkboxes',
  Component: CheckboxFieldList,
  Editor: React.lazy(() => import(/* webpackChunkName: "field-editors" */ './CheckboxListField.editor')),
  mapEditorProps: (props: CheckboxListFieldProps) => {
    return {
      ...props,
      optionsAsText: (props.options || []).map(option => `${option.value},${option.label}`).join('\n'),
    };
  },
  onEditorSubmit: ({
    optionsAsText,
    ...props
  }: CheckboxListFieldProps & { optionsAsText: string }): CheckboxListFieldProps => {
    if (typeof optionsAsText !== 'undefined') {
      return {
        ...props,
        options: optionsAsText
          ? optionsAsText.split('\n').map(str => {
              const [value, label] = str.split(',');
              return { value, label };
            })
          : [],
      };
    }
    return props;
  },
};

registerField(specification);

export default specification;
