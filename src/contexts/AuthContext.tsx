"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, logoutUser, registerUser } from '@/services/auth.service';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
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

  const login = async (email: string, password: string) => {
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
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setIsLoading(true);
      const response = await registerUser({ email, password, username });
      
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
  };

  const logout = async () => {
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
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
