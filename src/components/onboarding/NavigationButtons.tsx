import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

/**
 * Navigation buttons component for onboarding flow
 */
export function NavigationButtons() {
  const {
    getCanGoNext,
    getCanGoPrevious,
    nextStep,
    previousStep,
    getCurrentStep,
    isLoading,
    isSaving,
    completeOnboarding,
    validateCurrentStep,
  } = useOnboardingStore();

  const canGoNext = getCanGoNext();
  const canGoPrevious = getCanGoPrevious();
  const currentStep = getCurrentStep();

  const isLastStep = currentStep?.id === 'summary';
  const isButtonDisabled = isLoading || isSaving;

  // For the last step, only check validation, not canGoNext
  const canProceed = isLastStep ? validateCurrentStep() : canGoNext;

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      await completeOnboarding();
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex justify-between items-center">
      {/* Previous button */}
      <motion.button
        onClick={previousStep}
        disabled={!canGoPrevious || isButtonDisabled}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
          ${
            !canGoPrevious || isButtonDisabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }
        `}
        whileHover={canGoPrevious && !isButtonDisabled ? { scale: 1.02 } : {}}
        whileTap={canGoPrevious && !isButtonDisabled ? { scale: 0.98 } : {}}
      >
        <ChevronLeft className="w-5 h-5" />
        Précédent
      </motion.button>

      {/* Next/Complete button */}
      <motion.button
        onClick={handleNext}
        disabled={!canProceed || isButtonDisabled}
        className={`
          flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all
          ${
            !canProceed || isButtonDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
          }
        `}
        whileHover={canProceed && !isButtonDisabled ? { scale: 1.02 } : {}}
        whileTap={canProceed && !isButtonDisabled ? { scale: 0.98 } : {}}
      >
        {isLoading || isSaving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isLastStep ? 'Finalisation...' : 'Sauvegarde...'}
          </>
        ) : (
          <>
            {isLastStep ? 'Terminer' : 'Suivant'}
            {!isLastStep && <ChevronRight className="w-5 h-5" />}
          </>
        )}
      </motion.button>
    </div>
  );
}

export default NavigationButtons;
