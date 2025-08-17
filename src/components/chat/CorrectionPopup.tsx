/**
 * CorrectionPopup Component
 * Displays corrections in an interactive popup overlay
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, BookOpen, Lightbulb } from 'lucide-react';
import { MessageCorrections } from '@/types/chat';

interface CorrectionPopupProps {
  corrections: MessageCorrections;
  originalText: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CorrectionPopup({
  corrections,
  originalText,
  isOpen,
  onClose,
}: CorrectionPopupProps) {
  const [activeTab, setActiveTab] = useState<'corrections' | 'explanation'>('corrections');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Popup Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                      Suggestions d'amélioration
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {corrections.hasErrors
                        ? `${corrections.errors.length} suggestion(s) trouvée(s)`
                        : 'Excellent travail !'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-neutral-500 dark:text-neutral-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => setActiveTab('corrections')}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'corrections'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  Suggestions détaillées
                </button>
                <button
                  onClick={() => setActiveTab('explanation')}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'explanation'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  Explication
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === 'corrections' && (
                  <div className="space-y-6">
                    {/* Original vs Corrected Text */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          <AlertCircle size={16} className="text-amber-500" />
                          Texte original
                        </h3>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <p className="text-neutral-900 dark:text-neutral-100">{originalText}</p>
                        </div>
                      </div>

                      {corrections.correctedText !== originalText && (
                        <div>
                          <h3 className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            <CheckCircle size={16} className="text-green-500" />
                            Texte corrigé
                          </h3>
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-neutral-900 dark:text-neutral-100">
                              {corrections.correctedText}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Individual Corrections */}
                    {corrections.errors.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                          <Lightbulb size={16} className="text-blue-500" />
                          Suggestions détaillées
                        </h3>
                        <div className="space-y-3">
                          {corrections.errors.map((error, index) => (
                            <CorrectionItem key={index} correction={error} index={index} />
                          ))}
                        </div>
                      </div>
                    )}

                    {!corrections.hasErrors && (
                      <div className="text-center py-8">
                        <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                          Excellent travail !
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400">
                          Votre texte ne contient pas d'erreurs grammaticales significatives.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'explanation' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Lightbulb
                          size={20}
                          className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                        />
                        <div>
                          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                            Résumé des suggestions
                          </h3>
                          <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                            {corrections.explanation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {corrections.hasErrors && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                          💡 Conseils pour améliorer
                        </h4>
                        <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
                          <li>• Relisez votre texte avant de l'envoyer</li>
                          <li>• Pratiquez les règles grammaticales identifiées</li>
                          <li>• N'hésitez pas à demander des explications supplémentaires</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Les suggestions se concentrent sur la grammaire et le vocabulaire importants
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Compris !
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface CorrectionItemProps {
  correction: string;
  index: number;
}

function CorrectionItem({ correction, index }: CorrectionItemProps) {
  // Clean up the correction text by removing markdown formatting
  const cleanCorrection = correction
    .replace(/^\s*-\s*\*\*[^*]+\*\*:\s*/, '') // Remove "- **Error**:" prefix
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
    .trim();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
          {index + 1}
        </div>
        <div className="flex-1">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {cleanCorrection}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
