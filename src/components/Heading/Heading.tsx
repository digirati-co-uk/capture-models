import * as React from 'react';
import './Heading.styles.scss';

export const Heading: React.FC<{ size: 'large' | 'medium' | 'small' }> = ({size, children}) => (
  <header className={`heading heading--${size}`}>
    {children}
  </header>
);
