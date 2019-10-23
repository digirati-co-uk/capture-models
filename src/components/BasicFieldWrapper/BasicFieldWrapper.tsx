import * as React from 'react';
import './BasicFieldWrapper.styles.scss';

export const BasicFieldWrapper: React.FC = ({ children }) => (
  <div className="basic-field-wrapper">{children}</div>
);
