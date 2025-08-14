'use client';

import { useAuth } from '@/hooks/useAuth';
import { User } from '@/lib/types';
import { createContext, ReactNode, useContext } from 'react';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { user, isLoading, isAuthenticated, refetch } = useAuth();

  console.log('🧑‍💼 [UserProvider] Estado do contexto:', {
    hasUser: !!user,
    userId: user?.id,
    isLoading,
    isAuthenticated,
  });

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated,
    refetchUser: refetch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
