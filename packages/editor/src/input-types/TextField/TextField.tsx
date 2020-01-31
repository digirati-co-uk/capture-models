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

export const TextField: FieldComponent<TextFieldProps> = props => {
  return (
    <Input
      name={props.id}
      id={props.id}
      icon={props.icon}
      iconPosition={props.iconPosition}
      fluid={true}
      placeholder={props.placeholder}
      value={props.value}
      onChange={e => props.updateValue(e.currentTarget.value)}
    />
  );
};
