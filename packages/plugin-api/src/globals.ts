// import { PluginStore } from '@capture-models/types';
//
// declare global {
//   export var $$captureModelGlobalStore: PluginStore;
// }
//
// const bootstrapGlobalStore: () => PluginStore = () => {
//   // @ts-ignore
//   const globalVar = (global || window) as typeof window;
//
//   if (!globalVar.hasOwnProperty('$$captureModelGlobalStore')) {
//     globalVar.$$captureModelGlobalStore = {
//       fields: {},
//       contentTypes: {},
//       selectors: {},
//     };
//   }
//
//   return globalVar.$$captureModelGlobalStore;
// };
//
// export const pluginStore = bootstrapGlobalStore();
