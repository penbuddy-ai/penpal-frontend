import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AuthError component props
 */
export interface AuthErrorProps {
  /**
   * Error message to display
   */
  message?: string;
  /**
   * Type of message (error or success)
   */
  type?: 'error' | 'success';
  /**
   * Whether the message can be dismissed
   */
  dismissible?: boolean;
  /**
   * Callback when the message is dismissed
   */
  onDismiss?: () => void;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * AuthError component for displaying authentication errors and success messages
 */
export function AuthError({
  message,
  type = 'error',
  dismissible = false,
  onDismiss,
  className,
}: AuthErrorProps) {
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Résoudre le problème d'hydratation en retardant le rendu côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsVisible(!!message);
  }, [message]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isClient) return null;

  const isError = type === 'error';
  const Icon = isError ? AlertCircle : CheckCircle;

  const baseClasses = isError
    ? 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
    : 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex items-center justify-between gap-3 p-4 text-sm rounded-xl border backdrop-blur-sm shadow-sm',
            baseClasses,
            className
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{message}</span>
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
