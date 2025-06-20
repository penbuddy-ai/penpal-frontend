/**
 * Chat Interface Component
 * Main component for the chat functionality
 */

import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { DemoSettings } from './DemoSettings';
import { DemoLimitDisplay } from './DemoLimitDisplay';
import { useChatStore } from '@/store/chatStore';
import { Bot, AlertCircle } from 'lucide-react';

export function ChatInterface() {
  const currentConversation = useChatStore((state) => state.getCurrentConversation());
  const isTyping = useChatStore((state) => state.isTyping);
  const error = useChatStore((state) => state.error);
  const setError = useChatStore((state) => state.setError);
  const sendDemoMessage = useChatStore((state) => state.sendDemoMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when bot is typing
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages, isTyping]);

  if (!currentConversation) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <p className="text-neutral-500 dark:text-neutral-400">
          Aucune conversation active. Commencez une nouvelle conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-primary-600" />
                  <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    {currentConversation.title}
                  </h2>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Démonstration AI • Langue: {currentConversation.language}
                </p>
              </div>
              <DemoSettings />
            </div>

            {/* Demo Limit Display dans le header */}
            <DemoLimitDisplay />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
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
            </div>
          )}

          {currentConversation.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              messageCorrections={currentConversation.messageCorrections?.[message.id]}
            />
          ))}

          {isTyping && <TypingIndicator />}

          {/* Used to scroll to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
}
