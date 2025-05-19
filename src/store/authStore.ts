import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '@/services/auth.service';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    termsAccepted: boolean;
  }) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'apple', tokenData: any) => Promise<AuthResponse>;
  initiateOAuthLogin: (provider: 'google' | 'apple') => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          set({ user: response.user, isLoading: false });
          return response;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          set({ isLoading: false });
          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Erreur lors de l'inscription";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      loginWithOAuth: async (provider, tokenData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.loginWithOAuth(provider, tokenData);
          set({ user: response.user, isLoading: false });
          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : `Erreur de connexion avec ${provider}`;
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      initiateOAuthLogin: (provider) => {
        authService.initiateOAuthLogin(provider);
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          set({ user: null, isLoading: false });
        } catch (error) {
          console.error('Logout error:', error);
          // Même en cas d'erreur, on déconnecte localement
          set({ user: null, isLoading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // nom pour le localStorage
      partialize: (state) => ({ user: state.user }), // ne stocker que l'utilisateur
    }
  )
);

/**
 * Hook personnalisé pour utiliser l'authentification avec la navigation
 */
export function useAuth() {
  const router = useRouter();
  const {
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    loginWithOAuth: storeLoginWithOAuth,
    ...rest
  } = useAuthStore();

  // Fonctions enrichies avec la redirection
  const login = async (email: string, password: string) => {
    await storeLogin(email, password);
    router.push('/chat');
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    termsAccepted: boolean;
  }) => {
    await storeRegister(data);
    router.push('/auth/login');
  };

  const loginWithOAuth = async (provider: 'google' | 'apple', tokenData: any) => {
    await storeLoginWithOAuth(provider, tokenData);
    router.push('/chat');
  };

  const logout = async () => {
    await storeLogout();
    router.push('/auth/login');
  };

  return {
    ...rest,
    login,
    register,
    loginWithOAuth,
    logout,
  };
}

export default useAuthStore;
