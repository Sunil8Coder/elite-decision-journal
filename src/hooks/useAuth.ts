import { useState, useEffect, useCallback } from 'react';
import { User, AuthState, AppRole } from '@/types/auth';
import { api } from '@/lib/api';

const TOKEN_KEY = 'decision-journal-token';
const USER_KEY = 'decision-journal-user';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const fetchUserRoles = useCallback(async (userId: string): Promise<AppRole[]> => {
    const { data } = await api.getUserRoles(userId);
    if (data?.roles) {
      return data.roles as AppRole[];
    }
    return [];
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const userData = localStorage.getItem(USER_KEY);
      
      if (token && userData) {
        const user = JSON.parse(userData);
        // Fetch roles from API
        const roles = await fetchUserRoles(user.id);
        setAuthState({
          user: { 
            ...user, 
            createdAt: new Date(user.createdAt || Date.now()),
            roles 
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    initAuth();
  }, [fetchUserRoles]);

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
      roles: [],
    };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Fetch roles after registration
    const roles = await fetchUserRoles(user.id);
    user.roles = roles;
    
    setAuthState({ user, isAuthenticated: true, isLoading: false });
    return {};
  }, [fetchUserRoles]);

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
      roles: [],
    };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Fetch roles after login
    const roles = await fetchUserRoles(user.id);
    user.roles = roles;
    
    setAuthState({ user, isAuthenticated: true, isLoading: false });
    return {};
  }, [fetchUserRoles]);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const hasRole = useCallback((role: AppRole): boolean => {
    return authState.user?.roles?.includes(role) ?? false;
  }, [authState.user]);

  const isAdmin = useCallback((): boolean => {
    return hasRole('admin');
  }, [hasRole]);

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    hasRole,
    isAdmin,
  };
}
