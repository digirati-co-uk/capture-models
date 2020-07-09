import { Field } from 'formik';
import React from 'react';
import {
  StyledFormField,
  StyledFormLabel,
  StyledFormInputElement,
  StyledCheckbox, StyledFormInput,
} from '../../atoms/StyledForm';

type Props = {
  dataSource: string;
  placeholder?: string;
  clearable: boolean;
};

const AutocompleteFieldEditor: React.FC<Props> = props => {
  return (
    <>
      <StyledFormField>
        <StyledFormLabel>
          Data source
          <Field
            as={StyledFormInput}
            type="text"
            name="dataSource"
            value={props.dataSource}
            required={true}
          />
        </StyledFormLabel>
      </StyledFormField>
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
          <Field as={StyledCheckbox} type="checkbox" name="clearable" value={props.clearable} required={false} />
          Allow clearing of selection
        </StyledFormLabel>
      </StyledFormField>
    </>
  );
};

export default AutocompleteFieldEditor;
