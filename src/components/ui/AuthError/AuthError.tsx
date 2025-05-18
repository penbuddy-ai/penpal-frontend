import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AuthError component props
 */
export interface AuthErrorProps {
  /**
   * Error message to display
   */
  message?: string;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * AuthError component for displaying authentication errors
 */
export function AuthError({ message, className }: AuthErrorProps) {
  const [isClient, setIsClient] = useState(false);

  // Résoudre le problème d'hydratation en retardant le rendu côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!message) return null;
  if (!isClient) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md dark:bg-red-900/20 dark:text-red-400',
        className
      )}
    >
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
