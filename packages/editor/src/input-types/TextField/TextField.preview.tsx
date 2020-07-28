import React from 'react';
import { TextFieldProps } from './TextField';

export const TextFieldPreview: React.FC<TextFieldProps> = ({ value, previewInline }) => {
  if (!value) {
    if (previewInline) {
      return <span style={{ color: '#999', marginRight: '.5em' }}>No value</span>;
    }
    return <div style={{ color: '#999' }}>No value</div>;
  }

  if (previewInline) {
    return <span style={{ marginRight: '.5em' }}>{value}</span>;
  }

  return <div>{value}</div>;
};
