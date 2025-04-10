import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Input component props
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error message to display
   */
  error?: string;
}

/**
 * Input component with Tailwind styling
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        className={cn(
          'flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          'border-gray-300 dark:border-gray-600',
          'text-gray-900 dark:text-gray-100',
          'focus:ring-blue-500 dark:focus:ring-blue-400',
          error
            ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400'
            : 'focus:border-blue-500 dark:focus:border-blue-400',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
