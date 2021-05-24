import { BaseField, FieldComponent } from '@capture-models/types';
import React from 'react';
import styled, { css } from 'styled-components/macro';
import { StyledCheckbox, StyledFormLabel } from '../../atoms/StyledForm';

export interface CheckboxListFieldProps extends BaseField {
  type: 'checkbox-list-field';
  options: Array<{ label: string; value: string }>;
  value: { [key: string]: boolean };
  previewList?: boolean;
}

const CheckboxContainer = styled.div<{ inline?: boolean }>`
  background: rgba(5, 42, 68, 0.05);
  border: 1px solid rgba(5, 42, 68, 0.1);
  border-radius: 3px;
  ${props =>
    props.inline &&
    css`
      display: inline-block;
    `}
`;

export const CheckboxFieldList: FieldComponent<CheckboxListFieldProps> = props => {
  return (
    <CheckboxContainer>
      {props.options.map(option => {
        return (
          <StyledFormLabel key={option.value}>
            <StyledCheckbox
              name={props.id}
              value={option.value}
              id={props.id}
              checked={props.value[option.value]}
              onChange={v => {
                props.updateValue({
                  ...(props.value || {}),
                  [option.value]: v.target.checked,
                });
              }}
            />
            {option.label}
          </StyledFormLabel>
        );
      })}
    </CheckboxContainer>
  );
};