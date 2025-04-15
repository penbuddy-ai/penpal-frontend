/**
 * Onboarding Layout Component
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { ProgressBar } from './ProgressBar';
import { useOnboardingStore } from '@/store/onboardingStore';

interface OnboardingLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  steps: {
    id: string;
    title: string;
    isCompleted: boolean;
  }[];
}

export function OnboardingLayout({ title, subtitle, children, steps }: OnboardingLayoutProps) {
  const { currentStep, totalSteps, goToStep } = useOnboardingStore();

  const handleStepClick = (stepIndex: number) => {
    goToStep(stepIndex);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Head>
        <title>{title} - Penpal AI</title>
      </Head>

      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="container mx-auto py-4 px-6">
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Penpal AI</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={steps}
          onStepClick={handleStepClick}
        />

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400">{subtitle}</p>
            )}
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
