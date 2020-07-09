import React from 'react';
import { registerField } from '@capture-models/plugin-api';
import { TaggedTextField, TaggedTextFieldProps } from './TaggedTextField';
// import TextFieldEditor from './TextField.editor';
import { FieldSpecification } from '@capture-models/types';

declare module '@capture-models/types' {
  export interface FieldTypeMap {
    'tagged-text-field': TaggedTextFieldProps;
  }
}

const specification: FieldSpecification<TaggedTextFieldProps> = {
  label: 'Tagged text field',
  type: 'tagged-text-field',
  description: 'Text field with custom tags you can apply to text',
  Component: TaggedTextField,
  defaultValue: '',
  allowMultiple: true,
  defaultProps: {
    preset: 'bentham',
  },
  Editor: React.lazy(() => import(/* webpackChunkName: "editors" */ './TaggedTextField.editor')),
  TextPreview: () => React.createElement(React.Fragment, {}, ['Not yet implemented']),
};

registerField(specification);

export default specification;
