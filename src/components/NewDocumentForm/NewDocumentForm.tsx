import React, { useEffect, useState } from 'react';
import { Button, Form as StyledForm, Message } from 'semantic-ui-react';

type Props = {
  existingTerms: string[];
  onSave: (t: { term: string }) => void;
};

export const NewDocumentForm: React.FC<Props> = ({ existingTerms, onSave }) => {
  const [term, setTerm] = useState('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    onSave({
      term,
    });
  };

  useEffect(() => {
    if (existingTerms.indexOf(term) !== -1) {
      setError(`The key "${term}" already exists in this item`);
    } else {
      setError('');
    }
  }, [existingTerms, term]);

  return (
    <StyledForm onSubmit={onSubmit} autoComplete="off">
      <StyledForm.Field>
        <label>
          JSON Key / Term
          <StyledForm.Input
            type="text"
            name="term"
            required={true}
            value={term}
            onChange={e => setTerm(e.currentTarget.value)}
          />
        </label>
        {error ? <Message negative>{error}</Message> : null}
        <Button disabled={error !== '' || term === ''} primary>
          Save
        </Button>
      </StyledForm.Field>
    </StyledForm>
  );
};
