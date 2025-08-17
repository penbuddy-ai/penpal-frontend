import React, { useState, useEffect, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { Input, InputProps } from '../Input/Input';
import { cn } from '@/lib/utils';

/**
 * PasswordInput component props
 */
export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /**
   * Show password strength indicator
   */
  showStrength?: boolean;
  'data-testid'?: string;
}

/**
 * PasswordInput component with toggle to show/hide password
 */
const PasswordInputComponent = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength, 'data-testid': dataTestId, ...props }, ref) => {
    const { t } = useTranslation('auth');
    const [showPassword, setShowPassword] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [strength, setStrength] = useState({
      score: 0,
      label: '',
      color: '',
    });

    // Use useEffect to set isClient to true when component mounts
    useEffect(() => {
      setIsClient(true);
    }, []);

    // Calculate password strength
    useEffect(() => {
      if (typeof props.value !== 'string' || !isClient) return;

      const calculateStrength = (password: string) => {
        if (!password)
          return { score: 0, label: t('passwordStrength.veryWeak'), color: 'bg-red-500' };

        let score = 0;

        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;

        // Character type checks
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        // Determine label and color based on score
        let label = '';
        let color = '';

        switch (true) {
          case score === 0:
            label = t('passwordStrength.veryWeak');
            color = 'bg-red-500';
            break;
          case score <= 2:
            label = t('passwordStrength.weak');
            color = 'bg-red-400';
            break;
          case score <= 3:
            label = t('passwordStrength.medium');
            color = 'bg-yellow-500';
            break;
          case score <= 4:
            label = t('passwordStrength.good');
            color = 'bg-yellow-400';
            break;
          case score <= 5:
            label = t('passwordStrength.strong');
            color = 'bg-green-500';
            break;
          default:
            label = t('passwordStrength.veryStrong');
            color = 'bg-green-400';
        }

        return { score, label, color };
      };

      setStrength(calculateStrength(props.value as string));
    }, [props.value, isClient, t]);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'pr-10', // Space for the toggle button
              className // Apply custom styles passed from parent
            )}
            data-testid={dataTestId}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center justify-center h-full pr-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {showStrength &&
          isClient &&
          props.value &&
          typeof props.value === 'string' &&
          props.value.length > 0 && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('passwordStrength.label')}
                </span>
                <span className="text-xs font-medium">{strength.label}</span>
              </div>
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn('h-full transition-all duration-300', strength.color)}
                  style={{ width: `${(strength.score / 6) * 100}%` }}
                />
              </div>
            </div>
          )}
      </div>
    );
  }
);

PasswordInputComponent.displayName = 'PasswordInput';

export { PasswordInputComponent as PasswordInput };
