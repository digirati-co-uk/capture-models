import {
  BackgroundSplash,
  CardButton,
  CardButtonGroup,
  Revisions,
  RoundedCard,
  useChoiceRevisions,
} from '@capture-models/editor';
import { StructureType } from '@capture-models/types';
import React from 'react';

export const RevisionList: React.FC<{ model: StructureType<'model'> }> = ({ model }) => {
  const revisions = useChoiceRevisions(model.id);
  const selectRevision = Revisions.useStoreActions(a => a.selectRevision);
  const createRevision = Revisions.useStoreActions(a => a.createRevision);

  return (
    <BackgroundSplash header={model.label} description={model.description}>
      {revisions.map((rev, idx) => (
        <RoundedCard
          label={rev.revision.label || rev.revision.id}
          interactive
          key={idx}
          onClick={() => selectRevision({ revisionId: rev.revision.id })}
        >
          {rev.revision.approved ? 'Approved' : 'Draft'}
        </RoundedCard>
      ))}
      <CardButtonGroup>
        <CardButton onClick={() => createRevision({ revisionId: model.id, cloneMode: 'FORK_ALL_VALUES' })}>
          Edit
        </CardButton>
        <CardButton onClick={() => createRevision({ revisionId: model.id, cloneMode: 'FORK_TEMPLATE' })}>
          Create new
        </CardButton>
      </CardButtonGroup>
    </BackgroundSplash>
  );
};
