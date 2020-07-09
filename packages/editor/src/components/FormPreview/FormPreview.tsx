import { BaseField } from '@capture-models/types';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { FieldWrapper } from '../FieldWrapper/FieldWrapper';

export const FormPreview: React.FC<{ term?: string; mapValues?: (props: any) => any }> = ({ term, mapValues }) => {
  const { values } = useFormikContext<BaseField>();
  const [value, setValue] = useState(values.value);

  // const [field] = useField(values, value, setValue);

  return (
    <FieldWrapper field={{ ...(mapValues && values ? mapValues(values) : values), value }} term={term} onUpdateValue={setValue} />
  );
};
