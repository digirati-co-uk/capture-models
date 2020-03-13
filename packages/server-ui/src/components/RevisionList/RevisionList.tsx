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

export const RevisionList: React.FC<{ model: StructureType<'model'>; goBack?: () => void }> = ({ model, goBack }) => {
  const revisions = useChoiceRevisions(model.id);
  const selectRevision = Revisions.useStoreActions(a => a.selectRevision);
  const createRevision = Revisions.useStoreActions(a => a.createRevision);

  // SECTIONS
  // ========
  // Canonical (source)
  // My revisions (authors)
  // - Revisions of canonical
  // - Additions
  // Other peoples revisions (admin only)

  // DATA
  // ======
  // Label - revision.label
  // Status - revision.status
  // Creator - revision.authors
  // Approved or not - revision.approved
  // Preview (refineable) - revision.document

  return (
    <BackgroundSplash header={model.label} description={model.description}>
      {revisions.map((rev, idx) => (
        <RoundedCard
          label={rev.revision.label || rev.revision.id}
          interactive
          key={idx}
          onClick={() => selectRevision({ revisionId: rev.revision.id, readMode: rev.revision.approved })}
        >
          {rev.revision.approved ? 'Approved' : 'Draft'}
        </RoundedCard>
      ))}
      <CardButtonGroup>
        {goBack ? <CardButton onClick={goBack}>Back to choices</CardButton> : null}
        <CardButton onClick={() => createRevision({ revisionId: model.id, cloneMode: 'FORK_TEMPLATE' })}>
          Create new
        </CardButton>
      </CardButtonGroup>
    </BackgroundSplash>
  );
};
