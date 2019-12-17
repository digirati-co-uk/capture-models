import { Field, Form, Formik, useFormikContext } from 'formik';
import { Button, Form as StyledForm, Segment } from 'semantic-ui-react';
import { TextFieldProps } from '../input-types/TextField/TextField';
import { FieldSpecification, FieldTypeMap, FieldTypes } from '../types/field-types';
import React, { createContext, useContext, useState } from 'react';
import { SelectorContentTypeMap, SelectorSpecification, SelectorTypeMap } from '../types/selector-types';
import { BoxSelectorProps } from '../selector-types/BoxSelector/BoxSelector';
import { MapValues } from '../types/utility';
import { FieldWrapper } from '../components/FieldWrapper/FieldWrapper';

type PluginStore = {
  fields: {
    [K in keyof FieldTypeMap]?: FieldSpecification<FieldTypeMap[K], K>;
  };
  contentTypes: Array<keyof SelectorContentTypeMap>;
  selectors: {
    [K in keyof SelectorTypeMap]?: SelectorSpecification<SelectorTypeMap[K], K, MapValues<PluginStore['contentTypes']>>;
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
      contentTypes: [],
      selectors: {},
    };
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

export const registerContent = (contentType: keyof SelectorContentTypeMap) => {
  // This is a hack to set it. I don't know why the mapped types are not working.
  pluginStore.contentTypes.push(contentType);
};

export const registerSelector = (selector: { type: keyof SelectorTypeMap }) => {
  // This is a hack to set it. I don't know why the mapped types are not working.
  pluginStore.selectors[selector.type] = selector as SelectorSpecification<
    BoxSelectorProps,
    'box-selector',
    'canvas-panel'
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

export const FormPreview: React.FC = () => {
  const { values } = useFormikContext();
  const [value, setValue] = useState(values.value);

  // const [field] = useField(values, value, setValue);

  return <FieldWrapper field={{ ...values, value }} onUpdateValue={setValue} />;
};

export const PluginProvider: React.FC<{ pluginStore?: PluginStore }> = ({ children, pluginStore: storeOverride }) => {
  return <PluginContext.Provider value={storeOverride || pluginStore}>{children}</PluginContext.Provider>;
};
