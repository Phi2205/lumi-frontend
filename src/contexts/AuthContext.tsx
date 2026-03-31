"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, logoutUser, registerUser } from '@/services/auth.service';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { User } from '@/types/user.type';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setItem, getItem, removeItem } = useLocalStorage();

  // Check for user in localStorage on mount
  useEffect(() => {
    const storedUser = getItem('user') as User | null;
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await loginUser({ email, password });

      if (response.success && response.user) {
        setUser(response.user);
        setItem('user', response.user);

        // Redirect to home page
        router.push('/');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router, setItem]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const response = await registerUser({ email, password, name });

      if (response.success && response.user) {
        setUser(response.user);
        setItem('user', response.user);

        // Redirect to home page (auto login after registration)
        router.push('/');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router, setItem]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      removeItem('user');

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local state
      setUser(null);
      removeItem('user');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router, removeItem]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    setItem('user', updatedUser);
  }, [setItem]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }), [user, isLoading, login, register, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
