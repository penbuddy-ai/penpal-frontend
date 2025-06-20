/**
 * Message Bubble Component
 * Displays a single chat message with styling based on sender
 */

import React, { useState, useEffect } from 'react';
import { ChatMessage, Correction, Suggestion, MessageCorrections } from '@/types/chat';
import { motion } from 'framer-motion';
import { CorrectionPopup } from './CorrectionPopup';
import { Lightbulb } from 'lucide-react';

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
        className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div
          className={`max-w-[75%] rounded-2xl px-4 py-3 relative ${
            isBot
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-none'
              : 'bg-primary-600 text-white rounded-tr-none'
          }`}
        >
          {message.content}

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
      <span className="line-through text-red-500 dark:text-red-400">{correction.originalText}</span>
      {' → '}
      <span className="text-green-500 dark:text-green-400">{correction.correctedText}</span>
      <p className="text-xs italic mt-1">{correction.explanation}</p>
    </div>
  );
}

function SuggestionItem({ suggestion }: { suggestion: Suggestion }) {
  return (
    <button className="text-sm bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-300 px-3 py-1 rounded-full border border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-neutral-600 transition-colors">
      {suggestion.text}
    </button>
  );
}
