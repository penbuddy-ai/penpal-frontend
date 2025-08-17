import React from 'react';
import { cn } from '@/lib/utils';

/**
 * OAuthButton component props
 */
export interface OAuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * OAuth provider name
   */
  provider: 'google' | 'apple';
  /**
   * Icon to display
   */
  icon?: React.ReactNode;
  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * OAuthButton component for OAuth authentication
 */
export function OAuthButton({ provider, icon, children, className, ...props }: OAuthButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-2',
        provider === 'google'
          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500'
          : 'border-gray-300 dark:border-gray-600 bg-black dark:bg-black text-white hover:bg-gray-800 focus:ring-gray-500',
        className
      )}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
