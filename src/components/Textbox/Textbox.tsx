import * as React from 'react';
import './Textbox.styles.scss';

interface TextboxProps {
  Text: string;
}

export const Textbox: React.FC<TextboxProps> = ({ Text }) => (
  <div className="textbox">{Text}</div>
);
