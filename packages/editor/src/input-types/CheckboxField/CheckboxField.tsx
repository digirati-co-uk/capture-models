import { BaseField, FieldComponent } from '@capture-models/types';
import React from 'react';
import { StyledCheckbox, StyledFormLabel } from '../../atoms/StyledForm';

export interface CheckboxFieldProps extends BaseField {
  type: 'checkbox-field';
  value: boolean;
  inlineLabel?: string;
}

export const CheckboxField: FieldComponent<CheckboxFieldProps> = props => {
  if (props.inlineLabel) {
    return (
      <StyledFormLabel>
        <StyledCheckbox
          name={props.id}
          id={props.id}
          checked={props.value}
          onChange={v => {
            props.updateValue(v.target.checked);
          }}
        />
        {props.inlineLabel}
      </StyledFormLabel>
    );
  }

  return (
    <StyledCheckbox
      name={props.id}
      id={props.id}
      checked={props.value}
      onChange={v => {
        props.updateValue(v.target.checked);
      }}
    />
  );
};
