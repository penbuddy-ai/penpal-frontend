/**
 * Chat Interface Component
 * Main component for the chat functionality
 */

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { DemoSettings } from './DemoSettings';
import { DemoLimitDisplay } from './DemoLimitDisplay';
import { useHydratedChatStore } from '@/hooks/useHydratedChatStore';
import { MessageCircle, Sparkles, AlertCircle } from 'lucide-react';

export function ChatInterface() {
  const {
    getCurrentConversation,
    isTyping,
    error,
    setError,
    isHydrated,
    isCurrentConversationDemo,
  } = useHydratedChatStore();

  const currentConversation = getCurrentConversation();
  const isDemoMode = isCurrentConversationDemo();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when bot is typing
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages, isTyping]);

  // Wait for hydration to avoid SSR/client mismatches
  if (!isHydrated) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-400">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!currentConversation) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Aucune conversation active
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Commencez une nouvelle conversation pour pratiquer vos compétences linguistiques.
            </p>
          </motion.div>
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 border-b border-gray-200/50 dark:border-gray-700/50 p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {currentConversation.title}
                  {isDemoMode && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      Démo
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Langue: {currentConversation.language}
                </p>
              </div>
            </div>
            {/* Only show demo settings for demo conversations */}
            {isDemoMode && <DemoSettings />}
          </div>
          {/* Only show demo limit display for demo conversations */}
          {isDemoMode && <DemoLimitDisplay />}
        </div>
      </motion.div>

      {/* Messages Area - Takes all available space */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={16}
                  className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="text-sm text-red-700 dark:text-red-300 mb-2">{error}</div>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {currentConversation.messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MessageBubble
                  message={message}
                  messageCorrections={currentConversation.messageCorrections?.[message.id]}
                />
              </motion.div>
            ))}

            {isTyping && <TypingIndicator />}

            {/* Used to scroll to bottom */}
            <div ref={messagesEndRef} />
          </motion.div>
        </div>
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="flex-shrink-0">
        <MessageInput />
      </div>
    </div>
  );
}
