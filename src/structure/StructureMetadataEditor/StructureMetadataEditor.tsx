import {
  Button,
  Card,
  FormGroup,
  InputGroup,
  TextArea,
} from '@blueprintjs/core';
import { Elevation } from '@blueprintjs/core/lib/esm/common/elevation';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { CaptureModel } from '../../types/capture-model';

type Props = {
  structure: CaptureModel['structure'];
  onSave: (structure: CaptureModel['structure']) => void;
};

export const StructureMetadataEditor: React.FC<Props> = ({
  structure,
  onSave,
}) => {
  const formik = useFormik({
    initialValues: structure,
    onSubmit: values => {
      onSave(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormGroup label="Label" labelFor="label" labelInfo="(required)">
        <InputGroup
          id="label"
          placeholder="Placeholder text"
          onChange={formik.handleChange}
          value={formik.values.label}
        />
      </FormGroup>
      <FormGroup label="Description" labelFor="description">
        <TextArea
          id="description"
          growVertically={true}
          fill={true}
          placeholder="Enter a description of the model"
          onChange={formik.handleChange}
          value={formik.values.description}
        />
      </FormGroup>
      {formik.dirty ? (
        <Button type="submit" icon="tick" intent="success" text="Save" />
      ) : null}
    </form>
  );
};
