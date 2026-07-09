import { createContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../services/api';

export const AuthContext = createContext(null);

const storedUser = localStorage.getItem('auth_user');
const storedToken = localStorage.getItem('auth_token');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [token, setToken] = useState(storedToken || null);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const value = useMemo(
    () => ({ user, setUser, token, setToken, isAuthenticated: Boolean(user && token) }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
