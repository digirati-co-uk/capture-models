import React from 'react';
import { TextFieldProps } from './TextField';

export const TextFieldPreview: React.FC<TextFieldProps> = ({ value }) => {
  if (!value) {
    return <span style={{ color: '#999' }}>No value</span>;
  }

  return <>{value}</>;
};
