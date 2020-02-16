import {
  RevisionProvider,
  useStore,
  useStoreActions,
  useStoreDispatch,
  useStoreRehydrated,
  useStoreState,
} from './revisions-provider';

export * from './revisions-model.d';

export const Revisions = {
  Provider: RevisionProvider,
  useStore,
  useStoreState,
  useStoreActions,
  useStoreDispatch,
  useStoreRehydrated,
};
