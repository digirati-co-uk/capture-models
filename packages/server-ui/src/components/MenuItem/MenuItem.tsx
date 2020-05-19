import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const MenuItem: React.FC<{ href: string }> = ({ href, children }) => {
  const location = useLocation();

  return (
    <Link to={href}>
      <div style={{ fontWeight: location.pathname === href ? 'bold' : 'normal' }}>{children}</div>
    </Link>
  );
};
