import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnboardingData, OnboardingStep, OnboardingProgress } from '@/types/onboarding';

/**
 * Onboarding step configuration
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'preferred-name',
    title: 'Comment souhaitez-vous être appelé ?',
    description: 'Choisissez le nom que vous préférez pour personnaliser votre expérience',
    component: 'PreferredNameStep',
    isRequired: true,
  },
  {
    id: 'learning-language',
    title: 'Quelle langue voulez-vous apprendre ?',
    description: 'Sélectionnez la langue que vous souhaitez maîtriser',
    component: 'LanguageSelectionStep',
    isRequired: true,
  },
  {
    id: 'proficiency-level',
    title: 'Quel est votre niveau actuel ?',
    description: 'Aidez-nous à adapter les conversations à votre niveau',
    component: 'ProficiencyLevelStep',
    isRequired: true,
  },
  {
    id: 'summary',
    title: 'Récapitulatif',
    description: 'Vérifiez vos informations avant de continuer',
    component: 'SummaryStep',
    isRequired: true,
  },
];

/**
 * Onboarding store state interface
 */
interface OnboardingState {
  // State
  data: OnboardingData;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;

  // Computed properties functions
  getCurrentStep: () => OnboardingStep | null;
  getProgress: () => OnboardingProgress;
  getCanGoNext: () => boolean;
  getCanGoPrevious: () => boolean;

  // Actions
  setPreferredName: (name: string) => void;
  setLearningLanguage: (language: string) => void;
  setProficiencyLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;

  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;

  // Validation
  validateCurrentStep: () => boolean;

  // Persistence
  saveProgress: () => Promise<void>;
  completeOnboarding: () => Promise<void>;

  // Reset
  resetOnboarding: () => void;

  // Error handling
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Initial onboarding data
 */
const initialData: OnboardingData = {
  preferredName: '',
  learningLanguage: '',
  proficiencyLevel: 'beginner',
  currentStep: 0,
  completedSteps: [],
  isCompleted: false,
};

/**
 * Onboarding store for managing onboarding flow state
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      data: initialData,
      isLoading: false,
      error: null,
      isSaving: false,

      // Computed properties functions
      getCurrentStep: () => {
        const { data } = get();
        return ONBOARDING_STEPS[data.currentStep] || null;
      },

      getProgress: () => {
        const { data } = get();
        return {
          currentStep: data.currentStep + 1,
          totalSteps: ONBOARDING_STEPS.length,
          percentage: Math.round(((data.currentStep + 1) / ONBOARDING_STEPS.length) * 100),
        };
      },

      getCanGoNext: () => {
        const { data, validateCurrentStep } = get();
        return data.currentStep < ONBOARDING_STEPS.length - 1 && validateCurrentStep();
      },

      getCanGoPrevious: () => {
        const { data } = get();
        return data.currentStep > 0;
      },

      // Data setters
      setPreferredName: (name: string) => {
        set((state) => ({
          data: { ...state.data, preferredName: name },
          error: null,
        }));
      },

      setLearningLanguage: (language: string) => {
        set((state) => ({
          data: { ...state.data, learningLanguage: language },
          error: null,
        }));
      },

      setProficiencyLevel: (level: 'beginner' | 'intermediate' | 'advanced') => {
        set((state) => ({
          data: { ...state.data, proficiencyLevel: level },
          error: null,
        }));
      },

      // Navigation actions
      nextStep: () => {
        const { data, getCanGoNext, getCurrentStep } = get();
        if (!getCanGoNext()) return;

        const newCompletedSteps = [...data.completedSteps];
        const currentStep = getCurrentStep();
        if (currentStep && !newCompletedSteps.includes(currentStep.id)) {
          newCompletedSteps.push(currentStep.id);
        }

        set((state) => ({
          data: {
            ...state.data,
            currentStep: state.data.currentStep + 1,
            completedSteps: newCompletedSteps,
          },
        }));
      },

      previousStep: () => {
        const { getCanGoPrevious } = get();
        if (!getCanGoPrevious()) return;

        set((state) => ({
          data: {
            ...state.data,
            currentStep: state.data.currentStep - 1,
          },
        }));
      },

      goToStep: (stepIndex: number) => {
        if (stepIndex < 0 || stepIndex >= ONBOARDING_STEPS.length) return;

        set((state) => ({
          data: {
            ...state.data,
            currentStep: stepIndex,
          },
        }));
      },

      // Validation
      validateCurrentStep: () => {
        const { data, getCurrentStep } = get();
        const currentStep = getCurrentStep();
        if (!currentStep) return false;

        switch (currentStep.id) {
          case 'preferred-name':
            return data.preferredName.trim().length >= 2;
          case 'learning-language':
            return data.learningLanguage.length > 0;
          case 'proficiency-level':
            return ['beginner', 'intermediate', 'advanced'].includes(data.proficiencyLevel);
          case 'summary':
            return true; // Summary step is always valid
          default:
            return false;
        }
      },

      // Persistence actions
      saveProgress: async () => {
        set({ isSaving: true, error: null });
        try {
          const { OnboardingService } = await import('@/services/onboarding.service');

          await OnboardingService.saveProgress(get().data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Save error';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isSaving: false });
        }
      },

      completeOnboarding: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = get();
          const { OnboardingService } = await import('@/services/onboarding.service');

          await OnboardingService.completeOnboarding(data);

          // Update local onboarding state
          set((state) => ({
            data: { ...state.data, isCompleted: true },
            isLoading: false,
          }));

          // Update user store to reflect onboarding completion
          // Import dynamically to avoid circular dependencies
          const { default: useUserStore } = await import('./useUserStore');
          const userStore = useUserStore.getState();
          if (userStore.user) {
            userStore.setUser({
              ...userStore.user,
              onboardingCompleted: true,
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Completion error';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Reset
      resetOnboarding: () => {
        set({
          data: initialData,
          isLoading: false,
          error: null,
          isSaving: false,
        });
      },

      // Error handling
      setError: (error: string | null) => {
        set({ error });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'penpal-onboarding-storage',
      partialize: (state) => ({ data: state.data }),
    }
  )
);
