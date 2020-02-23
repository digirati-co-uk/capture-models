import React, { useState } from 'react';
import { Button, Form as StyledForm } from 'semantic-ui-react';
import { createChoice } from '../../utility/create-choice';
import { StructureType } from '@capture-models/types';

type Props = {
  onSave: (choice: StructureType<'choice'>) => void;
};

export const NewChoiceForm: React.FC<Props> = ({ onSave }) => {
  const [label, setLabel] = useState('');
  const onSubmit = () => {
    if (!label) return;
    onSave(createChoice({ label }));
  };

  return (
    <StyledForm onSubmit={onSubmit} autoComplete="off">
      <StyledForm.Field>
        <label>
          Label
          <StyledForm.Input
            type="text"
            name="term"
            required={true}
            value={label}
            autoFocus
            onChange={e => setLabel(e.currentTarget.value)}
          />
        </label>
        <Button disabled={label === ''} primary>
          Save
        </Button>
      </StyledForm.Field>
    </StyledForm>
  );
};