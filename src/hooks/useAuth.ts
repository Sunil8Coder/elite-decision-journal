import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '@/types/auth';
import { api } from '@/lib/api';

const TOKEN_KEY = 'decision-journal-token';
const USER_KEY = 'decision-journal-user';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem(TOKEN_KEY);
    const userData = localStorage.getItem(USER_KEY);
    
    if (token && userData) {
      const user = JSON.parse(userData);
      setAuthState({
        user: { ...user, createdAt: new Date(user.createdAt || Date.now()) },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    const { data, error } = await api.register(name, email, password);

    if (error || !data) {
      return { error: error || 'Registration failed' };
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      createdAt: new Date(),
    };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    setAuthState({ user, isAuthenticated: true, isLoading: false });
    return {};
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    const { data, error } = await api.login(email, password);

    if (error || !data) {
      return { error: error || 'Login failed' };
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      createdAt: new Date(),
    };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    setAuthState({ user, isAuthenticated: true, isLoading: false });
    return {};
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
  };
}
