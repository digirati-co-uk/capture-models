import styled, { css } from 'styled-components';
import React, { useState } from 'react';
import Textarea from 'react-textarea-autosize';

export const StyledForm = styled.form`
  margin-bottom: 1em;
`;

export const StyledFormLabel = styled.label`
  font-weight: bold;
  font-size: 1em;
  line-height: 1.6em;
  display: block;
  > * {
    font-weight: normal;
  }
`;
export const StyledFormField = styled.div`
  display: block;
  margin-bottom: 1em;
`;

export const inputCss = css`
  display: block;
  width: 100%;
  margin: 0;
  outline: 0;
  font-family: inherit;
  -webkit-appearance: none;
  border-radius: 3px;
  tap-highlight-color: rgba(255, 255, 255, 0);
  line-height: 1.2em;
  padding: 0.7em 0.9em;
  font-size: 1em;
  background: #fff;
  border: 1px solid rgba(5, 42, 68, 0.2);
  color: rgba(0, 0, 0, 0.87);
  box-shadow: 0 0 0 0 transparent inset;
  &:focus {
    border-color: #005cc5;
  }
`;

export const StyledCheckbox = styled.input.attrs(() => ({
  type: 'checkbox',
}))`
  margin: 1em;
`;

export const StyledFormInputElement = styled.input`
  ${inputCss}
`;

export const StyledFormMultilineInputElement = styled(Textarea)`
  ${inputCss}
`;

export const StyledFormInput: React.FC<React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { multiline?: boolean }> = ({ multiline, ...props }) => {
  const [value, setValue] = useState<string>(props.value as string);

  if (multiline) {
    return (
      <StyledFormMultilineInputElement
        {...(props as any)}
        value={value}
        onChange={e => {
          setValue(e.currentTarget.value);
          if (props.onChange) {
            props.onChange(e as any);
          }
        }}
      />
    );
  }

  return (
    <StyledFormInputElement
      {...(props as any)}
      value={value}
      onChange={e => {
        setValue(e.currentTarget.value);
        if (props.onChange) {
          props.onChange(e);
        }
      }}
    />
  );
};

export const StyledFormTextarea = styled.textarea`
  ${inputCss}
`;
