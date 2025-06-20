/**
 * Demo Limit Display Component
 * Shows message count limit and reset button for development
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { RefreshCw, AlertTriangle, MessageCircle } from 'lucide-react';

export function DemoLimitDisplay() {
  const demoMessageCount = useChatStore((state) => state.demoMessageCount);
  const demoMessageLimit = useChatStore((state) => state.demoMessageLimit);
  const resetDemoConversation = useChatStore((state) => state.resetDemoConversation);
  const canSendMessage = useChatStore((state) => state.canSendDemoMessage());

  const percentage = Math.round((demoMessageCount / demoMessageLimit) * 100);
  const isNearLimit = percentage >= 60; // À partir de 3/5 messages (60%)
  const isAtLimit = demoMessageCount >= demoMessageLimit;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-3 p-3 rounded-xl border backdrop-blur-sm ${
        isAtLimit
          ? 'bg-red-50/80 dark:bg-red-900/20 border-red-200/50 dark:border-red-800/50'
          : isNearLimit
            ? 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-800/50'
            : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-700/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAtLimit ? (
            <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
          ) : (
            <MessageCircle size={16} className="text-blue-600 dark:text-blue-400" />
          )}

          <div>
            <div
              className={`text-sm font-semibold ${
                isAtLimit
                  ? 'text-red-900 dark:text-red-100'
                  : isNearLimit
                    ? 'text-amber-900 dark:text-amber-100'
                    : 'text-blue-900 dark:text-blue-100'
              }`}
            >
              Messages: {demoMessageCount} / {demoMessageLimit}
            </div>

            <div
              className={`text-xs ${
                isAtLimit
                  ? 'text-red-700 dark:text-red-300'
                  : isNearLimit
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-blue-700 dark:text-blue-300'
              }`}
            >
              {isAtLimit
                ? 'Limite atteinte - Utilisez le reset pour continuer'
                : isNearLimit
                  ? 'Vous approchez de la limite'
                  : 'Mode démo avec limite pour le développement'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress bar */}
          <div className="w-20 h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isAtLimit
                  ? 'bg-red-500'
                  : isNearLimit
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {/* Reset button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetDemoConversation}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              isAtLimit
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                : 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 backdrop-blur-sm'
            }`}
            aria-label="Reset la conversation démo"
          >
            <RefreshCw size={12} />
            <span className="hidden sm:inline">Reset</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
