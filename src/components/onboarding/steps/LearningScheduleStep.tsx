/**
 * Learning Schedule Step Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepProps, LearningFrequency } from '@/types/onboarding';

const LEARNING_TIMES = [
  { id: 'morning', label: 'Matin', icon: '🌅' },
  { id: 'afternoon', label: 'Après-midi', icon: '☀️' },
  { id: 'evening', label: 'Soir', icon: '🌆' },
  { id: 'night', label: 'Nuit', icon: '🌙' },
  { id: 'anytime', label: "N'importe quand", icon: '⏱️' },
];

const LEARNING_FREQUENCIES = [
  {
    value: 'daily' as LearningFrequency,
    label: 'Tous les jours',
    icon: '📆',
    description: '15-30 minutes par jour pour des progrès rapides',
  },
  {
    value: 'few_times_week' as LearningFrequency,
    label: 'Quelques fois par semaine',
    icon: '📅',
    description: '2-3 séances par semaine pour des progrès réguliers',
  },
  {
    value: 'weekly' as LearningFrequency,
    label: 'Une fois par semaine',
    icon: '🗓️',
    description: 'Une séance plus longue chaque semaine',
  },
  {
    value: 'occasionally' as LearningFrequency,
    label: 'Occasionnellement',
    icon: '🕒',
    description: 'Quand vous en avez le temps, sans engagement fixe',
  },
];

export function LearningScheduleStep({ data, updateData }: OnboardingStepProps) {
  const handleFrequencyChange = (frequency: LearningFrequency) => {
    updateData({ learningFrequency: frequency });
  };

  const handlePreferredTimeChange = (time: string) => {
    updateData({ preferredLearningTime: time });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          À quelle fréquence souhaitez-vous pratiquer ?
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Choisissez un rythme qui correspond à votre emploi du temps
        </p>
      </div>

      {/* Frequency selection */}
      <div className="space-y-4">
        <h4 className="font-medium text-neutral-800 dark:text-neutral-200">
          Fréquence d'apprentissage
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LEARNING_FREQUENCIES.map((frequency, index) => (
            <motion.button
              key={frequency.value}
              className={`flex items-center p-4 rounded-lg border text-left ${
                data.learningFrequency === frequency.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-600'
                  : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
              }`}
              onClick={() => handleFrequencyChange(frequency.value)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl mr-4">{frequency.icon}</span>
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {frequency.label}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {frequency.description}
                </div>
              </div>
              {data.learningFrequency === frequency.value && (
                <motion.div
                  className="ml-auto text-primary-600 dark:text-primary-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Preferred time selection */}
      <div className="space-y-4 pt-4">
        <h4 className="font-medium text-neutral-800 dark:text-neutral-200">
          Moment de la journée préféré
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {LEARNING_TIMES.map((time, index) => (
            <motion.button
              key={time.id}
              className={`flex flex-col items-center p-4 rounded-lg border ${
                data.preferredLearningTime === time.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-600'
                  : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
              }`}
              onClick={() => handlePreferredTimeChange(time.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl mb-2">{time.icon}</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {time.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {data.learningFrequency && data.preferredLearningTime && (
        <motion.div
          className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Votre planning
          </h4>
          <div className="text-neutral-700 dark:text-neutral-300">
            <p>
              Vous avez choisi de pratiquer
              <span className="font-medium text-primary-600 dark:text-primary-400">
                {' '}
                {LEARNING_FREQUENCIES.find(
                  (f) => f.value === data.learningFrequency
                )?.label.toLowerCase()}{' '}
              </span>
              , de préférence
              <span className="font-medium text-primary-600 dark:text-primary-400">
                {' '}
                {LEARNING_TIMES.find(
                  (t) => t.id === data.preferredLearningTime
                )?.label.toLowerCase()}{' '}
              </span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
