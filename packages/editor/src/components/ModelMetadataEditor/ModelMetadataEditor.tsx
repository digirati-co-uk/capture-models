import { useFormik } from 'formik';
import React from 'react';
import { Button, Form as StyledForm } from 'semantic-ui-react';
import { CaptureModel } from '@capture-models/types';

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
        <StyledForm.Field>
          <label>
            Label
            <StyledForm.Input
              type="text"
              name="label"
              required={true}
              value={formik.values.label}
              onChange={formik.handleChange}
            />
          </label>
        </StyledForm.Field>

        <StyledForm.Field>
          <label>
            Description
            <StyledForm.Input
              type="text"
              name="description"
              required={true}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </label>
        </StyledForm.Field>
      </StyledForm>

      {formik.dirty ? (
        <Button type="submit" color="blue" size="small">
          Save
        </Button>
      ) : null}
    </form>
  );
};
