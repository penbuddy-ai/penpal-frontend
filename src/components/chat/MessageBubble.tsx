/**
 * Message Bubble Component
 * Displays a single chat message with styling based on sender
 */

import React, { useState, useEffect } from 'react';
import { ChatMessage, Correction, Suggestion, MessageCorrections } from '@/types/chat';
import { motion } from 'framer-motion';
import { Bot, User, Lightbulb } from 'lucide-react';
import { CorrectionPopup } from './CorrectionPopup';

interface MessageBubbleProps {
  message: ChatMessage;
  messageCorrections?: MessageCorrections; // Added for AI demo corrections
}

export function MessageBubble({ message, messageCorrections }: MessageBubbleProps) {
  const isBot = message.sender === 'bot';
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [showCorrectionPopup, setShowCorrectionPopup] = useState(false);

  // Utiliser useEffect pour formatter l'heure côté client seulement
  // Cela évite les erreurs d'hydratation entre le serveur et le client
  useEffect(() => {
    const date = new Date(message.timestamp);
    setFormattedTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [message.timestamp]);

  // Check if we have AI demo corrections to show
  const hasAIDemoCorrections = messageCorrections && messageCorrections.hasErrors;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 group`}
      >
        <div
          className={`flex items-end gap-2 max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}
        >
          {/* Avatar */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              isBot
                ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            }`}
          >
            {isBot ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
          </div>

          {/* Message Content */}
          <div
            className={`rounded-2xl px-4 py-3 relative ${
              isBot
                ? 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50'
                : 'bg-purple-500 text-white shadow-lg'
            }`}
          >
            {/* AI Demo Corrections Indicator for User Messages */}
            {!isBot && hasAIDemoCorrections && (
              <button
                onClick={() => setShowCorrectionPopup(true)}
                className="absolute -top-2 -right-2 p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors group"
                title="Cliquez pour voir les suggestions"
              >
                <Lightbulb size={14} />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {messageCorrections.errors.length} suggestion(s)
                </span>
              </button>
            )}

            <div className="relative">
              {message.content}

              {/* Corrections */}
              {message.corrections && message.corrections.length > 0 && (
                <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <h4 className="text-sm font-medium mb-1">Corrections</h4>
                  {message.corrections.map((correction, index) => (
                    <CorrectionItem key={index} correction={correction} />
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <h4 className="text-sm font-medium mb-1">Suggestions</h4>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <SuggestionItem key={index} suggestion={suggestion} />
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp - Rendu côté client uniquement pour éviter les erreurs d'hydratation */}
              {formattedTime && (
                <div
                  className={`text-xs mt-1 ${isBot ? 'text-neutral-500 dark:text-neutral-400' : 'text-primary-200'}`}
                >
                  {formattedTime}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Demo Correction Popup */}
      {messageCorrections && (
        <CorrectionPopup
          corrections={messageCorrections}
          originalText={message.content}
          isOpen={showCorrectionPopup}
          onClose={() => setShowCorrectionPopup(false)}
        />
      )}
    </>
  );
}

function CorrectionItem({ correction }: { correction: Correction }) {
  return (
    <div className="mb-2 text-sm">
      <span className="line-through text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
        {correction.originalText}
      </span>
      <span className="mx-2 text-gray-500">→</span>
      <span className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg font-medium">
        {correction.correctedText}
      </span>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">
        {correction.explanation}
      </p>
    </div>
  );
}

function SuggestionItem({ suggestion }: { suggestion: Suggestion }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-sm bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200 backdrop-blur-sm"
    >
      {suggestion.text}
    </motion.button>
  );
}
