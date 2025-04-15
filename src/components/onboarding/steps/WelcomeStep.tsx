/**
 * Welcome Step Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepProps } from '@/types/onboarding';

export function WelcomeStep({ updateData, goToNextStep }: OnboardingStepProps) {
  const handleStart = () => {
    updateData({ welcomeCompleted: true });
    goToNextStep();
  };

  const features = [
    {
      title: 'Conversations naturelles',
      description: 'Pratiquez avec un partenaire de conversation disponible 24/7',
      icon: '💬',
    },
    {
      title: 'Feedback personnalisé',
      description: 'Recevez des corrections et suggestions adaptées à votre niveau',
      icon: '✅',
    },
    {
      title: 'Suivi des progrès',
      description: 'Visualisez votre évolution et vos points à améliorer',
      icon: '📈',
    },
    {
      title: 'Adapté à vos intérêts',
      description: 'Discutez de sujets qui vous passionnent pour un apprentissage plus engageant',
      icon: '🎯',
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">👋</div>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
          Nous sommes ravis de vous accueillir chez Penpal AI ! <br />
          En quelques étapes, personnalisons ensemble votre expérience d&apos;apprentissage.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-5 flex items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
          >
            <div className="text-3xl mr-4">{feature.icon}</div>
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="bg-primary-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-primary-700 transition-colors dark:bg-primary-700 dark:hover:bg-primary-600"
        onClick={handleStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Commencer la personnalisation
      </motion.button>
    </div>
  );
}
