/**
 * Typing Indicator Component
 * Shows when the bot is typing a response
 */

import React from 'react';
import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-none max-w-[75%] rounded-2xl px-4 py-3">
        <div className="flex space-x-2">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: 0,
            }}
            className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: 0.2,
            }}
            className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: 0.4,
            }}
            className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500"
          />
        </div>
      </div>
    </div>
  );
}
