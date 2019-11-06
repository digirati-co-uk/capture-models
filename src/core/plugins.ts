import React from 'react';

type PluginStore = {
  fields: {
    [type: string]: {
      type: string;
      EditComponent: React.FC;
      ViewComponent?: React.FC;
    };
  };
  selectors: {
    [type: string]: {
      type: string;
      EditComponent: React.FC;
      ViewComponent?: React.FC;
    };
  };
};

const bootstrapGlobalStore: () => PluginStore = () => {
  // @ts-ignore
  const globalVar = global || window;

  if (!globalVar.hasOwnProperty('$$captureModelGlobalStore')) {
    // @ts-ignore
    globalVar.$$captureModelGlobalStore = {
      fields: {},
      selectors: {},
    } as PluginStore;
  }

  // @ts-ignore
  return globalVar.$$captureModelGlobalStore as PluginStore;
};

export const pluginStore = bootstrapGlobalStore();

export const resetPluginStore = () => {
  pluginStore.selectors = {};
  pluginStore.fields = {};
};

export const registerField = <E extends React.FC, V extends React.FC>(
  type: string,
  EditComponent: E,
  ViewComponent?: V
) => {
  pluginStore.fields[type] = { type, EditComponent, ViewComponent };

  return pluginStore.fields[type];
};

export const registerSelector = <E extends React.FC, V extends React.FC>(
  type: string,
  EditComponent: E,
  ViewComponent?: V
) => {
  pluginStore.selectors[type] = { type, EditComponent, ViewComponent };

  return pluginStore.selectors[type];
};

export function getFieldPlugin<T extends string>(
  type: T
): {
  type: T;
  EditComponent: React.FC;
  ViewComponent: React.FC;
} {
  if (!pluginStore.fields[type]) {
    throw new Error(`Field type ${type} not found`);
  }

  return pluginStore.fields[type] as {
    type: T;
    EditComponent: React.FC;
    ViewComponent: React.FC;
  };
}

export function getSelectorPlugin<T extends string>(
  type: T
): {
  type: T;
  EditComponent: React.FC;
  ViewComponent: React.FC;
} {
  if (!pluginStore.selectors[type]) {
    throw new Error(`Field type ${type} not found`);
  }

  return pluginStore.selectors[type] as {
    type: T;
    EditComponent: React.FC;
    ViewComponent: React.FC;
  };
}
