import React from 'react';
import { BaseField, FieldComponent } from '@capture-models/types';

export interface HTMLFieldProps extends BaseField {
  type: 'html-field';
  allowedTags?: string[];
  value: string;
}

export const HTMLField: FieldComponent<HTMLFieldProps> = ({ value, allowedTags, updateValue }) => {
  return <div>HTMLField</div>;
};
