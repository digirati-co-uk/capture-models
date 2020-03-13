import { createContext } from '@capture-models/helpers';
import React, { useEffect, useState } from 'react';
import { getJWTMock, MockJwt } from './get-jwt-mock';

const [useCurrentUser, InternalUserProvider] = createContext<MockJwt>();

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<MockJwt>();

  useEffect(() => {
    getJWTMock().then(data => setUser(data));
  }, []);

  if (!user) {
    return null;
  }

  return <InternalUserProvider value={user}>{children}</InternalUserProvider>;
};

export { useCurrentUser, UserProvider };
