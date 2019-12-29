import React, { useContext, useEffect, useState } from 'react';
import { Button, Form as StyledForm, Message } from 'semantic-ui-react';
import { PluginContext } from '../../core/plugins';
import { FieldSpecification, FieldTypeMap, FieldTypes } from '../../types/field-types';
import { ChooseFieldButton } from '../ChooseFieldButton/ChooseFieldButton';

type Props = {
  existingTerms: string[];
  onSave: (t: { fieldType: string; term: string; field: FieldSpecification<any, any> }) => void;
};

export const NewFieldForm: React.FC<Props> = ({ existingTerms, onSave }) => {
  const [term, setTerm] = useState('');
  const { fields } = useContext(PluginContext);
  const [fieldType, setFieldType] = useState<keyof typeof fields | ''>('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    if (fieldType === '') return;
    const field = fields[fieldType];
    if (!field) return;
    onSave({
      term,
      fieldType,
      field,
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
