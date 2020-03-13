import {
  BackgroundSplash,
  CardButton,
  CardButtonGroup,
  REVISION_CLONE_MODE,
  RoundedCard,
} from '@capture-models/editor';
import { useRefinement } from '@capture-models/plugin-api';
import { RevisionListRefinement, RevisionRequest, StructureType } from '@capture-models/types';
import React from 'react';

export type RevisionListProps = {
  model: StructureType<'model'>;
  revisions: RevisionRequest[];
  goBack?: () => void;
  selectRevision: (options: { revisionId: string; readMode?: boolean }) => void;
  createRevision: (options: {
    revisionId: string;
    cloneMode: REVISION_CLONE_MODE;
    readMode?: boolean;
    modelMapping?: { [key: string]: string };
  }) => void;
};

export const RevisionList: React.FC<RevisionListProps> = ({
  model,
  goBack,
  revisions,
  selectRevision,
  createRevision,
}) => {
  const refinement = useRefinement<RevisionListRefinement>(
    'revision-list',
    { instance: model, property: '' },
    {
      revisions,
    }
  );

  if (refinement) {
    return refinement.refine(
      { instance: model, property: '' },
      {
        revisions,
        selectRevision,
        createRevision,
        goBack,
      }
    );
  }

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
      {revisions.length === 0 ? <RoundedCard>Nothing submitted yet</RoundedCard> : null}
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
