export type AppRole = 'admin' | 'moderator' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  roles?: AppRole[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
