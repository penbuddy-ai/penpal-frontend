/**
 * Types for onboarding process
 */

export type LanguageLevel =
  | 'beginner'
  | 'elementary'
  | 'intermediate'
  | 'upper_intermediate'
  | 'advanced'
  | 'proficient';

export type LearningObjective =
  | 'travel'
  | 'work'
  | 'study'
  | 'daily_conversation'
  | 'culture'
  | 'other';

export type LearningFrequency = 'daily' | 'few_times_week' | 'weekly' | 'occasionally';

export interface Language {
  code: string;
  name: string;
  nativeName?: string;
  flag?: string;
}

export interface LanguageWithLevel extends Language {
  level: LanguageLevel;
}

export interface UserInterest {
  id: string;
  name: string;
  category?: string;
}

export interface OnboardingData {
  // Step 1: Welcome - no data
  welcomeCompleted: boolean;

  // Step 2: Target Languages
  targetLanguages: LanguageWithLevel[];

  // Step 3: Proficiency
  nativeLanguage?: Language;

  // Step 4: Learning Objectives
  learningObjectives: LearningObjective[];
  otherObjective?: string;

  // Step 5: Interests
  interests: UserInterest[];

  // Step 6: Learning Schedule
  learningFrequency: LearningFrequency;
  preferredLearningTime?: string; // morning, afternoon, evening, night

  // Step 7: Confirmation - no additional data
  onboardingCompleted: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  component: React.ComponentType<OnboardingStepProps>;
}

export interface OnboardingStepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  skipStep: () => void;
}

export const LANGUAGE_LEVELS: { value: LanguageLevel; label: string; description: string }[] = [
  {
    value: 'beginner',
    label: 'Débutant (A1)',
    description: 'Vous pouvez comprendre et utiliser des expressions familières et quotidiennes.',
  },
  {
    value: 'elementary',
    label: 'Élémentaire (A2)',
    description: 'Vous pouvez communiquer lors de tâches simples et habituelles.',
  },
  {
    value: 'intermediate',
    label: 'Intermédiaire (B1)',
    description:
      'Vous pouvez vous débrouiller dans la plupart des situations rencontrées en voyage.',
  },
  {
    value: 'upper_intermediate',
    label: 'Intermédiaire supérieur (B2)',
    description: "Vous pouvez communiquer avec un degré de spontanéité et d'aisance.",
  },
  {
    value: 'advanced',
    label: 'Avancé (C1)',
    description: 'Vous pouvez vous exprimer de façon claire et détaillée sur des sujets complexes.',
  },
  {
    value: 'proficient',
    label: 'Maîtrise (C2)',
    description:
      'Vous pouvez comprendre sans effort pratiquement tout ce que vous lisez ou entendez.',
  },
];

export const LEARNING_OBJECTIVES: { value: LearningObjective; label: string; icon?: string }[] = [
  { value: 'travel', label: 'Voyages' },
  { value: 'work', label: 'Travail et carrière' },
  { value: 'study', label: 'Études' },
  { value: 'daily_conversation', label: 'Conversations quotidiennes' },
  { value: 'culture', label: 'Culture et divertissement' },
  { value: 'other', label: 'Autre' },
];

export const LEARNING_FREQUENCIES: {
  value: LearningFrequency;
  label: string;
  description: string;
}[] = [
  {
    value: 'daily',
    label: 'Tous les jours',
    description: '15-30 minutes par jour pour des progrès rapides',
  },
  {
    value: 'few_times_week',
    label: 'Quelques fois par semaine',
    description: '2-3 séances par semaine pour des progrès réguliers',
  },
  {
    value: 'weekly',
    label: 'Une fois par semaine',
    description: 'Une séance plus longue chaque semaine',
  },
  {
    value: 'occasionally',
    label: 'Occasionnellement',
    description: 'Quand vous en avez le temps, sans engagement fixe',
  },
];
