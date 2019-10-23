import * as React from 'react';
import './Selector.styles.scss';

interface SelectorProps {
  Text: string;
}

export const Selector: React.FC<SelectorProps> = ({ Text = '' }) => (
  <div className="Selector">{Text}</div>
);
