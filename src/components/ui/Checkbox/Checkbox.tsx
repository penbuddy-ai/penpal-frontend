import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

/**
 * Checkbox component props
 */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label for the checkbox
   */
  label?: React.ReactNode;
  /**
   * Error message to display
   */
  error?: string;
}

/**
 * Checkbox component with Tailwind styling
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, onChange, checked, defaultChecked, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState<boolean>(Boolean(checked || defaultChecked));

    useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only update internal state if it's not a controlled component
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }

      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              type="checkbox"
              className="absolute w-5 h-5 opacity-0 cursor-pointer"
              ref={ref}
              checked={isChecked}
              onChange={handleChange}
              {...props}
            />
            <div
              className={cn(
                'h-5 w-5 rounded border flex items-center justify-center transition-colors',
                isChecked
                  ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600',
                props.disabled && 'opacity-50 cursor-not-allowed',
                error && 'border-red-500 dark:border-red-400',
                className
              )}
            >
              {isChecked && <Check className="h-3 w-3 text-white" />}
            </div>
          </div>
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label
              htmlFor={props.id}
              className={cn(
                'text-gray-700 dark:text-gray-200',
                props.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
            {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
