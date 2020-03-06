import { Revisions } from '@capture-models/editor';
import { RevisionRequest } from '@capture-models/types';
import React from 'react';
import { VerboseEntityPage } from '../VerboseEntityPage/VerboseEntityPage';

export const RevisionTopLevel: React.FC<{ readMode: boolean, onSaveRevision: (req: RevisionRequest) => void }> = ({ readMode, onSaveRevision }) => {
  const current = Revisions.useStoreState(s => s.currentRevision);
  const currentId = Revisions.useStoreState(s => s.currentRevisionId);
  if (!current) return null;

  if (readMode) {
    return <span>read only mode.</span>
  }

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
