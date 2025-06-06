export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  zivos: number;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, username: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (email: string, password: string, token: string) => Promise<string>;
};

// Default export for the types module
const AuthTypes = {
  // This is just a placeholder to satisfy the default export requirement
  // The actual types are exported above
  version: '1.0.0'
};

export default AuthTypes; 