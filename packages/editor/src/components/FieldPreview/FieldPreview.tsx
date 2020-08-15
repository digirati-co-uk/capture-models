import { useFieldPreview, useSelectorStatus } from '@capture-models/plugin-api';
import { BaseField, BaseSelector } from '@capture-models/types';
import React, { ComponentClass, FunctionComponent } from 'react';

export const FieldPreview: React.FC<{
  field: BaseField;
  as?: FunctionComponent<any> | ComponentClass<any> | string;
}> = ({ field }) => {
  const preview = useFieldPreview(field);

  return React.createElement(React.Fragment, {}, preview);
};
