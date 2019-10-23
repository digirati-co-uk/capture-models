import * as React from 'react';
import './Label.styles.scss';

interface LabelProps {
  Text: string;
}

export const Label: React.FC<LabelProps> = ({ Text, children }) => (
  <label className="label">
    {Text}: {children}
  </label>
);
