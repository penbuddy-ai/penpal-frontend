import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import authService from '../services/auth.service';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    termsAccepted: boolean;
  }) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'apple', tokenData: any) => Promise<void>;
  initiateOAuthLogin: (provider: 'google' | 'apple') => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize user state from localStorage on load
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.login(email, password);
        setUser(response.user);
        router.push('/chat');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de connexion');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // Register function
  const register = useCallback(
    async (data: { name: string; email: string; password: string; termsAccepted: boolean }) => {
      setIsLoading(true);
      setError(null);
      try {
        await authService.register(data);
        // After successful registration, redirect to login page
        router.push('/auth/login');
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // Fonction de connexion OAuth
  const loginWithOAuth = useCallback(
    async (provider: 'google' | 'apple', tokenData: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.loginWithOAuth(provider, tokenData);
        setUser(response.user);
        router.push('/chat');
      } catch (err) {
        setError(err instanceof Error ? err.message : `Erreur de connexion avec ${provider}`);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // Initiate OAuth login (redirect)
  const initiateOAuthLogin = useCallback((provider: 'google' | 'apple') => {
    authService.initiateOAuthLogin(provider);
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Even in case of error, we disconnect locally
      setUser(null);
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Function to clear errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    loginWithOAuth,
    initiateOAuthLogin,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}
