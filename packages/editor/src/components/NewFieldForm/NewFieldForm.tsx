import React, { useContext, useEffect, useState } from 'react';
import { Button, Form as StyledForm, Message } from 'semantic-ui-react';
import { PluginContext } from '../../core/plugins';
import { ChooseFieldButton } from '../ChooseFieldButton/ChooseFieldButton';
import { ChooseSelectorButton } from '../ChooseSelectorButton/ChooseSelectorButton';
import { FieldSpecification, FieldTypeMap, FieldTypes, SelectorSpecification } from '@capture-models/types';

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
    <StyledForm onSubmit={onSubmit} autocomplete="off">
      <StyledForm.Field>
        <label>
          Choose field type
          <ChooseFieldButton onChange={t => setFieldType(t as any)} />
        </label>
      </StyledForm.Field>
      <StyledForm.Field>
        <label>
          Choose selector (optional)
          <ChooseSelectorButton onChange={t => setSelectorType(t as any)} />
        </label>
      </StyledForm.Field>
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
