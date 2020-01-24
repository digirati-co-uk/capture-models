import React from 'react';
import { Input } from 'semantic-ui-react';
import { FieldComponent } from '../../types/field-types';

export type TextFieldProps = {
  id: string;
  type: 'text-field';
  placeholder?: string;
  required?: boolean;
  value: string;
  icon?: string;
  iconPosition?: 'left';
};

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
