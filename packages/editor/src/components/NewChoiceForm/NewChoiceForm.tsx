import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { createChoice } from '@capture-models/helpers';
import { StructureType } from '@capture-models/types';
import { StyledForm, StyledFormField, StyledFormInput } from '../../atoms/StyledForm';

type Props = {
  onSave: (choice: StructureType<'choice'>) => void;
};

export const NewChoiceForm: React.FC<Props> = ({ onSave }) => {
  const [label, setLabel] = useState('');
  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!label) return;
    onSave(createChoice({ label }));
  };

  return (
    <StyledForm onSubmit={onSubmit} autoComplete="off">
      <StyledFormField>
        <label>
          Label
          <StyledFormInput
            type="text"
            name="term"
            required={true}
            value={label}
            autoFocus
            onChange={e => setLabel(e.currentTarget.value)}
          />
        </label>
      </StyledFormField>
      <Button disabled={label === ''} primary>
        Save
      </Button>
    </StyledForm>
  );
};
