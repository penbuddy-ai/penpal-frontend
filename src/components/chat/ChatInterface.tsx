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
import { useChatStore } from '@/store/chatStore';
import { MessageCircle, Sparkles } from 'lucide-react';

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
        <div className="max-w-4xl mx-auto flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {currentConversation.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Langue: {currentConversation.language}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Messages Area - Takes all available space */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {currentConversation.messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MessageBubble message={message} />
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
