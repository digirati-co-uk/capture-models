import { CaptureModel } from '@capture-models/types';
import { createContextStore } from 'easy-peasy';
import React, { useEffect } from 'react';
import { revisionStore } from './revisions-store';
import { RevisionsModel } from './revisions-model.d';

export const {
  Provider,
  useStore,
  useStoreActions,
  useStoreDispatch,
  useStoreRehydrated,
  useStoreState,
} = createContextStore<RevisionsModel>(revisionStore);

type RevisionProviderProps = {
  captureModel?: CaptureModel;
  initialRevision?: string;
  excludeStructures?: boolean;
};

const InternalRevisionProvider: React.FC<RevisionProviderProps> = ({
  children,
  captureModel,
  initialRevision,
  excludeStructures,
}) => {
  const setCaptureModel = useStoreActions(a => a.setCaptureModel);

  useEffect(() => {
    if (captureModel)
      setCaptureModel({
        captureModel,
        initialRevision,
        excludeStructures,
      });
  }, [captureModel, excludeStructures, initialRevision, setCaptureModel]);

  return <>{children}</>;
};

export const RevisionProvider: React.FC<RevisionProviderProps & { initialData?: RevisionProviderProps }> = ({
  children,
  ...props
}) => {
  const { captureModel, initialRevision, excludeStructures } = props.initialData ? props.initialData : props;

  return (
    <Provider>
      <InternalRevisionProvider
        captureModel={captureModel}
        initialRevision={initialRevision}
        excludeStructures={excludeStructures}
      >
        {children}
      </InternalRevisionProvider>
    </Provider>
  );
};
