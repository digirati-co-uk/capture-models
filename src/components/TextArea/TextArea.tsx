import * as React from 'react';
import './TextArea.styles.scss';

interface TextAreaProps {
  Text: string;
  OnChange: Function;
}

export const TextArea: React.FC<TextAreaProps> = ({ Text = '', OnChange }) => (
  <textarea
    className="text-area"
    value={Text}
    onChange={e => OnChange(e.target.value)}
  />
);
