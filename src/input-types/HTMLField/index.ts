import React from 'react';
import { FieldSpecification } from '../../types/field-types';
import { HTMLField, HTMLFieldProps } from './HTMLField';

declare module '../../types/field-types' {
  export interface FieldTypeMap {
    'html-field': HTMLFieldProps;
  }
}

const specification: FieldSpecification<HTMLFieldProps, 'html-field'> = {
  defaultValue: '',
  type: 'html-field',
  label: '',
  description: 'HTML WYSIWYG Editor for rich text, with custom HTML tag options',
  Component: HTMLField,
  Editor: React.lazy(() => import(/* webpackChunkName: "editors" */ './HTMLField.editor')),
};

export default specification;
