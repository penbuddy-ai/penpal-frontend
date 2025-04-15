/**
 * Learning Objectives Step Component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepProps, LearningObjective } from '@/types/onboarding';

export function LearningObjectivesStep({ data, updateData }: OnboardingStepProps) {
  const [otherObjective, setOtherObjective] = useState(data.otherObjective || '');

  const toggleObjective = (objective: LearningObjective) => {
    const hasObjective = data.learningObjectives.includes(objective);

    if (hasObjective) {
      // Supprimer l'objectif
      updateData({
        learningObjectives: data.learningObjectives.filter((obj) => obj !== objective),
      });

      // Si on désélectionne "other", on réinitialise aussi le texte personnalisé
      if (objective === 'other') {
        setOtherObjective('');
        updateData({ otherObjective: undefined });
      }
    } else {
      // Ajouter l'objectif
      updateData({
        learningObjectives: [...data.learningObjectives, objective],
      });
    }
  };

  const handleOtherObjectiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherObjective(value);
    updateData({ otherObjective: value });

    // Si l'utilisateur entre du texte mais n'a pas sélectionné "other", on l'ajoute
    if (value && !data.learningObjectives.includes('other')) {
      updateData({
        learningObjectives: [...data.learningObjectives, 'other'],
      });
    }
  };

  // Ajouter des icônes aux objectifs
  const objectivesWithIcons = [
    { value: 'travel' as LearningObjective, label: 'Voyages', icon: '✈️' },
    { value: 'work' as LearningObjective, label: 'Travail et carrière', icon: '💼' },
    { value: 'study' as LearningObjective, label: 'Études', icon: '📚' },
    {
      value: 'daily_conversation' as LearningObjective,
      label: 'Conversations quotidiennes',
      icon: '💬',
    },
    { value: 'culture' as LearningObjective, label: 'Culture et divertissement', icon: '🎭' },
    { value: 'other' as LearningObjective, label: 'Autre', icon: '✨' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          Pourquoi souhaitez-vous apprendre ces langues ?
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Sélectionnez tous les objectifs qui s'appliquent à votre situation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {objectivesWithIcons.map((objective, index) => (
          <motion.button
            key={objective.value}
            className={`flex items-center p-4 rounded-lg border text-left ${
              data.learningObjectives.includes(objective.value)
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-600'
                : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
            }`}
            onClick={() => toggleObjective(objective.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl mr-4">{objective.icon}</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {objective.label}
            </span>
            {data.learningObjectives.includes(objective.value) && (
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

      {/* Champ personnalisé pour l'option "Autre" */}
      {data.learningObjectives.includes('other') && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Précisez votre objectif
          </label>
          <input
            type="text"
            value={otherObjective}
            onChange={handleOtherObjectiveChange}
            placeholder="Décrivez votre objectif personnel..."
            className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
        </motion.div>
      )}

      {data.learningObjectives.length > 0 && (
        <motion.div
          className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Objectifs sélectionnés
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.learningObjectives.map((obj) => {
              const foundObj = objectivesWithIcons.find((o) => o.value === obj);
              return (
                <div
                  key={obj}
                  className="flex items-center bg-white dark:bg-neutral-700 px-3 py-1 rounded-full text-sm"
                >
                  <span className="mr-1">{foundObj?.icon}</span>
                  <span>
                    {obj === 'other' && otherObjective ? otherObjective : foundObj?.label}
                  </span>
                  <button
                    onClick={() => toggleObjective(obj)}
                    className="ml-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
