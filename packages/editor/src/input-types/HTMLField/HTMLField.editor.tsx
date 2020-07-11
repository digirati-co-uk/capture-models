import { Field } from 'formik';
import React from 'react';
import { StyledCheckbox, StyledFormField, StyledFormLabel } from '../..';

type Props = {
  allowedTags?: string[];
  enableHistory?: boolean;
  enableExternalImages?: boolean;
  enableLinks?: boolean;
  enableStylesDropdown?: boolean;
};

const HTMLFieldEditor: React.FC<Props> = props => {
  return (
    <>
      <StyledFormField>
        <StyledFormLabel>
          <Field
            as={StyledCheckbox}
            type="checkbox"
            name="enableHistory"
            value={props.enableHistory}
            required={false}
          />
          Enable history (undo/redo)
        </StyledFormLabel>
      </StyledFormField>
      <StyledFormField>
        <StyledFormLabel>
          <Field
            as={StyledCheckbox}
            type="checkbox"
            name="enableExternalImages"
            value={props.enableExternalImages}
            required={false}
          />
          Allow external images
        </StyledFormLabel>
      </StyledFormField>
      <StyledFormField>
        <StyledFormLabel>
          <Field as={StyledCheckbox} type="checkbox" name="enableLinks" value={props.enableLinks} required={false} />
          Enable links
        </StyledFormLabel>
      </StyledFormField>
      <StyledFormField>
        <StyledFormLabel>
          <Field
            as={StyledCheckbox}
            type="checkbox"
            name="enableStylesDropdown"
            value={props.enableStylesDropdown}
            required={false}
          />
          Enable preset styles dropdown
        </StyledFormLabel>
      </StyledFormField>
    </>
  );
};

export default HTMLFieldEditor;
