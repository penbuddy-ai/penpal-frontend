/**
 * Interests Selection Step Component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepProps, UserInterest } from '@/types/onboarding';
import { AVAILABLE_INTERESTS, INTEREST_CATEGORIES, getInterestsByCategory } from '@/data/interests';

export function InterestsStep({ data, updateData }: OnboardingStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Intérêts groupés par catégorie
  const interestsByCategory = getInterestsByCategory();

  const toggleInterest = (interest: UserInterest) => {
    const isSelected = data.interests.some((int) => int.id === interest.id);

    if (isSelected) {
      // Supprimer l'intérêt
      updateData({
        interests: data.interests.filter((int) => int.id !== interest.id),
      });
    } else {
      // Ajouter l'intérêt
      updateData({
        interests: [...data.interests, interest],
      });
    }
  };

  // Filtrer les intérêts en fonction de la recherche
  const filteredInterests = AVAILABLE_INTERESTS.filter(
    (interest) =>
      interest.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedCategory || interest.category === selectedCategory)
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          Quels sont vos centres d'intérêt ?
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Sélectionnez au moins 3 sujets qui vous intéressent pour des conversations plus
          personnalisées
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher un centre d'intérêt..."
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

        <div className="flex-shrink-0">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="w-full md:w-auto p-3 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="">Toutes les catégories</option>
            {INTEREST_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected interests */}
      {data.interests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Intérêts sélectionnés ({data.interests.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.interests.map((interest) => (
              <motion.button
                key={interest.id}
                onClick={() => toggleInterest(interest)}
                className="flex items-center px-3 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium dark:bg-primary-900/50 dark:text-primary-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{interest.name}</span>
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

      {/* Interests list */}
      {searchQuery || selectedCategory ? (
        // Affichage des résultats de recherche
        <div>
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
            Résultats de recherche
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredInterests.map((interest, index) => {
              const isSelected = data.interests.some((int) => int.id === interest.id);

              return (
                <motion.button
                  key={interest.id}
                  className={`p-3 rounded-md border text-center ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-600'
                      : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
                  }`}
                  onClick={() => toggleInterest(interest)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {interest.name}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {filteredInterests.length === 0 && (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              Aucun intérêt ne correspond à votre recherche
            </div>
          )}
        </div>
      ) : (
        // Affichage par catégories
        <div>
          {interestsByCategory.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                {category.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {category.interests.map((interest, interestIndex) => {
                  const isSelected = data.interests.some((int) => int.id === interest.id);

                  return (
                    <motion.button
                      key={interest.id}
                      className={`p-3 rounded-md border text-center ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-600'
                          : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
                      }`}
                      onClick={() => toggleInterest(interest)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: interestIndex * 0.03 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">
                        {interest.name}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
