/**
 * Onboarding Steps Definition Component
 */

import React from 'react';
import { OnboardingLayout } from './OnboardingLayout';
import { NavigationButtons } from './NavigationButtons';
import { useOnboardingStore } from '@/store/onboardingStore';

// Import step components
import { WelcomeStep } from './steps/WelcomeStep';
import { LanguageSelectionStep } from './steps/LanguageSelectionStep';
import { ProficiencyStep } from './steps/ProficiencyStep';
import { LearningObjectivesStep } from './steps/LearningObjectivesStep';
import { InterestsStep } from './steps/InterestsStep';
import { LearningScheduleStep } from './steps/LearningScheduleStep';
import { SummaryStep } from './steps/SummaryStep';

// Step configuration
export const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Bienvenue',
    component: WelcomeStep,
    isRequired: true,
  },
  {
    id: 'language',
    title: 'Langue',
    component: LanguageSelectionStep,
    isRequired: true,
  },
  {
    id: 'proficiency',
    title: 'Niveau',
    component: ProficiencyStep,
    isRequired: true,
  },
  {
    id: 'objectives',
    title: 'Objectifs',
    component: LearningObjectivesStep,
    isRequired: false,
  },
  {
    id: 'interests',
    title: 'Intérêts',
    component: InterestsStep,
    isRequired: false,
  },
  {
    id: 'schedule',
    title: 'Planning',
    component: LearningScheduleStep,
    isRequired: false,
  },
  {
    id: 'summary',
    title: 'Résumé',
    component: SummaryStep,
    isRequired: true,
  },
];

export function OnboardingSteps() {
  const { currentStep, totalSteps, data, updateData, nextStep, previousStep } =
    useOnboardingStore();

  // Get the current step configuration
  const currentStepConfig = ONBOARDING_STEPS[currentStep];
  const StepComponent = currentStepConfig.component;

  // Determine titles based on the current step
  const stepTitles = {
    welcome: {
      title: 'Bienvenue sur Penpal AI',
      subtitle: "Personnalisons votre expérience d'apprentissage",
    },
    language: {
      title: 'Quelle langue souhaitez-vous apprendre ?',
      subtitle: "Vous pourrez ajouter d'autres langues ultérieurement",
    },
    proficiency: {
      title: 'Quel est votre niveau actuel ?',
      subtitle: "Cela nous permet d'adapter votre expérience d'apprentissage",
    },
    objectives: {
      title: "Quels sont vos objectifs d'apprentissage ?",
      subtitle: "Sélectionnez tous ceux qui s'appliquent",
    },
    interests: {
      title: "Quels sont vos centres d'intérêt ?",
      subtitle: 'Nous utiliserons ces informations pour personnaliser vos conversations',
    },
    schedule: {
      title: 'À quelle fréquence souhaitez-vous pratiquer ?',
      subtitle: "Définissez votre rythme d'apprentissage",
    },
    summary: {
      title: 'Parfait, vous êtes prêt !',
      subtitle: 'Voici un résumé de vos préférences',
    },
  };

  const titles = stepTitles[currentStepConfig.id as keyof typeof stepTitles];

  // Create array of steps for the progress bar
  const progressSteps = ONBOARDING_STEPS.map((step, index) => {
    // Determine if the step is completed based on data
    let isCompleted = false;

    switch (step.id) {
      case 'welcome':
        isCompleted = data.welcomeCompleted;
        break;
      case 'language':
        isCompleted = data.targetLanguages.length > 0;
        break;
      case 'proficiency':
        isCompleted = !!data.nativeLanguage && data.targetLanguages.every((lang) => lang.level);
        break;
      case 'objectives':
        isCompleted = data.learningObjectives.length > 0;
        break;
      case 'interests':
        isCompleted = data.interests.length > 0;
        break;
      case 'schedule':
        isCompleted = !!data.learningFrequency;
        break;
      case 'summary':
        isCompleted = data.onboardingCompleted;
        break;
      default:
        isCompleted = index < currentStep;
    }

    return {
      ...step,
      isCompleted,
    };
  });

  // Handle navigation
  const handleNext = () => {
    // Update step-specific completion status
    switch (currentStepConfig.id) {
      case 'welcome':
        updateData({ welcomeCompleted: true });
        break;
      case 'summary':
        updateData({ onboardingCompleted: true });
        break;
    }

    nextStep();
  };

  const handleSkip = () => {
    if (!currentStepConfig.isRequired) {
      nextStep();
    }
  };

  return (
    <OnboardingLayout title={titles.title} subtitle={titles.subtitle} steps={progressSteps}>
      <StepComponent
        data={data}
        updateData={updateData}
        goToNextStep={nextStep}
        goToPreviousStep={previousStep}
        skipStep={handleSkip}
      />

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={previousStep}
        onNext={handleNext}
        onSkip={!currentStepConfig.isRequired ? handleSkip : undefined}
        showSkip={!currentStepConfig.isRequired}
        // isNextDisabled logic would go here, based on step validation
      />
    </OnboardingLayout>
  );
}
