import React from 'react';
import { registerField } from '@capture-models/plugin-api';
import { TaggedTextFieldProps } from './TaggedTextField';
import { FieldSpecification } from '@capture-models/types';
import { TaggedTextFieldPreview } from './TaggedTextField.preview';

declare module '@capture-models/types' {
  export interface FieldTypeMap {
    'tagged-text-field': TaggedTextFieldProps;
  }
}

const specification: FieldSpecification<TaggedTextFieldProps> = {
  label: 'Tagged text field',
  type: 'tagged-text-field',
  description: 'Text field with custom tags you can apply to text',
  Component: React.lazy(() => import(/* webpackChunkName: "fields" */ './TaggedTextField')),
  defaultValue: '',
  allowMultiple: true,
  defaultProps: {
    preset: 'bentham',
  },
  Editor: React.lazy(() => import(/* webpackChunkName: "field-editors" */ './TaggedTextField.editor')),
  TextPreview: TaggedTextFieldPreview,
};

registerField(specification);

export default specification;
