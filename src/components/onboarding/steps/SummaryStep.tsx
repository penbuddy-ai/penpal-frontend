/**
 * Summary Step Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepProps, LearningFrequency } from '@/types/onboarding';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Mapping pour les labels d'affichage
const LEARNING_FREQUENCIES_LABELS: Record<LearningFrequency, string> = {
  daily: 'Tous les jours',
  few_times_week: 'Quelques fois par semaine',
  weekly: 'Une fois par semaine',
  occasionally: 'Occasionnellement',
};

const LEARNING_TIMES_LABELS: Record<string, string> = {
  morning: 'Matin',
  afternoon: 'Après-midi',
  evening: 'Soir',
  night: 'Nuit',
  anytime: "N'importe quand",
};

const OBJECTIVES_LABELS: Record<string, string> = {
  travel: 'Voyages',
  work: 'Travail et carrière',
  study: 'Études',
  daily_conversation: 'Conversations quotidiennes',
  culture: 'Culture et divertissement',
  other: 'Autre',
};

export function SummaryStep({ data, updateData }: OnboardingStepProps) {
  const router = useRouter();

  const handleComplete = () => {
    updateData({ onboardingCompleted: true });
    router.push('/chat');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <motion.div
          className="text-5xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          🎉
        </motion.div>
        <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          Félicitations, votre profil est complet !
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400">
          Voici un résumé des informations que vous avez fournies
        </p>
      </div>

      {/* Summary sections */}
      <div className="space-y-6">
        {/* Languages section */}
        <motion.div
          className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center">
            <span className="text-xl mr-2">🗣️</span>
            Langues
          </h4>

          {data.nativeLanguage && (
            <div className="mb-3">
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                Langue maternelle
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-2">{data.nativeLanguage.flag}</span>
                <span className="font-medium">{data.nativeLanguage.name}</span>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
              Langues d'apprentissage
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.targetLanguages.map((lang) => (
                <div
                  key={lang.code}
                  className="flex items-center p-2 bg-neutral-50 dark:bg-neutral-700 rounded-md"
                >
                  <span className="text-xl mr-2">{lang.flag}</span>
                  <div>
                    <div className="font-medium">{lang.name}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Niveau: {lang.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Learning objectives section */}
        {data.learningObjectives.length > 0 && (
          <motion.div
            className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center">
              <span className="text-xl mr-2">🎯</span>
              Objectifs d'apprentissage
            </h4>

            <div className="flex flex-wrap gap-2">
              {data.learningObjectives.map((objective) => (
                <div
                  key={objective}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm dark:bg-primary-900/30 dark:text-primary-300"
                >
                  {objective === 'other' && data.otherObjective
                    ? data.otherObjective
                    : OBJECTIVES_LABELS[objective] || objective}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Interests section */}
        {data.interests.length > 0 && (
          <motion.div
            className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center">
              <span className="text-xl mr-2">💡</span>
              Centres d'intérêt
            </h4>

            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest) => (
                <div
                  key={interest.id}
                  className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full text-sm dark:bg-neutral-700 dark:text-neutral-300"
                >
                  {interest.name}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Schedule section */}
        <motion.div
          className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center">
            <span className="text-xl mr-2">📅</span>
            Planning d'apprentissage
          </h4>

          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-sm text-neutral-500 dark:text-neutral-400">Fréquence</div>
              <div className="font-medium">
                {LEARNING_FREQUENCIES_LABELS[data.learningFrequency] || data.learningFrequency}
              </div>
            </div>

            {data.preferredLearningTime && (
              <div className="flex justify-between">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Moment préféré</div>
                <div className="font-medium">
                  {LEARNING_TIMES_LABELS[data.preferredLearningTime] || data.preferredLearningTime}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
        <motion.button
          className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors dark:bg-primary-700 dark:hover:bg-primary-600"
          onClick={handleComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Commencer à discuter
        </motion.button>

        <Link href="/profile" passHref>
          <motion.a
            className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-md font-medium hover:bg-neutral-50 transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Modifier mon profil
          </motion.a>
        </Link>
      </div>
    </div>
  );
}
