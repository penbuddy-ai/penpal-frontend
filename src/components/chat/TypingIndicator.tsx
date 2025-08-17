/**
 * Typing Indicator Component
 * Shows when the bot is typing a response
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4 group"
    >
      <div className="flex items-end gap-2 max-w-[75%]">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 bg-gradient-to-br from-blue-500 to-purple-500">
          <Bot className="w-4 h-4 text-white" />
        </div>

        {/* Typing Bubble */}
        <div className="bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl px-4 py-3">
          <div className="flex space-x-1">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0,
              }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.2,
              }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.4,
              }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
