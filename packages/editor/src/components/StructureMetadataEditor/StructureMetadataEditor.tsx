import { Field, FieldArray, useFormik } from 'formik';
import React from 'react';
import { Button, Dropdown, Form as StyledForm } from 'semantic-ui-react';
import { CaptureModel } from '@capture-models/types';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';

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
              as={'textarea'}
              name="description"
              required={true}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </label>
        </StyledForm.Field>

        {profiles.length ? (
          <div style={{ color: '#000' }}>
            <h4>Profiles</h4>
            {profiles.map((prof, idx) => {
              return (
                <div key={idx}>
                  {prof}{' '}
                  {(formik.values.profile || []).indexOf(prof) === -1 ? (
                    <button onClick={() => formik.setFieldValue('profile', [...(formik.values.profile || []), prof])}>
                      enable
                    </button>
                  ) : (
                    <button
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
          <StyledForm.Field>
            <label>
              Crowdsourcing Instructions
              <StyledForm.Input
                as={'textarea'}
                name="instructions"
                required={true}
                value={formik.values.instructions}
                onChange={formik.handleChange}
              />
            </label>
          </StyledForm.Field>
        ) : null}
      </StyledForm>
      {formik.dirty ? (
        <Button type="submit" color="blue" size="small">
          Save
        </Button>
      ) : null}
    </form>
  );
};
