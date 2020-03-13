import { CardButton, CardButtonGroup } from '@capture-models/editor';
import { CaptureModel } from '@capture-models/types';
import React from 'react';
import { VerboseEntityPage } from '../VerboseEntityPage/VerboseEntityPage';
import { Message } from 'semantic-ui-react';

export const RevisionPreview: React.FC<{
  entity: { property: string; instance: CaptureModel['document'] };
  error?: string;
  onSave: () => void;
  onEdit: () => void;
  isSaving: boolean;
}> = ({ entity, onSave, onEdit, isSaving, error }) => {
  return (
    <VerboseEntityPage title="Summary of your submission" entity={entity} path={[]} readOnly={true}>
      {error ? (
        <Message negative>
          <Message.Header>{error}</Message.Header>
          <p>Something went wrong while saving your submission</p>
        </Message>
      ) : null}
      <CardButtonGroup>
        <CardButton onClick={onEdit}>Edit</CardButton>
        <CardButton disabled={isSaving} onClick={onSave}>
          {isSaving ? 'Saving...' : 'Submit changes'}
        </CardButton>
      </CardButtonGroup>
    </VerboseEntityPage>
  );
};
