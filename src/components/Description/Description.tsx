import * as React from 'react';
import './Description.styles.scss';

interface DescriptionProps {
  Text: string;
}

export const Description: React.FC<DescriptionProps> = ({ Text = '' }) => (
  <div className="description">{Text}</div>
);
