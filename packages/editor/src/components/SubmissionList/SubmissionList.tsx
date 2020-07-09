import React, { useMemo, useState } from 'react';
import { RevisionRequest } from '@capture-models/types';
import { RoundedCard } from '../RoundedCard/RoundedCard';

export const SubmissionList: React.FC<{
  submissions: RevisionRequest[];
  renderRevisions: (revisions: RevisionRequest[]) => React.ReactNode;
}> = ({ submissions, renderRevisions }) => {
  const myUnpublished = useMemo(() => submissions.filter(rev => rev.revision.status === 'draft'), [submissions]);
  const mySubmitted = useMemo(() => submissions.filter(rev => rev.revision.status === 'submitted'), [submissions]);
  const [showPending, setShowPending] = useState(false);

  if (submissions.length === 0 || (mySubmitted.length === 0 && myUnpublished.length === 0)) {
    return null;
  }

  return (
    <RoundedCard size="small">
      <h4>Your submissions</h4>
      {myUnpublished.length > 0 ? (
        <p>These are the submissions that you have created but not yet submitted for review or others to see.</p>
      ) : null}
      {renderRevisions(myUnpublished)}
      {mySubmitted.length && !showPending ? (
        <p style={{ textAlign: 'center' }}>
          <a href="#" onClick={() => setShowPending(true)}>
            You have {mySubmitted.length} pending submission{mySubmitted.length > 1 && 's'}
          </a>
        </p>
      ) : null}
      {showPending ? (
        <>
          <a style={{ float: 'right' }} href="#" onClick={() => setShowPending(false)}>
            close
          </a>
          <h4>Awaiting review</h4>
          {renderRevisions(mySubmitted)}
        </>
      ) : null}
    </RoundedCard>
  );
};
