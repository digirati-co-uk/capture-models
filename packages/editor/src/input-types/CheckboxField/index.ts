import React from 'react';
import { registerField } from '@capture-models/plugin-api';
import { FieldSpecification } from '@capture-models/types';
import { CheckboxField, CheckboxFieldProps } from './CheckboxField';

declare module '@capture-models/types' {
  export interface FieldTypeMap {
    'checkbox-field': CheckboxFieldProps;
  }
}

const specification: FieldSpecification<CheckboxFieldProps> = {
  defaultValue: false,
  type: 'checkbox-field',
  label: 'Checkbox Field',
  defaultProps: {},
  allowMultiple: true,
  TextPreview: () => React.createElement(React.Fragment, {}, ['Not yet implemented']),
  description: 'Simple checkbox boolean value',
  Component: CheckboxField,
  Editor: React.lazy(() => import(/* webpackChunkName: "field-editors" */ './CheckboxField.editor')),
};

registerField(specification);

export default specification;
