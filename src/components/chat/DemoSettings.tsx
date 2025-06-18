/**
 * Demo Settings Component
 * Allows users to configure AI demo language, level, and mode
 */

import React from 'react';
import { useChatStore } from '@/store/chatStore';
import { SupportedLanguage, LanguageLevel, ChatMode } from '@/types/chat';
import { Settings, BookOpen, Users, Bot } from 'lucide-react';

export function DemoSettings() {
  const demoSettings = useChatStore((state) => state.demoSettings);
  const updateDemoSettings = useChatStore((state) => state.updateDemoSettings);
  const [isOpen, setIsOpen] = React.useState(false);

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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        aria-label="Paramètres de démonstration AI"
      >
        <Settings size={16} />
        <span className="hidden sm:inline">Paramètres AI</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Settings Panel */}
          <div className="absolute top-full right-0 mt-2 w-80 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-20">
            <div className="flex items-center gap-2 mb-4">
              <Bot size={20} className="text-primary-600" />
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                Configuration AI Demo
              </h3>
            </div>

            {/* Language Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Langue d'apprentissage
              </label>
              <div className="grid grid-cols-1 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => updateDemoSettings({ language: lang.value })}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-colors text-left ${
                      demoSettings.language === lang.value
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-900 dark:text-primary-100'
                        : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
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
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Niveau
              </label>
              <div className="grid grid-cols-1 gap-2">
                {levels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => updateDemoSettings({ level: level.value })}
                    className={`p-2 rounded-lg border transition-colors text-left ${
                      demoSettings.level === level.value
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-900 dark:text-primary-100'
                        : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="text-sm font-medium">{level.label}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {level.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mode de conversation
              </label>
              <div className="grid grid-cols-1 gap-2">
                {modes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => updateDemoSettings({ mode: mode.value })}
                    className={`flex items-start gap-3 p-2 rounded-lg border transition-colors text-left ${
                      demoSettings.mode === mode.value
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-900 dark:text-primary-100'
                        : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="mt-0.5">{mode.icon}</div>
                    <div>
                      <div className="text-sm font-medium">{mode.label}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {mode.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Configuration actuelle: {demoSettings.language} •{' '}
                {levels.find((l) => l.value === demoSettings.level)?.label} •{' '}
                {modes.find((m) => m.value === demoSettings.mode)?.label}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
