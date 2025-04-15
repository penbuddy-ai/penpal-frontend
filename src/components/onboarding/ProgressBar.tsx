/**
 * Onboarding Progress Bar Component
 */

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    id: string;
    title: string;
    isCompleted: boolean;
  }[];
  onStepClick?: (stepIndex: number) => void;
}

export function ProgressBar({ currentStep, totalSteps, steps, onStepClick }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      {/* Mobile Progress Bar */}
      <div className="block md:hidden">
        <div className="flex justify-between mb-2 text-sm text-neutral-600 dark:text-neutral-400">
          <span>
            Étape {currentStep + 1} sur {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-600 dark:bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Desktop Steps */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-200 dark:bg-neutral-700 -translate-y-1/2" />

          {/* Filled Progress Line */}
          <motion.div
            className="absolute top-1/2 left-0 h-1 bg-primary-600 dark:bg-primary-500 -translate-y-1/2"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || step.isCompleted;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center"
                  onClick={() => {
                    if (isCompleted && onStepClick) {
                      onStepClick(index);
                    }
                  }}
                >
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer z-10 transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white dark:bg-primary-500'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-white border-2 border-neutral-300 text-neutral-500 dark:bg-neutral-800 dark:border-neutral-600'
                    }`}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isActive
                        ? '#2563eb' // primary-600
                        : isCompleted
                          ? '#22c55e' // green-500
                          : '#ffffff', // white
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </motion.div>

                  <span
                    className={`mt-2 text-xs ${
                      isActive
                        ? 'text-primary-600 font-medium dark:text-primary-400'
                        : isCompleted
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
