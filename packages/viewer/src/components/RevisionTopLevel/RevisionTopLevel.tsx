import { Revisions } from '@capture-models/editor';
import React from 'react';
import { VerboseEntityPage } from '../VerboseEntityPage/VerboseEntityPage';

export const RevisionTopLevel: React.FC = () => {
  const current = Revisions.useStoreState(s => s.currentRevision);
  if (!current) return null;

  console.log({ current });

  return (
    <>
      <VerboseEntityPage
        entity={{ property: 'root', instance: current.document }}
        path={[]}
        goBack={() => console.log('Whole revision!', JSON.stringify(current))}
      />
    </>
  );
};
