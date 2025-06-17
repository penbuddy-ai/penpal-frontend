import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';
import { User } from 'lucide-react';

/**
 * Step 1: Preferred name input
 */
export function PreferredNameStep() {
  const { data, setPreferredName } = useOnboardingStore();
  const [localName, setLocalName] = useState(data.preferredName);
  const [error, setError] = useState('');

  // Update store when local value changes
  useEffect(() => {
    const trimmedName = localName.trim();
    if (trimmedName.length >= 2) {
      setPreferredName(trimmedName);
      setError('');
    } else if (trimmedName.length > 0) {
      setError('Le nom doit contenir au moins 2 caractères');
    } else {
      setError('');
    }
  }, [localName, setPreferredName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Restrict to letters, spaces, hyphens, and apostrophes
    if (/^[a-zA-ZÀ-ÿ\s\-']*$/.test(value) && value.length <= 50) {
      setLocalName(value);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      {/* Welcome message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Bienvenue sur Penpal ! 🎉</h3>
        <p className="text-gray-600 text-sm">
          Pour commencer, dites-nous comment vous préférez être appelé. Cela nous aidera à
          personnaliser votre expérience d'apprentissage.
        </p>
      </motion.div>

      {/* Input field */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700 mb-2">
            Votre nom préféré
          </label>
          <input
            id="preferredName"
            type="text"
            value={localName}
            onChange={handleInputChange}
            placeholder="Entrez votre nom préféré..."
            className={`
              w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 transition-colors
              ${
                error
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }
            `}
            autoComplete="given-name"
            autoFocus
          />

          {/* Character count */}
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              {error && <span className="text-red-500">{error}</span>}
            </div>
            <div className="text-xs text-gray-400">{localName.length}/50</div>
          </div>
        </div>

        {/* Examples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 rounded-lg p-3"
        >
          <h4 className="text-xs font-medium text-blue-900 mb-2">Exemples :</h4>
          <div className="flex flex-wrap gap-2">
            {['Marie', 'Jean-Pierre', "D'Artagnan", 'Alex'].map((example) => (
              <button
                key={example}
                onClick={() => setLocalName(example)}
                className="px-2 py-1 bg-white text-blue-700 text-xs rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PreferredNameStep;
