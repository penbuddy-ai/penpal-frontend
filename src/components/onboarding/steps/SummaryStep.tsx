import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';
import { PROFICIENCY_LEVELS, POPULAR_LANGUAGES } from '@/types/onboarding';
import { CheckCircle, Edit3, Sparkles } from 'lucide-react';
import { useRouter } from 'next/router';

/**
 * Step 4: Summary and confirmation
 */
export function SummaryStep() {
  const { data, goToStep, isLoading } = useOnboardingStore();
  const router = useRouter();

  const selectedLanguage = POPULAR_LANGUAGES.find((lang) => lang.code === data.learningLanguage);
  const proficiencyInfo = PROFICIENCY_LEVELS[data.proficiencyLevel];

  const summaryItems = [
    {
      label: 'Nom préféré',
      value: data.preferredName,
      icon: '👋',
      editStep: 0,
      description: 'Comment vous souhaitez être appelé',
    },
    {
      label: "Langue d'apprentissage",
      value: selectedLanguage ? `${selectedLanguage.flag} ${selectedLanguage.name}` : 'Non défini',
      icon: '🌍',
      editStep: 1,
      description: 'La langue que vous voulez maîtriser',
    },
    {
      label: 'Niveau de compétence',
      value: `${proficiencyInfo?.icon} ${proficiencyInfo?.label}`,
      icon: '🎓',
      editStep: 2,
      description: proficiencyInfo?.description || 'Niveau non défini',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Celebration illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Fantastique, {data.preferredName} ! 🎉
        </h3>
        <p className="text-lg text-gray-600">
          Voici un récapitulatif de vos préférences. Tout est correct ?
        </p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 mb-8"
      >
        {summaryItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.label}</h4>
                  <p className="text-lg text-gray-800 font-medium">{item.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
              </div>

              <button
                onClick={() => goToStep(item.editStep)}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Modifier</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* What's next section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Et maintenant ?</h4>
            <div className="space-y-2 text-blue-800">
              <p className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Nous allons personnaliser votre expérience d'apprentissage
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Vous serez redirigé vers l'interface de conversation
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Votre premier AI companion sera configuré selon vos préférences
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Vous pourrez modifier ces paramètres à tout moment dans votre profil
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Motivational message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center bg-green-50 rounded-xl p-6 border border-green-200"
      >
        <h4 className="font-semibold text-green-900 mb-2">
          Prêt pour cette aventure linguistique ? 🚀
        </h4>
        <p className="text-green-700">
          Vous allez adorer apprendre le {selectedLanguage?.name.toLowerCase()} avec Penpal ! Nos
          conversations adaptées à votre niveau vous aideront à progresser naturellement.
        </p>
      </motion.div>

      {/* Loading state */}
      {isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-lg text-blue-700">
            <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="font-medium">Configuration de votre profil en cours...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default SummaryStep;
