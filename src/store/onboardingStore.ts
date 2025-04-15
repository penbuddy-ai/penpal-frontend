/**
 * Onboarding store using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  OnboardingData,
  LanguageWithLevel,
  UserInterest,
  LearningObjective,
  LanguageLevel,
} from '@/types/onboarding';

interface OnboardingState {
  // Data
  data: OnboardingData;
  currentStep: number;
  totalSteps: number;

  // Actions
  updateData: (updates: Partial<OnboardingData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  resetOnboarding: () => void;
  completeOnboarding: () => void;

  // Language specific actions
  addTargetLanguage: (language: LanguageWithLevel) => void;
  removeTargetLanguage: (languageCode: string) => void;
  updateTargetLanguageLevel: (languageCode: string, level: LanguageLevel) => void;
  setNativeLanguage: (language: { code: string; name: string; nativeName?: string }) => void;

  // Learning objectives actions
  toggleLearningObjective: (objective: LearningObjective) => void;

  // Interests actions
  addInterest: (interest: UserInterest) => void;
  removeInterest: (interestId: string) => void;
}

// Initial state with default values
const initialData: OnboardingData = {
  welcomeCompleted: false,
  targetLanguages: [],
  learningObjectives: [],
  interests: [],
  learningFrequency: 'daily',
  onboardingCompleted: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      data: initialData,
      currentStep: 0,
      totalSteps: 7, // Number of steps in the onboarding process

      updateData: (updates: Partial<OnboardingData>) => {
        set((state) => ({
          data: { ...state.data, ...updates },
        }));
      },

      nextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps - 1) {
          set((state) => ({ currentStep: state.currentStep + 1 }));
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set((state) => ({ currentStep: state.currentStep - 1 }));
        }
      },

      goToStep: (step: number) => {
        const { totalSteps } = get();
        if (step >= 0 && step < totalSteps) {
          set({ currentStep: step });
        }
      },

      resetOnboarding: () => {
        set({ data: initialData, currentStep: 0 });
      },

      completeOnboarding: () => {
        set((state) => ({
          data: { ...state.data, onboardingCompleted: true },
        }));
      },

      // Language specific actions
      addTargetLanguage: (language: LanguageWithLevel) => {
        set((state) => {
          // Check if this language already exists
          const exists = state.data.targetLanguages.some((lang) => lang.code === language.code);

          if (!exists) {
            return {
              data: {
                ...state.data,
                targetLanguages: [...state.data.targetLanguages, language],
              },
            };
          }
          return state;
        });
      },

      removeTargetLanguage: (languageCode: string) => {
        set((state) => ({
          data: {
            ...state.data,
            targetLanguages: state.data.targetLanguages.filter(
              (lang) => lang.code !== languageCode
            ),
          },
        }));
      },

      updateTargetLanguageLevel: (languageCode: string, level: LanguageLevel) => {
        set((state) => ({
          data: {
            ...state.data,
            targetLanguages: state.data.targetLanguages.map((lang) =>
              lang.code === languageCode ? { ...lang, level } : lang
            ),
          },
        }));
      },

      setNativeLanguage: (language) => {
        set((state) => ({
          data: {
            ...state.data,
            nativeLanguage: language,
          },
        }));
      },

      // Learning objectives actions
      toggleLearningObjective: (objective: LearningObjective) => {
        set((state) => {
          const objectives = state.data.learningObjectives;
          const hasObjective = objectives.includes(objective);

          return {
            data: {
              ...state.data,
              learningObjectives: hasObjective
                ? objectives.filter((obj) => obj !== objective)
                : [...objectives, objective],
            },
          };
        });
      },

      // Interests actions
      addInterest: (interest: UserInterest) => {
        set((state) => {
          // Check if this interest already exists
          const exists = state.data.interests.some((int) => int.id === interest.id);

          if (!exists) {
            return {
              data: {
                ...state.data,
                interests: [...state.data.interests, interest],
              },
            };
          }
          return state;
        });
      },

      removeInterest: (interestId: string) => {
        set((state) => ({
          data: {
            ...state.data,
            interests: state.data.interests.filter((interest) => interest.id !== interestId),
          },
        }));
      },
    }),
    {
      name: 'penpal-onboarding-storage',
    }
  )
);
