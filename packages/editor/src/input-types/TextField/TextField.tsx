import { BaseField, FieldComponent } from '@capture-models/types';
import React from 'react';
import { StyledFormInputElement } from '../../atoms/StyledForm';

export interface TextFieldProps extends BaseField {
  id: string;
  type: 'text-field';
  placeholder?: string;
  required?: boolean;
  value: string;
}

export const TextField: FieldComponent<TextFieldProps> = ({
  value,
  id,
  placeholder,
  updateValue,
}) => {
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
