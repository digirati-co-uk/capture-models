import { CardButton, CardButtonGroup, Revisions } from '@capture-models/editor';
import { RevisionRequest } from '@capture-models/types';
import React, { useState } from 'react';
import { VerboseEntityPage } from '../VerboseEntityPage/VerboseEntityPage';
import { RevisionPreview } from '../RevisionPreview/RevisionPreview';
import { ThankYouPage } from '../ThankYouPage/ThankYouPage';

export const RevisionTopLevel: React.FC<{
  readOnly: boolean;
  instructions?: string;
  onSaveRevision: (req: RevisionRequest) => Promise<void>;
}> = ({ readOnly, instructions, onSaveRevision }) => {
  const current = Revisions.useStoreState(s => s.currentRevision);
  const deselectRevision = Revisions.useStoreActions(s => s.deselectRevision);
  const createRevision = Revisions.useStoreActions(a => a.createRevision);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isThankYou, setIsThankYou] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!current) return null;

  if (isThankYou) {
    return <ThankYouPage onContinue={() => deselectRevision({ revisionId: current.revision.id })} />;
  }

  if (isPreviewing) {
    return (
      <RevisionPreview
        isSaving={isSaving}
        entity={{ property: 'root', instance: current.document }}
        onEdit={() => setIsPreviewing(false)}
        onSave={() => {
          setIsSaving(true);
          onSaveRevision(current).then(() => {
            setIsSaving(false);
            setIsThankYou(true);
          });
        }}
      />
    );
  }

  return (
    <>
      <VerboseEntityPage
        title={current.revision.label}
        description={instructions}
        entity={{ property: 'root', instance: current.document }}
        path={[]}
        readOnly={readOnly}
      >
        <CardButtonGroup>
          <CardButton onClick={() => deselectRevision({ revisionId: current.revision.id })}>Go back</CardButton>
          {readOnly ? (
            <CardButton
              onClick={() => createRevision({ revisionId: current.revision.id, cloneMode: 'FORK_ALL_VALUES' })}
            >
              Suggest edit
            </CardButton>
          ) : (
            <CardButton onClick={() => setIsPreviewing(true)}>Publish</CardButton>
          )}
        </CardButtonGroup>
      </VerboseEntityPage>
    </>
  );
};
