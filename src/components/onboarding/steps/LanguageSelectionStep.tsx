/**
 * Language Selection Step Component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepProps, LanguageWithLevel } from '@/types/onboarding';
import { AVAILABLE_LANGUAGES } from '@/data/languages';

export function LanguageSelectionStep({ data, updateData }: OnboardingStepProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleLanguageSelection = (language: (typeof AVAILABLE_LANGUAGES)[0]) => {
    // Vérifier si la langue est déjà sélectionnée
    const isSelected = data.targetLanguages.some((lang) => lang.code === language.code);

    if (isSelected) {
      // Supprimer la langue
      const updatedLanguages = data.targetLanguages.filter((lang) => lang.code !== language.code);
      updateData({ targetLanguages: updatedLanguages });
    } else {
      // Ajouter la langue avec un niveau débutant par défaut
      const newLanguage: LanguageWithLevel = {
        ...language,
        level: 'beginner',
      };

      updateData({
        targetLanguages: [...data.targetLanguages, newLanguage],
      });
    }
  };

  // Filtrer les langues en fonction de la recherche
  const filteredLanguages = AVAILABLE_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une langue..."
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

      {/* Selected languages */}
      {data.targetLanguages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Langues sélectionnées
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.targetLanguages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => handleLanguageSelection(lang)}
                className="flex items-center px-3 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium dark:bg-primary-900/50 dark:text-primary-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{lang.flag}</span>
                <span>{lang.name}</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Available languages list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredLanguages.map((language, index) => {
          const isSelected = data.targetLanguages.some((lang) => lang.code === language.code);

          return (
            <motion.button
              key={language.code}
              className={`flex items-center p-3 rounded-md border ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-600'
                  : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
              }`}
              onClick={() => handleLanguageSelection(language)}
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
