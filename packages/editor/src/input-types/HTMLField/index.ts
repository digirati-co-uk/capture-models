import React from 'react';
import { HTMLField, HTMLFieldProps } from './HTMLField';
import { registerField } from '@capture-models/plugin-api';
import { FieldSpecification } from '@capture-models/types';

declare module '@capture-models/types' {
  export interface FieldTypeMap {
    'html-field': HTMLFieldProps;
  }
}

const specification: FieldSpecification<HTMLFieldProps> = {
  defaultValue: '',
  type: 'html-field',
  label: 'HTML Field',
  defaultProps: {},
  allowMultiple: true,
  description: 'HTML WYSIWYG Editor for rich text, with custom HTML tag options',
  Component: HTMLField,
  Editor: React.lazy(() => import(/* webpackChunkName: "editors" */ './HTMLField.editor')),
};

registerField(specification);

export default specification;
