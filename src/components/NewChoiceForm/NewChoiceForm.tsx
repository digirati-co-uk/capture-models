import React, { useState } from 'react';
import { Button, Form as StyledForm } from 'semantic-ui-react';
import { StructureType } from '../../types/capture-model';

type Props = {
  onSave: (choice: StructureType<'choice'>) => void;
};

export const NewChoiceForm: React.FC<Props> = ({ onSave }) => {
  const [label, setLabel] = useState('');

  const onSubmit = () => {
    if (!label) return;
    onSave({
      label,
      type: 'choice',
      items: [],
    });
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
