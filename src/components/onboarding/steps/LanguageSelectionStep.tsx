import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';
import { POPULAR_LANGUAGES } from '@/types/onboarding';
import { Languages, Star } from 'lucide-react';

/**
 * Step 2: Learning language selection
 */
export function LanguageSelectionStep() {
  const { data, setLearningLanguage } = useOnboardingStore();

  const handleLanguageSelect = (languageCode: string) => {
    setLearningLanguage(languageCode);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Languages className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Quelle langue souhaitez-vous apprendre ?
        </h3>
        <p className="text-gray-600 text-sm">
          Choisissez la langue que vous voulez maîtriser. Vous pourrez ajouter d'autres langues plus
          tard.
        </p>
      </motion.div>

      {/* Popular languages section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
          <h4 className="text-base font-medium text-gray-800">Langues populaires</h4>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {POPULAR_LANGUAGES.map((language, index) => (
            <motion.button
              key={language.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => handleLanguageSelect(language.code)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                ${
                  data.learningLanguage === language.code
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              {/* Selection indicator */}
              {data.learningLanguage === language.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              )}

              {/* Flag and language info */}
              <div className="text-center">
                <div className="text-3xl mb-2">{language.flag}</div>
                <h5 className="font-semibold text-gray-900 mb-1 text-sm">{language.name}</h5>
                <p className="text-xs text-gray-500">{language.nativeName}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default LanguageSelectionStep;
