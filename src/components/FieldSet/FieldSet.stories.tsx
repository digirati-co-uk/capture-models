import * as React from 'react';
import { createFormFieldReducer } from '../../core/current-form';
import { FieldTypes } from '../../types/field-types';
import { FieldSet, FieldSetRenderField } from './FieldSet';

export default { title: 'Components|Fieldset' };

const model = require('../../../fixtures/simple.json');

const firstOption = model.structure.items[0].items[0].fields.reduce(
  createFormFieldReducer(model.document),
  []
);

const simpleRenderField: FieldSetRenderField = (field: FieldTypes, config) => {
  return (
    <div key={config.key}>
      {field.label} ({field.type})
    </div>
  );
};

export const Simple: React.FC = () => (
  <FieldSet
    fields={firstOption}
    renderField={simpleRenderField}
    label={model.structure.items[0].items[0].label}
  />
);

const secondOption = model.structure.items[0].items[1].fields.reduce(
  createFormFieldReducer(model.document),
  []
);

export const SingleField: React.FC = () => (
  <FieldSet
    fields={secondOption}
    renderField={simpleRenderField}
    label={model.structure.items[0].items[1].label}
  />
);

const nestedModel = model.structure.items[1].fields.reduce(
  createFormFieldReducer(model.document),
  []
);

export const NestedModel: React.FC = () => (
  <FieldSet
    fields={nestedModel}
    renderField={simpleRenderField}
    label={model.structure.items[1].label}
  />
);

export const CustomNestedModel: React.FC = () => (
  <FieldSet
    fields={nestedModel}
    renderField={simpleRenderField}
    label={model.structure.items[1].label}
    renderNestedFieldset={(props, { key }) => (
      <FieldSet
        {...props}
        style={{ background: 'coral', margin: 5, padding: 5 }}
        key={key}
        renderField={(field, config) => (
          <div key={config.key}>
            Custom Inner field > "{field.label} ({field.type})"
          </div>
        )}
      />
    )}
  />
);
