/**
 * Language Level Selection Step Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepProps, LanguageLevel } from '@/types/onboarding';

// Description des niveaux de langue
const LANGUAGE_LEVELS = [
  {
    id: 'beginner' as LanguageLevel,
    label: 'Débutant',
    description: 'Vous connaissez quelques mots et phrases de base.',
    icon: '🌱',
  },
  {
    id: 'elementary' as LanguageLevel,
    label: 'Élémentaire',
    description: 'Vous pouvez communiquer de façon simple sur des sujets familiers.',
    icon: '🌿',
  },
  {
    id: 'intermediate' as LanguageLevel,
    label: 'Intermédiaire',
    description: 'Vous pouvez participer à des conversations sur divers sujets.',
    icon: '🌳',
  },
  {
    id: 'advanced' as LanguageLevel,
    label: 'Avancé',
    description: 'Vous pouvez communiquer avec aisance et spontanéité.',
    icon: '🌲',
  },
  {
    id: 'proficient' as LanguageLevel,
    label: 'Expérimenté',
    description: 'Vous maîtrisez la langue avec précision et fluidité.',
    icon: '🌴',
  },
];

export function LanguageLevelStep({ data, updateData }: OnboardingStepProps) {
  // Si aucune langue n'est sélectionnée, message d'erreur
  if (data.targetLanguages.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          Aucune langue sélectionnée
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400">
          Veuillez d'abord sélectionner au moins une langue à l'étape précédente.
        </p>
      </div>
    );
  }

  const handleLevelChange = (languageCode: string, level: LanguageLevel) => {
    const updatedLanguages = data.targetLanguages.map((lang) =>
      lang.code === languageCode ? { ...lang, level } : lang
    );

    updateData({ targetLanguages: updatedLanguages });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          Sélectionnez votre niveau pour chaque langue
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Cela nous aidera à adapter les conversations à votre niveau actuel
        </p>
      </div>

      {data.targetLanguages.map((language, index) => (
        <motion.div
          key={language.code}
          className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">{language.flag}</span>
            <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {language.name}
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {LANGUAGE_LEVELS.map((level) => (
              <motion.button
                key={level.id}
                onClick={() => handleLevelChange(language.code, level.id)}
                className={`flex items-center p-3 border rounded-md ${
                  language.level === level.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-600'
                    : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl mr-3">{level.icon}</span>
                <div className="text-left flex-1">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {level.label}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {level.description}
                  </div>
                </div>
                {language.level === level.id && (
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
        </motion.div>
      ))}
    </div>
  );
}
