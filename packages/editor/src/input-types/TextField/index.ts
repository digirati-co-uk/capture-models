import React from 'react';
import { registerField } from '@capture-models/plugin-api';
import { TextField, TextFieldProps } from './TextField';
import TextFieldEditor from './TextField.editor';
import { FieldSpecification } from '@capture-models/types';
import { TextFieldPreview } from './TextField.preview';

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
  // Editor: React.lazy(() => import(/* webpackChunkName: "editors" */ './TextField.editor')),
  Editor: TextFieldEditor,
  TextPreview: TextFieldPreview,
};

registerField(specification);

export default specification;
