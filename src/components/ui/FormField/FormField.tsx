import React, { forwardRef } from 'react';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';
import { cn } from '@/lib/utils';

/**
 * Type pour les props passées à la fonction render
 */
type FormFieldRenderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  /**
   * ID pour l'input
   */
  id?: string;
  /**
   * Message d'erreur pour le champ
   */
  error?: string;
  /**
   * Test ID pour le champ
   */
  'data-testid'?: string;
};

/**
 * FormField component props
 */
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label for the field
   */
  label?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * ID for the input
   */
  id?: string;
  /**
   * Error message for the field
   */
  error?: string;
  /**
   * Custom render function to replace the default Input
   */
  render?: (props: FormFieldRenderProps) => React.ReactElement;
  /**
   * Test ID for the field
   */
  'data-testid'?: string;
}

/**
 * FormField component that combines Label and Input
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    { label, error, required, className, id, name, render, 'data-testid': dataTestId, ...props },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className={cn('mb-4', className)}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <div className="w-full">
          {render ? (
            render({
              id: inputId,
              name,
              'aria-required': required,
              'data-testid': dataTestId,
              error,
              ...props,
            })
          ) : (
            <Input
              id={inputId}
              name={name}
              aria-required={required}
              ref={ref}
              data-testid={dataTestId}
              error={error}
              {...props}
            />
          )}
        </div>
      </div>
    );
  }
);

FormField.displayName = 'FormField';
