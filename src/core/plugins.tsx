import { Field, Form, Formik, useFormikContext } from 'formik';
import { Button, Form as StyledForm, Segment } from 'semantic-ui-react';
import { TextFieldProps } from '../input-types/TextField/TextField';
import { FieldSpecification, FieldTypeMap, FieldTypes } from '../types/field-types';
import React, { createContext, useContext, useState } from 'react';

type PluginStore = {
  fields: {
    [K in keyof FieldTypeMap]?: FieldSpecification<FieldTypeMap[K], K>;
  };
};

declare global {
  export var $$captureModelGlobalStore: PluginStore;
}

const bootstrapGlobalStore: () => PluginStore = () => {
  // @ts-ignore
  const globalVar = (global || window) as typeof window;

  if (!globalVar.hasOwnProperty('$$captureModelGlobalStore')) {
    globalVar.$$captureModelGlobalStore = {
      fields: {},
    } as PluginStore;
  }

  return globalVar.$$captureModelGlobalStore;
};

export const pluginStore = bootstrapGlobalStore();

export const resetPluginStore = () => {
  pluginStore.fields = {};
};

export const registerField = (specification: { type: keyof FieldTypeMap }) => {
  // This is a hack to set it. I don't know why the mapped types are not working.
  pluginStore.fields[specification.type as 'text-field'] = specification as FieldSpecification<
    TextFieldProps,
    'text-field'
  >;
};

export function getFieldPlugin(type: keyof FieldTypeMap) {
  const field = pluginStore.fields[type];
  if (!field) {
    throw new Error(`Field type ${type} not found`);
  }

  return field;
}

export const PluginContext = createContext<PluginStore>(pluginStore);

export function useField<T extends FieldTypes>(props: T, value: T['value'], updateValue: (value: T['value']) => void) {
  const ctx = useContext(PluginContext);

  const field = ctx.fields[props.type];
  if (!field) {
    throw new Error('Plugin does not exist');
  }

  // @ts-ignore
  return [React.createElement(field.Component, { ...props, value, updateValue })];
}

// @todo convert to component.
export function useFieldEditor<T extends FieldTypes>(props: T, onSubmit: (newProps: T) => void) {
  const ctx = useContext(PluginContext);

  const field = ctx.fields[props.type];
  if (!field) {
    throw new Error('Plugin does not exist');
  }

  // @ts-ignore
  const editor = React.createElement(field.Editor, props);

  // @todo split this out into own component.
  return [
    <React.Suspense fallback="loading...">
      <Formik initialValues={props} onSubmit={onSubmit}>
        <Form className="ui form">
          <StyledForm.Field>
            <label>
              Label
              <Field type="text" name="label" required={true} />
            </label>
          </StyledForm.Field>
          <StyledForm.Field>
            <label>
              Description
              <Field as="textarea" name="description" />
            </label>
          </StyledForm.Field>
          {/* @todo hookup term/vocab selector */}
          <StyledForm.Field>
            <label>
              Term
              <Field type="text" name="term" />
            </label>
          </StyledForm.Field>
          {/* @todo selector selector */}
          {editor}
          <Button type="submit">Save changes</Button>
        </Form>
      </Formik>
    </React.Suspense>,
  ];
}

export const FormPreview: React.FC = () => {
  const { values } = useFormikContext();
  const [value, setValue] = useState(values.value);

  const [field] = useField(values, value, setValue);

  return field;
};

export const PluginProvider: React.FC<{ pluginStore?: PluginStore }> = ({ children, pluginStore: storeOverride }) => {
  return <PluginContext.Provider value={storeOverride || pluginStore}>{children}</PluginContext.Provider>;
};
