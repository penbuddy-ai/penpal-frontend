import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';
import { ProgressIndicator } from './ProgressIndicator';
import { NavigationButtons } from './NavigationButtons';
import { PreferredNameStep } from './steps/PreferredNameStep';
import { LanguageSelectionStep } from './steps/LanguageSelectionStep';
import { ProficiencyLevelStep } from './steps/ProficiencyLevelStep';
import { SummaryStep } from './steps/SummaryStep';

/**
 * Map step components to their IDs
 */
const stepComponents = {
  'preferred-name': PreferredNameStep,
  'learning-language': LanguageSelectionStep,
  'proficiency-level': ProficiencyLevelStep,
  summary: SummaryStep,
};

/**
 * Animation variants for step transitions
 */
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

/**
 * Main onboarding flow component
 */
export function OnboardingFlow() {
  const { getCurrentStep, getProgress, error } = useOnboardingStore();

  const currentStep = getCurrentStep();
  const progress = getProgress();

  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de configuration</h2>
          <p className="text-gray-600">Impossible de charger l'étape d'onboarding.</p>
        </div>
      </div>
    );
  }

  // Get the component for the current step
  const StepComponent = stepComponents[currentStep.id as keyof typeof stepComponents];

  if (!StepComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Étape non trouvée</h2>
          <p className="text-gray-600">
            Le composant pour l'étape "{currentStep.id}" n'existe pas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col">
      {/* Header with progress */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <ProgressIndicator
            current={progress.currentStep}
            total={progress.totalSteps}
            percentage={progress.percentage}
          />
        </div>
      </div>

      {/* Main content - scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 h-full flex flex-col">
          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex-shrink-0"
            >
              {error}
            </motion.div>
          )}

          {/* Step content with animation - takes remaining space */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="relative overflow-hidden flex-1">
              <AnimatePresence mode="wait" custom={1}>
                <motion.div
                  key={currentStep.id}
                  custom={1}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="w-full h-full"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 h-full overflow-y-auto">
                    <StepComponent />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-4 flex-shrink-0">
              <NavigationButtons />
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

export default OnboardingFlow;
