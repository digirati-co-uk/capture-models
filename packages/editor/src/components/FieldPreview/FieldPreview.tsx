import { useFieldPreview } from '@capture-models/plugin-api';
import { BaseField } from '@capture-models/types';
import React, { ComponentClass, FunctionComponent } from 'react';

export const FieldPreview: React.FC<{
  field: BaseField;
  as?: FunctionComponent<any> | ComponentClass<any> | string;
}> = ({ field, as = 'h4' }) => {
  const preview = useFieldPreview(field);

  return React.createElement(as, {}, [preview]);
};
