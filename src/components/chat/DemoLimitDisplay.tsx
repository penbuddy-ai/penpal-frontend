/**
 * Demo Limit Display Component
 * Shows message count limit and reset button for development
 */

import React from 'react';
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
    <div
      className={`p-2 rounded-lg border ${
        isAtLimit
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          : isNearLimit
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
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
              className={`text-base font-bold ${
                isAtLimit
                  ? 'text-red-900 dark:text-red-100'
                  : isNearLimit
                    ? 'text-orange-900 dark:text-orange-100'
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
                    ? 'text-orange-700 dark:text-orange-300'
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
          <div className="w-20 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {/* Reset button */}
          <button
            onClick={resetDemoConversation}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              isAtLimit
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
            aria-label="Reset la conversation démo"
          >
            <RefreshCw size={12} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
