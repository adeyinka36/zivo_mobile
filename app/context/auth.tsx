import { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { User, AuthContextType } from '@/types/auth';
import { BASE_URL } from '@/utils/getUrls';
import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

console.log('Axios instance created with baseURL:', BASE_URL);

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  async (config) => {
    console.log('Making request to:', config.url, 'with method:', config.method);
    console.log('Request headers:', config.headers);
    console.log('Request data:', config.data);
    
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url, 'with status:', response.status);
    console.log('Response data:', response.data);
    return response;
  },
  async (error) => {
    console.error('Response error from:', error.config?.url, 'with status:', error.response?.status);
    console.error('Response error data:', error.response?.data);
    
    // Only handle 401 errors for non-login requests
    if (error.response?.status === 401 && !error.config.url.includes('/login')) {
      // Clear token and user data on authentication error
      await SecureStore.deleteItemAsync('userToken');
      // Redirect to login
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate it
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        // Validate token with backend
        const { data } = await api.get('/user');
        console.log('loadStoredUser - API response:', data);
        
        // Handle both response structures: {data: user} or direct user object
        const userData = data.data || data;
        console.log('loadStoredUser - Setting user:', userData);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
      // If there's an error (like invalid token), clear the stored token
      await SecureStore.deleteItemAsync('userToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt - URL:', `${BASE_URL}/login`);
      console.log('Login attempt - Email:', email);
      console.log('Login attempt - Headers:', api.defaults.headers);
      
      let{ data } = await api.post('/login', { email, password });

      console.log('Login response received:', data);

      data = data.data;

      if (!data.token) {
        throw new Error('No token received from server');
      }

      const token = String(data.token);
      await SecureStore.setItemAsync('userToken', token);
      setUser(data.user);
      router.replace('/(app)/home');
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('\n');
        throw new Error(errorMessages);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      // Generic error message for any other type of error
      throw new Error('Invalid email or password. Please try again.');
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await api.post('/logout');
      await SecureStore.deleteItemAsync('userToken');
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the server request fails, we should still clear local data
      await SecureStore.deleteItemAsync('userToken');
      setUser(null);
      router.replace('/(auth)/login');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, username: string) => {
    try {
      console.log('Attempting signup with data:', { email, name, username, password: '[REDACTED]' });
      
      let { data } = await api.post('/register', {
        email,
        password,
        password_confirmation: password,
        name,
        username,
      });

      data = data.data;

      if (!data.token) {
        throw new Error('No token received from server');
      }

      const token = String(data.token);
      await SecureStore.setItemAsync('userToken', token);
      setUser(data.user);
      router.replace('/(app)/home');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('\n');
        throw new Error(errorMessages);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      // Don't set loading state to prevent any UI updates that might trigger navigation
      const response = await api.post('/password-email', { email });
      
      // Handle response structure properly
      const message = response.data.message || response.data.data?.message || "A reset token has been sent to your email. Please check your inbox.";
      
      // Return a message indicating a token was sent
      return message;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('\n');
        throw new Error(errorMessages);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 500) {
        return "A reset token has been sent to your email. Please check your inbox.";
      }
      throw new Error('Failed to request password reset. Please try again.');
    }
  };

  const resetPassword = async (email: string, password: string, token: string) => {
    try {
      setIsLoading(true);
      let { data } = await api.post('/reset-password', {
        email,
        password,
        password_confirmation: password,
        token,
      });

      // Handle response structure properly
      const responseData = data.data || data;
      const message = responseData.message || 'Your password has been reset successfully.';

      // After successful password reset, clear any existing auth state
      await SecureStore.deleteItemAsync('userToken');
      setUser(null);

      return message;
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('\n');
        throw new Error(errorMessages);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider; 