import { BaseField, FieldComponent } from '@capture-models/types';
import React from 'react';
import { StyledFormInputElement, StyledFormMultilineInputElement } from '../../atoms/StyledForm';

export interface TextFieldProps extends BaseField {
  id: string;
  type: 'text-field';
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  value: string;
}

export const TextField: FieldComponent<TextFieldProps> = ({ value, id, placeholder, multiline, updateValue }) => {
  if (multiline) {
    return (
      <StyledFormMultilineInputElement
        name={id}
        id={id}
        placeholder={placeholder}
        value={value || ''}
        onChange={e => updateValue(e.currentTarget.value)}
      />
    );
  }

  return (
    <StyledFormInputElement
      name={id}
      id={id}
      placeholder={placeholder}
      value={value || ''}
      onChange={e => updateValue(e.currentTarget.value)}
    />
  );
};
