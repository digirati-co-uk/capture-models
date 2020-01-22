import { Field, Form, Formik, useFormikContext } from 'formik';
import { Button, Form as StyledForm, Segment } from 'semantic-ui-react';
import { TextFieldProps } from '../input-types/TextField/TextField';
import { FieldSpecification, FieldTypeMap, FieldTypes } from '../types/field-types';
import React, { createContext, useContext, useState } from 'react';
import { SelectorContentTypeMap, SelectorSpecification, SelectorTypeMap, SelectorTypes } from '../types/selector-types';
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

export function useSelectorStatus<T extends SelectorTypes>(props: T, updateSelector: any) {
  const ctx = useContext(PluginContext);

  const selector = ctx.selectors[props.type];
  if (!selector) {
    throw new Error('Plugin does not exist');
  }

  return [React.createElement(selector.FormComponent, { ...props, updateSelector })];

  // @todo A selector needs to be rendered in two places.
  //    - On the content, using a content-specific plugin
  //    - On the form, showing the state of it
  //   On the from we need to decide what information we will
  //   show about the selector. Will it just be a lifecycle of
  //   the selector (choose, chosen, change, discard etc.) or will
  //   it also show a preview of the content in its refined state.
  //   For example, a text selector may show a the snippet of text,
  //   or an image show the cropped image.
  //   How would this vary between content, should the be up to the
  //   rendering component to just understand? How does the content-
  //   specific side of the component relay this preview-state?
  //   Selector state machine required.
  //    - opening/closing selector on form (local)
  //    - choosing to edit selector
  //    - updating state of selector
  //    - updating selector preview data
  //    - deselecting selector on form
  //    - highlighting selector? (hover on form?)
  //    - Automatically changing view based on outer most selector in revision
  //    - Displaying revisions nested selectors
  //    - clicking displayed selector and highlighting form field
  //   Also need to add some missing elements to the form editor:
  //    - choosing a selector
  //    - configuring its form (if any)
  //    - Saving to the main model
}

export function useField<T extends FieldTypes>(props: T, value: T['value'], updateValue: (value: T['value']) => void) {
  const ctx = useContext(PluginContext);

  const field = ctx.fields[props.type];
  if (!field) {
    throw new Error('Plugin does not exist');
  }

  // @ts-ignore
  return [React.createElement(field.Component, { ...props, value, updateValue })];
}

export const FormPreview: React.FC<{ term?: string }> = ({ term }) => {
  const { values } = useFormikContext();
  const [value, setValue] = useState(values.value);

  // const [field] = useField(values, value, setValue);

  return <FieldWrapper field={{ ...values, value }} term={term} onUpdateValue={setValue} />;
};

export const PluginProvider: React.FC<{ pluginStore?: PluginStore }> = ({ children, pluginStore: storeOverride }) => {
  return <PluginContext.Provider value={storeOverride || pluginStore}>{children}</PluginContext.Provider>;
};
