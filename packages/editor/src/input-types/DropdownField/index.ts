import React from 'react';
import { registerField } from '@capture-models/plugin-api';
import { FieldSpecification } from '@capture-models/types';
import { DropdownField, DropdownFieldProps } from './DropdownField';

declare module '@capture-models/types' {
  export interface FieldTypeMap {
    'Dropdown-field': DropdownFieldProps;
  }
}

const specification: FieldSpecification<DropdownFieldProps> = {
  defaultValue: undefined,
  type: 'dropdown-field',
  label: 'Dropdown Field',
  defaultProps: {},
  allowMultiple: true,
  TextPreview: () => React.createElement(React.Fragment, {}, ['Not yet implemented']),
  description: 'Simple list of static values',
  Component: DropdownField,
  Editor: React.lazy(() => import(/* webpackChunkName: "editors" */ './DropdownField.editor')) as any,
  mapEditorProps: (props: DropdownFieldProps) => {
    return {
      ...props,
      optionsAsText: (props.options || [])
        .map(option => `${option.value},${option.text}${option.label ? `,${option.label}` : ''}`)
        .join('\n'),
    };
  },
  onEditorSubmit: ({ optionsAsText, ...props }: DropdownFieldProps & { optionsAsText: string }): DropdownFieldProps => {
    if (typeof optionsAsText !== 'undefined') {
      return {
        ...props,
        options: optionsAsText.split('\n').map(str => {
          const [value, text, label] = str.split(',');
          return { value, text: text ? text : value, label };
        }),
      };
    }
    return props;
  },
};

registerField(specification);

export default specification;
