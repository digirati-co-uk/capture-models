import React, { useState } from 'react';
import { Button, Form as StyledForm } from 'semantic-ui-react';
import { StructureType } from '../../types/capture-model';
import { createModel } from '../../utility/create-model';

type Props = {
  onSave: (choice: StructureType<'model'>) => void;
};

export const NewModelForm: React.FC<Props> = ({ onSave }) => {
  const [label, setLabel] = useState('');

  const onSubmit = () => {
    if (!label) return;
    onSave(
      createModel({
        label,
      })
    );
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
