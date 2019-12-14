import React from 'react';
import { registerField } from '../../core/plugins';
import { FieldSpecification } from '../../types/field-types';
import { TextField, TextFieldProps } from './TextField';

declare module '../../types/field-types' {
  export interface FieldTypeMap {
    'text-field': TextFieldProps;
  }
}

const specification: FieldSpecification<TextFieldProps, 'text-field'> = {
  label: 'Text field',
  type: 'text-field',
  description: 'Simple text field for plain text',
  Component: TextField,
  defaultValue: '',
  Editor: React.lazy(() => import(/* webpackChunkName: "editors" */ './TextField.editor')),
};

registerField(specification);

export default specification;
