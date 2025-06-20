/**
 * Message Input Component
 * Allows users to type and send messages
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { Send, Mic, Paperclip, Smile } from 'lucide-react';

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
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-4"
    >
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex-shrink-0"
          aria-label="Joindre un fichier"
          title="Joindre un fichier"
        >
          <Paperclip size={18} />
        </motion.button>

        <div className="flex-1 relative">
          {/* Input Container */}
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-xl focus-within:border-blue-500/60 dark:focus-within:border-blue-400/60 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20 transition-all duration-300">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              className="w-full bg-transparent px-4 py-3 pr-16 focus:outline-none focus:ring-0 focus:border-transparent resize-none min-h-[44px] max-h-[120px] leading-relaxed text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
              rows={1}
              disabled={isTyping}
              style={{ outline: 'none', boxShadow: 'none' }}
            />

            {/* Action Buttons */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <motion.button
                whileHover={{ scale: message.trim() ? 1.1 : 1 }}
                whileTap={{ scale: message.trim() ? 0.9 : 1 }}
                onClick={handleSendMessage}
                disabled={message.trim() === '' || isTyping}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  message.trim() === '' || isTyping
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg'
                }`}
                aria-label="Envoyer"
                title="Envoyer"
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 p-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 flex-shrink-0"
          aria-label="Enregistrer un message vocal"
          title="Enregistrer un message vocal"
        >
          <Mic size={18} />
        </motion.button>
      </div>

      {/* Status text - Only shows when typing */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2 pb-1"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-1.5 h-1.5 bg-purple-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-1.5 h-1.5 bg-pink-500 rounded-full"
              />
            </div>
            <span>Penpal est en train d'écrire...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
