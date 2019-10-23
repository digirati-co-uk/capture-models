import * as React from 'react';
import './TextArea.styles.scss';

interface TextAreaProps {
  Text: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ Text = '' }) => (
  <textarea className="text-area">{Text}</textarea>
);
