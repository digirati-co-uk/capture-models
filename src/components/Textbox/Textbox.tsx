import * as React from 'react';
import './Textbox.styles.scss';

export const Textbox: React.FC = ({ children }) => (
  <div className="textbox">{children}</div>
);
