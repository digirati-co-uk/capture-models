import React from 'react';
import { registerField } from '@capture-models/plugin-api';
import { TextField, TextFieldProps } from './TextField';
import { FieldSpecification } from '@capture-models/types';

declare module '@capture-models/types' {
  export interface FieldTypeMap {
    'text-field': TextFieldProps;
  }
}

const specification: FieldSpecification<TextFieldProps> = {
  label: 'Text field',
  type: 'text-field',
  description: 'Simple text field for plain text',
  Component: TextField,
  defaultValue: '',
  allowMultiple: true,
  defaultProps: {},
  Editor: React.lazy(() => import(/* webpackChunkName: "editors" */ './TextField.editor')),
};

registerField(specification);

export default specification;
