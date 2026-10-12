import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, clearAuthToken, getAuthToken, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      if (!getAuthToken()) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.currentUser();
        if (isMounted) setUser(response?.data?.user || null);
      } catch {
        clearAuthToken();
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const authenticate = async (request) => {
    const response = await request;
    const { token, user: authenticatedUser } = response?.data || {};

    if (!token || !authenticatedUser) {
      throw new Error('The backend returned an incomplete authentication response.');
    }

    setAuthToken(token);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const login = (credentials) => authenticate(authApi.login(credentials));
  const register = (userData) => authenticate(authApi.register(userData));

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}