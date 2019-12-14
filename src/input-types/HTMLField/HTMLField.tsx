import React from 'react';
import { FieldComponent, FieldTypeProps } from '../../types/field-types';

export type HTMLFieldProps = {
  type: 'html-field';
  allowedTags?: string[];
  value: string;
};

export const HTMLField: FieldComponent<HTMLFieldProps> = ({ value, allowedTags, updateValue }) => {
  return <div>HTMLField</div>;
};
