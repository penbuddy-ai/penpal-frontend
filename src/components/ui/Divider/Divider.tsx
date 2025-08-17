import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Divider component props
 */
export interface DividerProps {
  /**
   * Optional text to display in the middle of the divider
   */
  text?: string;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Divider component for separating content
 */
export function Divider({ text, className }: DividerProps) {
  const [isClient, setIsClient] = useState(false);

  // Résoudre le problème d'hydratation en retardant le rendu côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!text || !isClient) {
    return <hr className={cn('border-t border-gray-200 dark:border-gray-700 my-6', className)} />;
  }

  return (
    <div className={cn('relative flex items-center my-6', className)}>
      <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
      <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">{text}</span>
      <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
    </div>
  );
}
