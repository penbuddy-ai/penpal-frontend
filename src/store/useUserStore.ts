import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * User interface representing user data
 */
interface User {
  id?: string;
  name?: string;
  email?: string;
  nativeLanguage?: string;
  learningLanguages?: string[];
  proficiencyLevels?: Record<string, string>;
}

/**
 * User store state interface
 */
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUserLanguages: (languages: string[]) => void;
  updateProficiencyLevel: (language: string, level: string) => void;
}

/**
 * User store for managing user state
 */
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
      updateUserLanguages: (languages) =>
        set((state) => ({
          user: state.user ? { ...state.user, learningLanguages: languages } : null,
        })),
      updateProficiencyLevel: (language, level) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                proficiencyLevels: {
                  ...(state.user.proficiencyLevels || {}),
                  [language]: level,
                },
              }
            : null,
        })),
    }),
    {
      name: 'penpal-user-storage',
    }
  )
);

export default useUserStore;
