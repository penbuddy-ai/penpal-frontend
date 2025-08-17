import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  percentage: number;
}

/**
 * Progress indicator component for onboarding flow
 */
export function ProgressIndicator({ current, total, percentage }: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      {/* Step counter */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-600">
          Étape {current} sur {total}
        </span>
        <span className="text-sm font-medium text-blue-600">{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-4">
        {Array.from({ length: total }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < current;
          const isCurrent = stepNumber === current;

          return (
            <motion.div
              key={index}
              className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold
                transition-colors duration-200
                ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isCurrent
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                }
              `}
              initial={{ scale: 0.8 }}
              animate={{
                scale: isCurrent ? 1.1 : 1,
                backgroundColor: isCompleted ? '#10B981' : isCurrent ? '#3B82F6' : '#ffffff',
              }}
              transition={{ duration: 0.2 }}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                stepNumber
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressIndicator;
