import { CardButton, CardButtonGroup } from '@capture-models/editor';
import { CaptureModel } from '@capture-models/types';
import React from 'react';
import { VerboseEntityPage } from '../VerboseEntityPage/VerboseEntityPage';

export const RevisionPreview: React.FC<{
  entity: { property: string; instance: CaptureModel['document'] };
  onSave: () => void;
  onEdit: () => void;
  isSaving: boolean;
}> = ({ entity, onSave, onEdit, isSaving }) => {
  return (
    <VerboseEntityPage title="Summary of your submission" entity={entity} path={[]} readOnly={true}>
      <CardButtonGroup>
        <CardButton onClick={onEdit}>Edit</CardButton>
        <CardButton disabled={isSaving} onClick={onSave}>
          {isSaving ? 'Saving...' : 'Submit changes'}
        </CardButton>
      </CardButtonGroup>
    </VerboseEntityPage>
  );
};
