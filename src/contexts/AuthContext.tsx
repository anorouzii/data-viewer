'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, LoginCredentials } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = apiClient.getToken();
      if (token) {
        const isValid = await apiClient.verifyToken();
        setIsAuthenticated(isValid);
        if (!isValid) {
          apiClient.clearToken();
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    await apiClient.login(credentials);
    setIsAuthenticated(true);
  };

  const logout = () => {
    apiClient.clearToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

