import React from 'react';

import { HTMLFieldProps } from './HTMLField';

export const HTMLFieldPreview: React.FC<HTMLFieldProps> = ({ value }) => {
  if (!value) {
    return <span style={{ color: '#999' }}>No value</span>;
  }

  return <div dangerouslySetInnerHTML={{ __html: value }} />;
};
