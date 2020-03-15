import { CardButton, CardButtonGroup, RoundedCard } from '@capture-models/editor';
import { CaptureModel } from '@capture-models/types';
import React, { useEffect, useState } from 'react';
import { VerboseEntityPage } from '../VerboseEntityPage/VerboseEntityPage';
import { Form as StyledForm, Message } from 'semantic-ui-react';
import { useDebouncedCallback } from 'use-debounce';

export const RevisionPreview: React.FC<{
  descriptionOfChange: string;
  entity: { property: string; instance: CaptureModel['document'] };
  error?: string;
  onSave?: () => void;
  onPublish?: () => void;
  onEdit?: () => void;
  setDescriptionOfChange?: (change: string) => void;
  isSaving?: boolean;
}> = ({ entity, onSave, onPublish, onEdit, isSaving, error, descriptionOfChange, setDescriptionOfChange }) => {
  const [label, setLabel] = useState(descriptionOfChange);

  const [updateValue] = useDebouncedCallback(v => {
    if (setDescriptionOfChange) {
      setDescriptionOfChange(v);
    }
  }, 200);

  useEffect(() => {
    updateValue(label);
  }, [label, setDescriptionOfChange, updateValue]);

  return (
    <VerboseEntityPage title="Summary of your submission" entity={entity} path={[]} readOnly={true}>
      {error ? (
        <Message negative>
          <Message.Header>{error}</Message.Header>
          <p>Something went wrong while saving your submission</p>
        </Message>
      ) : null}
      {setDescriptionOfChange ? (
        <RoundedCard>
          <StyledForm>
            <label>
              Short description of your contribution.
              <StyledForm.Input
                as="textarea"
                name="label"
                required={true}
                value={label}
                onChange={e => setLabel(e.target.value)}
              />
            </label>
          </StyledForm>
        </RoundedCard>
      ) : null}
      {onEdit || onSave ? (
        <CardButtonGroup>
          {onEdit ? <CardButton onClick={onEdit}>Edit</CardButton> : null}
          {onSave ? (
            <CardButton disabled={isSaving} onClick={onSave}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </CardButton>
          ) : null}
        </CardButtonGroup>
      ) : null}
      {onPublish ? (
        <CardButton disabled={isSaving} size="large" onClick={onPublish}>
          {isSaving ? 'Saving...' : 'Submit for review'}
        </CardButton>
      ) : null}
    </VerboseEntityPage>
  );
};
