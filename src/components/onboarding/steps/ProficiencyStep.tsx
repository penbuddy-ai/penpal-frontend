/**
 * Proficiency Step Component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepProps, Language } from '@/types/onboarding';
import { AVAILABLE_LANGUAGES } from '@/data/languages';

export function ProficiencyStep({ data, updateData }: OnboardingStepProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleNativeLanguageSelection = (language: Language) => {
    updateData({ nativeLanguage: language });
  };

  // Filtrer les langues en fonction de la recherche
  const filteredLanguages = AVAILABLE_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          Quelle est votre langue maternelle ?
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Cela nous permet de mieux comprendre votre profil linguistique
        </p>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher votre langue maternelle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
          <svg
            className="absolute left-3 top-3.5 w-4 h-4 text-neutral-500 dark:text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Selected native language */}
      {data.nativeLanguage && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Langue maternelle sélectionnée
          </h3>
          <motion.div
            className="flex items-center px-4 py-3 bg-primary-100 text-primary-800 rounded-lg dark:bg-primary-900/50 dark:text-primary-300"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <span className="text-2xl mr-3">{data.nativeLanguage.flag}</span>
            <div>
              <div className="font-medium">{data.nativeLanguage.name}</div>
              <div className="text-xs opacity-75">{data.nativeLanguage.nativeName}</div>
            </div>
            <button
              onClick={() => updateData({ nativeLanguage: undefined })}
              className="ml-auto text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 p-1"
              aria-label="Supprimer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        </div>
      )}

      {/* Languages list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredLanguages.map((language, index) => {
          const isSelected = data.nativeLanguage?.code === language.code;

          return (
            <motion.button
              key={language.code}
              className={`flex items-center p-3 rounded-md border ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-600'
                  : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
              }`}
              onClick={() => handleNativeLanguageSelection(language)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl mr-3">{language.flag}</span>
              <div className="text-left">
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {language.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {language.nativeName}
                </div>
              </div>
              {isSelected && (
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
          );
        })}
      </div>

      {filteredLanguages.length === 0 && (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          Aucune langue ne correspond à votre recherche
        </div>
      )}
    </div>
  );
}
