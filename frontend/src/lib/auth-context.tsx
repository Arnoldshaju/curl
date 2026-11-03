'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';
import { api } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: { username: string; email?: string; password: string; password_confirm: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('curl_token') || localStorage.getItem('linkforge_token');
    if (savedToken) {
      setToken(savedToken);
      api.auth
        .getUser()
        .then((fetchedUser) => {
          setUser(fetchedUser);
        })
        .catch(() => {
          localStorage.removeItem('curl_token');
          localStorage.removeItem('linkforge_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.auth.login({ username, password });
    localStorage.setItem('curl_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (payload: { username: string; email?: string; password: string; password_confirm: string }) => {
    const res = await api.auth.register(payload);
    localStorage.setItem('curl_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('curl_token');
      localStorage.removeItem('linkforge_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
