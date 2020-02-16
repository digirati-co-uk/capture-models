import { BaseField, FieldComponent } from '@capture-models/types';
import React from 'react';
import { Input } from 'semantic-ui-react';

export interface TextFieldProps extends BaseField {
  id: string;
  type: 'text-field';
  placeholder?: string;
  required?: boolean;
  value: string;
  icon?: string;
  iconPosition?: 'left';
}

export const TextField: FieldComponent<TextFieldProps> = ({
  value,
  id,
  icon,
  placeholder,
  iconPosition,
  updateValue,
}) => {
  return (
    <Input
      name={id}
      id={id}
      icon={icon}
      iconPosition={iconPosition}
      fluid={true}
      placeholder={placeholder}
      value={value || ''}
      onChange={e => updateValue(e.currentTarget.value)}
    />
  );
};
