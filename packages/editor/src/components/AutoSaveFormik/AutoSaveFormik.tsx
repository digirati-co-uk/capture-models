import React from 'react';
import { useFormikContext } from 'formik';
import { useUnmount } from '../../hooks/useUnmount';

export const AutoSaveFormik: React.FC = () => {
  const { submitForm } = useFormikContext();

  useUnmount(() => {
    submitForm();
  }, [submitForm]);

  return null;
};
