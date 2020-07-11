import React from 'react';

import { TaggedTextFieldProps } from './TaggedTextField';

export const TaggedTextFieldPreview: React.FC<TaggedTextFieldProps> = ({ value }) => {
  if (!value) {
    return <span style={{ color: '#999' }}>No value</span>;
  }

  return <div dangerouslySetInnerHTML={{ __html: value }} />;
};
