/**
 * Chat Interface Component
 * Main component for the chat functionality
 */

import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { useChatStore } from '@/store/chatStore';

export function ChatInterface() {
  const currentConversation = useChatStore((state) => state.getCurrentConversation());
  const isTyping = useChatStore((state) => state.isTyping);
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
          <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {currentConversation.title}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Langue: {currentConversation.language}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          {currentConversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
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
