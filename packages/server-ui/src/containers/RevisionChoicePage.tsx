import { Revisions, useChoiceRevisions } from '@capture-models/editor';
import { RevisionList } from '../components/RevisionList/RevisionList';
import { StructureType } from '@capture-models/types';
import React from 'react';

export const RevisionChoicePage: React.FC<{ model: StructureType<'model'>; goBack?: () => void }> = ({
  model,
  goBack,
}) => {
  const revisions = useChoiceRevisions(model.id);
  const selectRevision = Revisions.useStoreActions(a => a.selectRevision);
  const createRevision = Revisions.useStoreActions(a => a.createRevision);

  return (
    <RevisionList
      model={model}
      goBack={goBack}
      revisions={revisions}
      selectRevision={selectRevision}
      createRevision={createRevision}
    />
  );
};
