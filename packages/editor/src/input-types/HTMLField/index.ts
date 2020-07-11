import React from 'react';
import { HTMLFieldProps } from './HTMLField';
import { registerField } from '@capture-models/plugin-api';
import { FieldSpecification } from '@capture-models/types';
import { HTMLFieldPreview } from './HTMLField.preview';

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
  TextPreview: HTMLFieldPreview,
  description: 'HTML WYSIWYG Editor for rich text, with custom HTML tag options',
  Component: React.lazy(() => import(/* webpackChunkName: "fields" */ './HTMLField')),
  Editor: React.lazy(() => import(/* webpackChunkName: "field-editors" */ './HTMLField.editor')),
};

registerField(specification);

export default specification;
