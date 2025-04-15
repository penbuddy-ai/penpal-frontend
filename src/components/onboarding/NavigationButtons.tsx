/**
 * Onboarding Navigation Buttons Component
 */

import React from 'react';
import { motion } from 'framer-motion';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSkip?: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  showSkip?: boolean;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSkip,
  isNextDisabled = false,
  nextLabel,
  showSkip = false,
}: NavigationButtonsProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between mt-8">
      {/* Previous Button */}
      <motion.button
        className={`px-6 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 transition-colors ${
          isFirstStep
            ? 'invisible'
            : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
        }`}
        onClick={onPrevious}
        whileTap={{ scale: 0.95 }}
        disabled={isFirstStep}
      >
        Précédent
      </motion.button>

      <div className="flex space-x-4">
        {/* Skip Button */}
        {showSkip && onSkip && (
          <motion.button
            className="px-6 py-2 rounded-md text-neutral-500 hover:text-neutral-700 transition-colors dark:text-neutral-400 dark:hover:text-neutral-200"
            onClick={onSkip}
            whileTap={{ scale: 0.95 }}
          >
            Passer
          </motion.button>
        )}

        {/* Next Button */}
        <motion.button
          className={`px-6 py-2 rounded-md transition-colors ${
            isNextDisabled
              ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-500'
              : 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600'
          }`}
          onClick={onNext}
          whileTap={isNextDisabled ? {} : { scale: 0.95 }}
          disabled={isNextDisabled}
        >
          {nextLabel || (isLastStep ? 'Terminer' : 'Suivant')}
        </motion.button>
      </div>
    </div>
  );
}
