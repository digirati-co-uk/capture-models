import * as React from 'react';
import './TextArea.styles.scss';

interface TextAreaProps {
  Text: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ Text = '' }) => (
  <div className="TextArea">{Text}</div>
);
