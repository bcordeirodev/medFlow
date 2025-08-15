"use client";

import { apiClient } from "@/lib/api";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isTransitioning: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsTransitioning(true);

    try {
      const response = await apiClient.post<{
        data: { access_token: string; user: User };
      }>("/auth/login", { email, password });
      const { access_token, user: userData } = response.data.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Simular um delay para mostrar a transição suave
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUser(userData);

      // Delay adicional para permitir a transição antes de remover o loading
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    } catch (error) {
      setIsTransitioning(false);
      throw new Error("Credenciais inválidas");
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiClient.post<{
        data: { access_token: string; user: User };
      }>("/auth/register", userData);
      const { access_token, user: newUser } = response.data.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(newUser));
      }

      setUser(newUser);
    } catch (error) {
      throw new Error("Erro ao registrar usuário");
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isTransitioning, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
