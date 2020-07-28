import { Field } from 'formik';
import React from 'react';
import { StyledCheckbox, StyledFormField, StyledFormInputElement, StyledFormLabel } from '../../atoms/StyledForm';

type Props = {
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  previewInline?: boolean;
};

const TextFieldEditor: React.FC<Props> = ({ children, ...props }) => {
  return (
    <>
      <StyledFormField>
        <StyledFormLabel>
          Placeholder
          <Field
            as={StyledFormInputElement}
            type="text"
            name="placeholder"
            value={props.placeholder}
            required={false}
          />
        </StyledFormLabel>
      </StyledFormField>
      <StyledFormField>
        <StyledFormLabel>
          <Field as={StyledCheckbox} type="checkbox" name="multiline" value={props.multiline} required={false} />
          Allow multiline input
        </StyledFormLabel>
      </StyledFormField>
      <StyledFormField>
        <StyledFormLabel>
          <Field
            as={StyledCheckbox}
            type="checkbox"
            name="previewInline"
            value={props.previewInline}
            required={false}
          />
          Preview text as inline (span)
        </StyledFormLabel>
      </StyledFormField>
    </>
  );
};

export default TextFieldEditor;
