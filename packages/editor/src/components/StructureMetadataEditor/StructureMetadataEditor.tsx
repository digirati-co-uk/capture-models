import { useFormik } from 'formik';
import React from 'react';
import { Button } from '../../atoms/Button';
import { CaptureModel } from '@capture-models/types';
import {
  StyledForm,
  StyledFormField,
  StyledFormInputElement,
  StyledFormLabel,
  StyledFormTextarea,
} from '../../atoms/StyledForm';

type Props = {
  profiles?: string[];
  structure: CaptureModel['structure'];
  onSave: (structure: CaptureModel['structure']) => void;
};

export const StructureMetadataEditor: React.FC<Props> = ({ profiles = [], structure, onSave }) => {
  const formik = useFormik({
    initialValues: structure,
    onSubmit: values => {
      onSave(values);
    },
  });

  return (
    <StyledForm onSubmit={formik.handleSubmit}>
      <StyledFormField>
        <StyledFormLabel>
          Label
          <StyledFormInputElement
            type="text"
            name="label"
            id="label"
            required={true}
            value={formik.values.label}
            onChange={formik.handleChange}
          />
        </StyledFormLabel>
      </StyledFormField>

      <StyledFormField>
        <StyledFormLabel>
          Description
          <StyledFormTextarea
            name="description"
            id="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
        </StyledFormLabel>
      </StyledFormField>

      {profiles.length ? (
        <div style={{ color: '#000' }}>
          <h4>Profiles</h4>
          {profiles.map((prof, idx) => {
            return (
              <div key={idx}>
                {prof}{' '}
                {(formik.values.profile || []).indexOf(prof) === -1 ? (
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue('profile', [...(formik.values.profile || []), prof])}
                  >
                    enable
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      formik.setFieldValue(
                        'profile',
                        (formik.values.profile || []).filter(v => v !== prof)
                      )
                    }
                  >
                    disable
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      {formik.values.type === 'model' ? (
        <StyledFormField>
          <StyledFormLabel>
            Crowdsourcing Instructions
            <StyledFormTextarea name="instructions" value={formik.values.instructions} onChange={formik.handleChange} />
          </StyledFormLabel>
        </StyledFormField>
      ) : null}
      {formik.dirty ? (
        <Button type="submit" color="blue" size="small">
          Save
        </Button>
      ) : null}
    </StyledForm>
  );
};
