import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../../atoms/Button';
import { PluginContext } from '@capture-models/plugin-api';
import { ChooseSelectorButton } from '../ChooseSelectorButton/ChooseSelectorButton';
import { SelectorSpecification } from '@capture-models/types';
import { ErrorMessage } from '../../atoms/Message';
import { StyledForm, StyledFormField, StyledFormInput } from '../../atoms/StyledForm';

type Props = {
  existingTerms: string[];
  onSave: (t: { term: string; selectorType?: string; selector?: SelectorSpecification }) => void;
};

export const NewDocumentForm: React.FC<Props> = ({ existingTerms, onSave }) => {
  const [term, setTerm] = useState('');
  const [error, setError] = useState('');
  const { selectors } = useContext(PluginContext);
  const [selectorType, setSelectorType] = useState<keyof typeof selectors | ''>('');

  const onSubmit = (e: any) => {
    e.preventDefault();
    const selector = selectorType ? selectors[selectorType] : undefined;
    onSave({
      term,
      selectorType,
      selector,
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
      <StyledFormField>
        <label>
          JSON Key / Term
          <StyledFormInput
            type="text"
            name="term"
            required={true}
            value={term}
            onChange={e => setTerm(e.currentTarget.value)}
          />
        </label>
      </StyledFormField>
      <StyledFormField>
        <label>
          Choose selector (optional)
          <ChooseSelectorButton onChange={t => setSelectorType(t as any)} />
        </label>
      </StyledFormField>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      <Button disabled={error !== '' || term === ''} primary>
        Save
      </Button>
    </StyledForm>
  );
};
