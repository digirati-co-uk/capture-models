import { useFormikContext } from 'formik';
import React, { PropsWithChildren, useContext, useMemo, useState } from 'react';
import { FieldWrapper } from '../components/FieldWrapper/FieldWrapper';
import { createContext } from '../utility/create-context';
import {
  BaseContent,
  BaseField,
  BaseSelector,
  ContentSpecification,
  ContentTypeMap,
  FieldSpecification,
  FieldTypeMap,
  InjectedSelectorProps,
  PluginStore,
  SelectorSpecification,
} from '@capture-models/types';

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
  pluginStore.contentTypes = {};
  pluginStore.selectors = {};
};

export function registerField<Props extends BaseField>(specification: FieldSpecification<Props>) {
  pluginStore.fields[specification.type] = specification as any;
}

export function registerContent<Props extends BaseContent>(contentType: ContentSpecification<Props>) {
  pluginStore.contentTypes[contentType.type] = contentType as any;
}

export function registerSelector<Props extends BaseSelector>(specification: SelectorSpecification<Props>) {
  pluginStore.selectors[specification.type] = specification as any;
}

export function getFieldPlugin<Props extends BaseField, TypeMap extends FieldTypeMap = FieldTypeMap>(
  type: string
): FieldSpecification<Props> {
  const field = pluginStore.fields[type];
  if (!field) {
    throw new Error(`Field type ${type} not found`);
  }

  return field as FieldSpecification<Props>;
}

export const PluginContext = React.createContext<PluginStore>(pluginStore);

export function useSelector<T extends BaseSelector>(
  selectorProps: T | undefined,
  contentType: string,
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

export function useSelectors<T extends BaseSelector>(
  selectorProps: T[] | undefined,
  contentType: string,
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

export function useSelectorStatus<T extends BaseSelector>(
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

export function useField<Props extends { type: string; value: any }>(
  props: Props,
  value: Props['value'],
  updateValue: (value: Props['value']) => void
) {
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
