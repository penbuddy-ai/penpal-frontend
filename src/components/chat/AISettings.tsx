/**
 * AI Settings Component
 * Allows users to configure AI language, level, and mode for normal conversations
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { SupportedLanguage, LanguageLevel, ChatMode } from '@/types/chat';
import { Settings, BookOpen, Users, Bot, X } from 'lucide-react';

export function AISettings() {
  const aiSettings = useChatStore((state) => state.aiSettings);
  const updateAISettings = useChatStore((state) => state.updateAISettings);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect screen size changes
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const panelContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Settings Panel Container - Centered with Flexbox */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.9 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
              exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.9 }}
              className={`bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg border border-gray-200/60 dark:border-gray-700/60 shadow-2xl rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto pointer-events-auto ${
                isMobile ? 'mx-4' : ''
              }`}
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Paramètres IA
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  aria-label="Fermer"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Configuration pour les conversations normales
              </p>

              {/* Language Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Langue d'apprentissage
                </label>
                <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-1'}`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => updateAISettings({ language: lang.value })}
                      className={`flex items-center gap-3 rounded-lg border transition-all duration-200 ${
                        isMobile ? 'p-3' : 'p-2'
                      } ${
                        aiSettings.language === lang.value
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                          : 'border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 backdrop-blur-sm'
                      }`}
                    >
                      <span className={isMobile ? 'text-xl' : 'text-lg'}>{lang.flag}</span>
                      <span className={`font-medium ${isMobile ? 'text-base' : 'text-sm'}`}>
                        {lang.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Niveau de difficulté
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {levels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => updateAISettings({ level: level.value })}
                      className={`flex flex-col items-start gap-1 rounded-lg border transition-all duration-200 text-left ${
                        isMobile ? 'p-3' : 'p-2'
                      } ${
                        aiSettings.level === level.value
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                          : 'border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 backdrop-blur-sm'
                      }`}
                    >
                      <div className={`font-medium ${isMobile ? 'text-base' : 'text-sm'}`}>
                        {level.label}
                      </div>
                      <div
                        className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-sm' : 'text-xs'}`}
                      >
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
                      onClick={() => updateAISettings({ mode: mode.value })}
                      className={`flex items-start gap-3 rounded-lg border transition-all duration-200 text-left ${
                        isMobile ? 'p-3' : 'p-2'
                      } ${
                        aiSettings.mode === mode.value
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                          : 'border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 backdrop-blur-sm'
                      }`}
                    >
                      <div
                        className={`text-blue-600 dark:text-blue-400 ${isMobile ? 'mt-1' : 'mt-0.5'}`}
                      >
                        {mode.icon}
                      </div>
                      <div>
                        <div className={`font-medium ${isMobile ? 'text-base' : 'text-sm'}`}>
                          {mode.label}
                        </div>
                        <div
                          className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-sm' : 'text-xs'}`}
                        >
                          {mode.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Settings Summary */}
              <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <div
                  className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-sm' : 'text-xs'}`}
                >
                  <span className="font-medium">Configuration actuelle:</span>
                  <br className={isMobile ? 'block' : 'hidden'} />
                  <span className={isMobile ? '' : 'ml-1'}>
                    {aiSettings.language} •{' '}
                    {levels.find((l) => l.value === aiSettings.level)?.label} •{' '}
                    {modes.find((m) => m.value === aiSettings.mode)?.label}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 rounded-lg font-medium transition-all duration-200 ${
          isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm'
        } ${
          isOpen
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-700'
            : 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80'
        } backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 ${
          isMobile ? 'active:scale-95' : 'hover:scale-105'
        }`}
      >
        <Bot size={isMobile ? 20 : 16} />
        <span className={isMobile ? 'hidden sm:inline' : ''}>Paramètres IA</span>
        <span className={isMobile ? 'sm:hidden' : 'hidden'}>IA</span>
        <Settings
          size={isMobile ? 16 : 14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {typeof window !== 'undefined' && createPortal(panelContent, document.body)}
    </>
  );
}
