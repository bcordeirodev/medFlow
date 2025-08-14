'use client';

import { apiClient } from '@/lib/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{
        data: { access_token: string; user: User };
      }>('/auth/login', { email, password });
      const { access_token, user: userData } = response.data.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setUser(userData);
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiClient.post<{
        data: { access_token: string; user: User };
      }>('/auth/register', userData);
      const { access_token, user: newUser } = response.data.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(newUser));
      }

      setUser(newUser);
    } catch (error) {
      throw new Error('Erro ao registrar usuário');
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
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
