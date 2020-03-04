import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

export const MenuItem: React.FC<{ href: string }> = ({ href, children }) => {
  const location = useLocation();

  return (
    <Link to={href}>
      <Menu.Item name="home" active={location.pathname === href}>
        {children}
      </Menu.Item>
    </Link>
  );
};
