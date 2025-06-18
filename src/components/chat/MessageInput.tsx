/**
 * Message Input Component
 * Allows users to type and send messages
 */

import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Send, Mic, Paperclip } from 'lucide-react';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useChatStore((state) => state.addMessage);
  const isTyping = useChatStore((state) => state.isTyping);
  const canSendMessage = useChatStore((state) => state.canSendDemoMessage());

  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  const sendDemoMessage = useChatStore((state) => state.sendDemoMessage);

  const handleSendMessage = async () => {
    if (message.trim() === '' || isTyping || !canSendMessage) return;

    const messageToSend = message.trim();
    setMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Use AI demo instead of the mock message system
    await sendDemoMessage(messageToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
      <div className="flex items-end gap-2 max-w-4xl mx-auto h-auto">
        <button
          className="text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 p-2 rounded-full transition-colors flex items-center justify-center"
          aria-label="Joindre un fichier"
          title="Joindre un fichier"
        >
          <Paperclip size={20} />
        </button>

        <div className="flex-1 relative flex items-center">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !canSendMessage
                ? 'Limite de messages atteinte - utilisez le reset'
                : 'Écrivez votre message...'
            }
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 dark:text-neutral-100 resize-none min-h-[40px] max-h-[150px] leading-normal"
            rows={1}
            disabled={isTyping || !canSendMessage}
          />
          <div className="absolute right-3 flex items-center">
            <button
              onClick={handleSendMessage}
              disabled={message.trim() === '' || isTyping || !canSendMessage}
              className={`p-1 rounded-full transition-colors flex items-center justify-center ${
                message.trim() === '' || isTyping || !canSendMessage
                  ? 'text-neutral-400 dark:text-neutral-600'
                  : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900'
              }`}
              aria-label="Envoyer"
              title={!canSendMessage ? 'Limite de messages atteinte' : 'Envoyer'}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        <button
          className="text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 p-2 rounded-full transition-colors flex items-center justify-center"
          aria-label="Enregistrer un message vocal"
          title="Enregistrer un message vocal"
        >
          <Mic size={20} />
        </button>
      </div>

      {/* Status text */}
      <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-2 h-4">
        {isTyping && "Penpal est en train d'écrire..."}
      </div>
    </div>
  );
}
