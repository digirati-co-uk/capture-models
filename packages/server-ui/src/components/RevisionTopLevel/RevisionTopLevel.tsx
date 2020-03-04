import { Revisions } from '@capture-models/editor';
import { RevisionRequest } from '@capture-models/types';
import React from 'react';
import { VerboseEntityPage } from '../VerboseEntityPage/VerboseEntityPage';

export const RevisionTopLevel: React.FC<{ onSaveRevision: (req: RevisionRequest) => void }> = ({ onSaveRevision }) => {
  const current = Revisions.useStoreState(s => s.currentRevision);
  if (!current) return null;

  return (
    <>
      <VerboseEntityPage
        entity={{ property: 'root', instance: current.document }}
        path={[]}
        goBack={() => {
          onSaveRevision(current);
        }}
      />
    </>
  );
};
