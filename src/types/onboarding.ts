/**
 * Onboarding type definitions
 */

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
  isPopular?: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isRequired: boolean;
  validationSchema?: any;
}

export interface OnboardingData {
  preferredName: string;
  learningLanguage: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
  currentStep: number;
  completedSteps: string[];
  isCompleted: boolean;
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  percentage: number;
}

export const PROFICIENCY_LEVELS = {
  beginner: {
    label: 'Débutant',
    description: 'Je débute dans cette langue',
    icon: '🌱',
  },
  intermediate: {
    label: 'Intermédiaire',
    description: 'Je peux tenir des conversations simples',
    icon: '🌿',
  },
  advanced: {
    label: 'Avancé',
    description: 'Je maîtrise bien cette langue',
    icon: '🌳',
  },
} as const;

export const POPULAR_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isPopular: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isPopular: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isPopular: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isPopular: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isPopular: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', isPopular: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isPopular: true },
];
