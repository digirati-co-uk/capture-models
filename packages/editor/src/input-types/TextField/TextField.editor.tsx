import { Field } from 'formik';
import React from 'react';
import { StyledFormField, StyledFormInputElement, StyledFormLabel } from '../../atoms/StyledForm';

type Props = {
  placeholder?: string;
  required?: boolean;
  icon?: string;
  iconPosition?: 'left';
};

const TextFieldEditor: React.FC<Props> = ({ children, ...props }) => {
  return (
    <>
      <StyledFormField>
        <StyledFormLabel>
          Placeholder
          <Field as={StyledFormInputElement} type="text" name="placeholder" value={props.placeholder} required={false} />
        </StyledFormLabel>
      </StyledFormField>
    </>
  );
};

export default TextFieldEditor;
