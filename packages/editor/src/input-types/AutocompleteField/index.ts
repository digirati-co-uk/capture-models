import React from 'react';
import { registerField } from '@capture-models/plugin-api';
import { FieldSpecification } from '@capture-models/types';
import { AutocompleteField, AutocompleteFieldProps } from './AutocompleteField';

declare module '@capture-models/types' {
  export interface FieldTypeMap {
    'autocomplete-field': AutocompleteFieldProps;
  }
}

const specification: FieldSpecification<AutocompleteFieldProps> = {
  defaultValue: undefined,
  type: 'autocomplete-field',
  label: 'Autocomplete Field',
  defaultProps: {},
  allowMultiple: true,
  TextPreview: () => React.createElement(React.Fragment, {}, ['Not yet implemented']),
  description: 'Dynamic autocomplete driven by endpoint',
  Component: AutocompleteField,
  Editor: React.lazy(() => import(/* webpackChunkName: "editors" */ './AutocompleteField.editor')) as any,
};

registerField(specification);

export default specification;
