import { useFormik } from 'formik';
import React from 'react';
import { Button } from '../../atoms/Button';
import { CaptureModel } from '@capture-models/types';
import { StyledForm, StyledFormField, StyledFormInput } from '../../atoms/StyledForm';

type Props = {
  structure: CaptureModel['structure'];
  onSave: (structure: CaptureModel['structure']) => void;
};

export const ModelMetadataEditor: React.FC<Props> = ({ structure, onSave }) => {
  const formik = useFormik({
    initialValues: structure,
    onSubmit: values => {
      onSave(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <StyledForm>
        <StyledFormField>
          <label>
            Label
            <StyledFormInput
              type="text"
              name="label"
              required={true}
              value={formik.values.label}
              onChange={formik.handleChange}
            />
          </label>
        </StyledFormField>

        <StyledFormField>
          <label>
            Description
            <StyledFormInput
              type="text"
              name="description"
              required={true}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </label>
        </StyledFormField>
      </StyledForm>

      {formik.dirty ? (
        <Button type="submit" primary size="small">
          Save
        </Button>
      ) : null}
    </form>
  );
};
