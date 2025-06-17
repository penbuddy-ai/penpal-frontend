import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';
import { PROFICIENCY_LEVELS, POPULAR_LANGUAGES } from '@/types/onboarding';
import { GraduationCap } from 'lucide-react';

/**
 * Step 3: Proficiency level selection
 */
export function ProficiencyLevelStep() {
  const { data, setProficiencyLevel } = useOnboardingStore();

  const selectedLanguage = POPULAR_LANGUAGES.find((lang) => lang.code === data.learningLanguage);

  const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setProficiencyLevel(level);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-4"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Quel est votre niveau actuel en {selectedLanguage?.name} ?
        </h3>
        <p className="text-gray-600">
          Cette information nous aidera à adapter les conversations et exercices à votre niveau.
        </p>
      </motion.div>

      {/* Proficiency levels */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        {Object.entries(PROFICIENCY_LEVELS).map(([level, info], index) => (
          <motion.button
            key={level}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            onClick={() => handleLevelSelect(level as 'beginner' | 'intermediate' | 'advanced')}
            className={`
              w-full p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02]
              ${
                data.proficiencyLevel === level
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-center gap-4">
              {/* Icon and selection indicator */}
              <div className="relative">
                <div
                  className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-2xl
                  ${
                    data.proficiencyLevel === level
                      ? 'bg-purple-100 ring-4 ring-purple-200'
                      : 'bg-gray-100'
                  }
                `}
                >
                  {info.icon}
                </div>

                {data.proficiencyLevel === level && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>

              {/* Level info */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{info.label}</h4>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>

              {/* Arrow indicator */}
              <div
                className={`
                transition-colors duration-200
                ${data.proficiencyLevel === level ? 'text-purple-500' : 'text-gray-300'}
              `}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
      {/* Additional info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-4 text-center text-sm text-gray-500 space-y-2"
      >
        <p>
          💡 Ne vous inquiétez pas si vous hésitez entre deux niveaux - vous pourrez toujours
          ajuster plus tard.
        </p>
      </motion.div>
    </div>
  );
}

export default ProficiencyLevelStep;
