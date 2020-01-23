import React, { useContext, useEffect, useState } from 'react';
import { Button, Form as StyledForm, Message } from 'semantic-ui-react';
import { PluginContext } from '../../core/plugins';
import { SelectorSpecification } from '../../types/selector-types';
import { ChooseSelectorButton } from '../ChooseSelectorButton/ChooseSelectorButton';

type Props = {
  existingTerms: string[];
  onSave: (t: { term: string; selectorType?: string; selector?: SelectorSpecification<any, any, any> }) => void;
};

export const NewDocumentForm: React.FC<Props> = ({ existingTerms, onSave }) => {
  const [term, setTerm] = useState('');
  const [error, setError] = useState('');
  const { selectors } = useContext(PluginContext);
  const [selectorType, setSelectorType] = useState<keyof typeof selectors | ''>('');

  const onSubmit = () => {
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
      </StyledForm.Field>
      <StyledForm.Field>
        <label>
          Choose selector (optional)
          <ChooseSelectorButton onChange={t => setSelectorType(t as any)} />
        </label>
      </StyledForm.Field>
      {error ? <Message negative>{error}</Message> : null}
      <Button disabled={error !== '' || term === ''} primary>
        Save
      </Button>
    </StyledForm>
  );
};
