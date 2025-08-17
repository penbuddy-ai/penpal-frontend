import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Label component props
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Whether the field is required
   */
  required?: boolean;
}

/**
 * Label component with Tailwind styling
 */
const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        className={cn(
          'text-sm font-medium mb-1 block',
          'text-gray-700 dark:text-gray-200',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label };
