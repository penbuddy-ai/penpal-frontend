import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, User as AuthUser, AuthResponse, AuthError } from '@/services/auth.service';

// Type étendu pour inclure les propriétés de langue
type User = AuthUser & {
  nativeLanguage?: string;
  learningLanguages?: string[];
  proficiencyLevels?: Record<string, string>;
};

/**
 * User store state interface
 */
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  _authCheckPromise: Promise<void> | null;
  _lastAuthCheck: number;
  _authCheckCooldown: number;

  // Actions d'authentification
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearUser: () => void;

  // Actions de profil
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;

  // Actions OAuth
  handleOAuthCallback: (sessionToken: string) => Promise<void>;

  // Gestion d'état
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Vérification d'authentification
  checkAuthStatus: () => Promise<void>;

  // Langues (compatibilité avec l'ancien store)
  updateUserLanguages: (languages: string[]) => void;
  updateProficiencyLevel: (language: string, level: string) => void;

  // Utilitaires
  getCurrentUserId: () => string | null;
}

/**
 * User store for managing user state with authentication
 */
const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      _authCheckPromise: null as Promise<void> | null,
      _lastAuthCheck: 0,
      _authCheckCooldown: 5000,

      // Actions d'authentification
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await authService.login({ email, password });
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            _lastAuthCheck: Date.now(),
          });
        } catch (error) {
          let errorMessage = 'Erreur de connexion';
          if (error instanceof AuthError) {
            errorMessage = error.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.register(userData);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          let errorMessage = "Erreur d'inscription";
          if (error instanceof AuthError) {
            errorMessage = error.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true, error: null });
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      // Actions de profil
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateProfile(userData);
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur de mise à jour';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.changePassword(currentPassword, newPassword);
          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Erreur de changement de mot de passe';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Actions OAuth
      handleOAuthCallback: async (sessionToken: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.getOAuthSessionUser(sessionToken);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur OAuth';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      // Gestion d'état
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuthStatus: async () => {
        const state = get();
        const now = Date.now();

        if (state._authCheckPromise) {
          return state._authCheckPromise;
        }

        if (state._lastAuthCheck && now - state._lastAuthCheck < state._authCheckCooldown) {
          return Promise.resolve();
        }

        const authPromise = (async () => {
          set({ isLoading: true });
          try {
            const isAuthenticated = await authService.checkAuthStatus();
            if (isAuthenticated) {
              const user = await authService.getCurrentUser();
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                _lastAuthCheck: Date.now(),
                _authCheckPromise: null,
              });
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                _lastAuthCheck: Date.now(),
                _authCheckPromise: null,
              });
            }
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              _lastAuthCheck: Date.now(),
              _authCheckPromise: null,
            });
          }
        })();

        set({ _authCheckPromise: authPromise });

        return authPromise;
      },

      // Langues (compatibilité avec l'ancien store)
      updateUserLanguages: (languages: string[]) => {
        const { user } = get();
        if (user) {
          const updatedUser = {
            ...user,
            learningLanguages: languages,
          } as User & { learningLanguages: string[] };
          set({ user: updatedUser });
        }
      },

      updateProficiencyLevel: (language: string, level: string) => {
        const { user } = get();
        if (user) {
          const currentUser = user as User & { proficiencyLevels?: Record<string, string> };
          const updatedUser = {
            ...currentUser,
            proficiencyLevels: {
              ...(currentUser.proficiencyLevels || {}),
              [language]: level,
            },
          };
          set({ user: updatedUser });
        }
      },

      // Utilitaires
      getCurrentUserId: () => {
        const { user } = get();
        return user?.id || null;
      },
    }),
    {
      name: 'penpal-user-storage',
      // Ne pas persister les états temporaires
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;
