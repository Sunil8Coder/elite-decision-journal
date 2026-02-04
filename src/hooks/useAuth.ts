import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '@/types/auth';

const USERS_KEY = 'decision-journal-users';
const SESSION_KEY = 'decision-journal-session';

interface StoredUser extends Omit<User, 'createdAt'> {
  password: string;
  createdAt: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      const user = JSON.parse(sessionData);
      setAuthState({
        user: { ...user, createdAt: new Date(user.createdAt) },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const getUsers = (): StoredUser[] => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'An account with this email already exists' };
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      password, // In real app, this would be hashed
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);

    const { password: _, ...userWithoutPassword } = newUser;
    const user: User = { ...userWithoutPassword, createdAt: new Date(newUser.createdAt) };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
    setAuthState({ user, isAuthenticated: true, isLoading: false });

    return {};
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { error: 'Invalid email or password' };
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
    
    setAuthState({
      user: { ...userWithoutPassword, createdAt: new Date(user.createdAt) },
      isAuthenticated: true,
      isLoading: false,
    });

    return {};
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
  };
}
