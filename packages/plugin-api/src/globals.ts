import { PluginStore } from '@capture-models/types';

declare global {
  export let $$captureModelGlobalStore: PluginStore;
}

const bootstrapGlobalStore: () => PluginStore = () => {
  const globalVar = (global || window) as any;

  if (!globalVar.$$captureModelGlobalStore) {
    globalVar.$$captureModelGlobalStore = {
      fields: {},
      contentTypes: {},
      selectors: {},
    };
  }

  return globalVar.$$captureModelGlobalStore;
};

export const pluginStore = bootstrapGlobalStore();
