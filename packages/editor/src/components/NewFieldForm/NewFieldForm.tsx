import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../../atoms/Button';
import { PluginContext } from '@capture-models/plugin-api';
import { ChooseFieldButton } from '../ChooseFieldButton/ChooseFieldButton';
import { ChooseSelectorButton } from '../ChooseSelectorButton/ChooseSelectorButton';
import { FieldSpecification, SelectorSpecification } from '@capture-models/types';
import { ErrorMessage } from '../../atoms/Message';
import { StyledForm, StyledFormField, StyledFormInput, StyledFormLabel } from '../../atoms/StyledForm';

type Props = {
  existingTerms: string[];
  onSave: (t: {
    fieldType: string;
    selectorType?: string;
    term: string;
    field: FieldSpecification;
    selector?: SelectorSpecification;
  }) => void;
};

export const NewFieldForm: React.FC<Props> = ({ existingTerms, onSave }) => {
  const [term, setTerm] = useState('');
  const { fields, selectors } = useContext(PluginContext);
  const [fieldType, setFieldType] = useState<string>('');
  const [selectorType, setSelectorType] = useState<keyof typeof selectors | ''>('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    if (fieldType === '') return;
    const field = fields[fieldType];
    if (!field) return;
    const selector = selectorType ? selectors[selectorType] : undefined;
    onSave({
      term,
      fieldType,
      field: field,
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
        <StyledFormLabel>
          Choose field type
          <ChooseFieldButton onChange={t => setFieldType(t as any)} />
        </StyledFormLabel>
      </StyledFormField>
      <StyledFormField>
        <StyledFormLabel>
          Choose selector (optional)
          <ChooseSelectorButton onChange={t => setSelectorType(t as any)} />
        </StyledFormLabel>
      </StyledFormField>
      <StyledFormField>
        <StyledFormLabel>
          JSON Key / Term
          <StyledFormInput
            type="text"
            name="term"
            required={true}
            value={term}
            onChange={e => setTerm(e.currentTarget.value)}
          />
        </StyledFormLabel>
      </StyledFormField>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      <Button disabled={error !== '' || term === ''} primary>
        Save
      </Button>
    </StyledForm>
  );
};
