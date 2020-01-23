import { useFormikContext } from 'formik';
import { ContentSpecification, ContentTypeMap } from '../types/content-types';
import { FieldSpecification, FieldTypeMap, FieldTypes } from '../types/field-types';
import { InjectedSelectorProps, SelectorSpecification, SelectorTypeMap, SelectorTypes } from '../types/selector-types';
import React, { PropsWithChildren, useContext, useMemo, useState } from 'react';
import { FieldWrapper } from '../components/FieldWrapper/FieldWrapper';
import { createContext } from '../utility/create-context';

type PluginStore = {
  fields: {
    [K in keyof FieldTypeMap]?: FieldSpecification<FieldTypeMap[K], K>;
  };
  contentTypes: {
    [K in keyof ContentTypeMap]?: ContentSpecification<ContentTypeMap[K], K>;
  };
  selectors: {
    [K in keyof SelectorTypeMap]?: SelectorSpecification<SelectorTypeMap[K], K, keyof PluginStore['contentTypes']>;
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
      contentTypes: {},
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
  pluginStore.fields[specification.type] = specification as any;
};

export const registerContent = (contentType: { type: keyof ContentTypeMap }) => {
  pluginStore.contentTypes[contentType.type] = contentType as any;
};

export const registerSelector = (selector: { type: keyof SelectorTypeMap }) => {
  pluginStore.selectors[selector.type] = selector as any;
};

export function getFieldPlugin(type: keyof FieldTypeMap) {
  const field = pluginStore.fields[type];
  if (!field) {
    throw new Error(`Field type ${type} not found`);
  }

  return field;
}

export const PluginContext = React.createContext<PluginStore>(pluginStore);

export function useSelector<T extends SelectorTypes>(
  selectorProps: T | undefined,
  contentType: keyof ContentTypeMap,
  customOptions: {
    updateSelector?: any;
    selectorPreview?: any;
    readOnly?: boolean;
  }
) {
  const selectors = useSelectors(selectorProps ? [selectorProps] : [], contentType, customOptions);

  if (!selectors.length) {
    return null;
  }

  return selectors[0];
}

export function useSelectors<T extends SelectorTypes>(
  selectorProps: T[] | undefined,
  contentType: keyof ContentTypeMap,
  customOptions: {
    updateSelector?: any;
    selectorPreview?: any;
    readOnly?: boolean;
  }
) {
  const { updateSelector = null, selectorPreview = null, readOnly = false } = customOptions;
  const ctx = useContext(PluginContext);

  if (!selectorProps) {
    return [];
  }

  const returnSelectors = [];
  for (const props of selectorProps) {
    const selector = ctx.selectors[props.type];
    if (!selector) {
      // throw new Error('Plugin does not exist');
      continue;
    }

    returnSelectors.push([
      React.createElement(selector.contentComponents[contentType], {
        ...props,
        key: props.id,
        readOnly,
        selectorPreview,
        updateSelector,
      } as T & InjectedSelectorProps<T>),
    ]);
  }

  return returnSelectors;
}

export function useSelectorStatus<T extends SelectorTypes>(
  props: T | undefined,
  updateSelector: any,
  selectorPreview?: any
) {
  const ctx = useContext(PluginContext);

  if (!props) {
    return null;
  }

  const selector = ctx.selectors[props.type];
  if (!selector) {
    throw new Error('Plugin does not exist');
  }

  return [React.createElement(selector.FormComponent, { ...props, updateSelector, selectorPreview })];
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

const [useContent, ContentContext] = createContext<{ type: string; state: any }>();

export function Content<Content extends ContentTypeMap, K extends keyof ContentTypeMap, State = Content[K]['state']>({
  type,
  state,
  children,
}: PropsWithChildren<{
  type: K;
  state: State;
}>): React.ComponentElement<any, any> {
  return (
    <ContentContext
      value={useMemo(() => {
        return { type, state };
      }, [state, type])}
    >
      {children}
    </ContentContext>
  );
}

export { useContent };
