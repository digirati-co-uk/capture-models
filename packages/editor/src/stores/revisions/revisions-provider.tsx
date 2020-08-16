import { CaptureModel } from '@capture-models/types';
import { createContextStore } from 'easy-peasy';
import React, { useEffect } from 'react';
import { revisionStore } from './revisions-store';
import { RevisionsModel } from './revisions-model';

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
  revision?: string;
  excludeStructures?: boolean;
};

const InternalRevisionProvider: React.FC<RevisionProviderProps> = ({
  children,
  captureModel,
  initialRevision,
  revision,
  excludeStructures,
}) => {
  const { setCaptureModel, selectRevision } = useStoreActions(a => ({
    selectRevision: a.selectRevision,
    setCaptureModel: a.setCaptureModel,
  }));

  useEffect(() => {
    if (captureModel)
      setCaptureModel({
        captureModel,
        initialRevision: initialRevision ? initialRevision : revision,
        excludeStructures,
      });

    if (revision) selectRevision({ revisionId: revision });
  }, [captureModel, excludeStructures, initialRevision, revision, selectRevision, setCaptureModel]);

  return <>{children}</>;
};

export const RevisionProvider: React.FC<RevisionProviderProps & { initialData?: RevisionProviderProps }> = ({
  children,
  ...props
}) => {
  const { captureModel, initialRevision, excludeStructures, revision } = props.initialData ? props.initialData : props;

  return (
    <Provider>
      <InternalRevisionProvider
        captureModel={captureModel}
        initialRevision={initialRevision}
        excludeStructures={excludeStructures}
        revision={revision}
      >
        {children}
      </InternalRevisionProvider>
    </Provider>
  );
};
