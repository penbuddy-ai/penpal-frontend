/**
 * Demo Settings Component
 * Allows users to configure AI demo language, level, and mode
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { SupportedLanguage, LanguageLevel, ChatMode } from '@/types/chat';
import { Settings, BookOpen, Users, Bot } from 'lucide-react';

export function DemoSettings() {
  const demoSettings = useChatStore((state) => state.demoSettings);
  const updateDemoSettings = useChatStore((state) => state.updateDemoSettings);
  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonRect, setButtonRect] = React.useState<DOMRect | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const languages: { value: SupportedLanguage; label: string; flag: string }[] = [
    { value: 'English', label: 'English', flag: '🇺🇸' },
    { value: 'French', label: 'Français', flag: '🇫🇷' },
    { value: 'Spanish', label: 'Español', flag: '🇪🇸' },
  ];

  const levels: { value: LanguageLevel; label: string; description: string }[] = [
    { value: 'beginner', label: 'Débutant', description: 'Vocabulaire simple, phrases courtes' },
    { value: 'intermediate', label: 'Intermédiaire', description: 'Conversations quotidiennes' },
    { value: 'advanced', label: 'Avancé', description: 'Discussions complexes' },
  ];

  const modes: { value: ChatMode; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: 'tutor',
      label: 'Tuteur',
      description: 'Corrections et explications détaillées',
      icon: <BookOpen size={16} />,
    },
    {
      value: 'conversation-partner',
      label: 'Partenaire de conversation',
      description: 'Discussion naturelle et fluide',
      icon: <Users size={16} />,
    },
  ];

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
    setIsOpen(!isOpen);
  };

  const panelContent = (
    <AnimatePresence>
      {isOpen && buttonRect && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/10"
            onClick={() => setIsOpen(false)}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="fixed z-[9999] w-80 p-4 bg-white/98 dark:bg-gray-900/98 border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-2xl backdrop-blur-lg"
            style={{
              top: buttonRect.bottom + 8,
              right: window.innerWidth - buttonRect.right,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Bot size={20} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Configuration AI Demo
              </h3>
            </div>

            {/* Language Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Langue d'apprentissage
              </label>
              <div className="grid grid-cols-1 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => updateDemoSettings({ language: lang.value })}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all duration-200 text-left ${
                      demoSettings.language === lang.value
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                        : 'border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 backdrop-blur-sm'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Niveau
              </label>
              <div className="grid grid-cols-1 gap-2">
                {levels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => updateDemoSettings({ level: level.value })}
                    className={`p-2 rounded-lg border transition-all duration-200 text-left ${
                      demoSettings.level === level.value
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                        : 'border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 backdrop-blur-sm'
                    }`}
                  >
                    <div className="text-sm font-medium">{level.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {level.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mode de conversation
              </label>
              <div className="grid grid-cols-1 gap-2">
                {modes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => updateDemoSettings({ mode: mode.value })}
                    className={`flex items-start gap-3 p-2 rounded-lg border transition-all duration-200 text-left ${
                      demoSettings.mode === mode.value
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                        : 'border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 backdrop-blur-sm'
                    }`}
                  >
                    <div className="mt-0.5 text-blue-600 dark:text-blue-400">{mode.icon}</div>
                    <div>
                      <div className="text-sm font-medium">{mode.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {mode.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Configuration actuelle: {demoSettings.language} •{' '}
                {levels.find((l) => l.value === demoSettings.level)?.label} •{' '}
                {modes.find((m) => m.value === demoSettings.mode)?.label}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200 backdrop-blur-sm"
        aria-label="Paramètres de démonstration AI"
      >
        <Settings size={16} className="text-blue-600 dark:text-blue-400" />
        <span className="hidden sm:inline text-blue-700 dark:text-blue-300">Paramètres AI</span>
      </motion.button>

      {/* Portal for the panel */}
      {typeof window !== 'undefined' && createPortal(panelContent, document.body)}
    </>
  );
}
