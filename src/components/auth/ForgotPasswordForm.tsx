import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FormField } from '../ui/FormField/FormField';
import Button from '../ui/Button/Button';
import { AuthError } from '../ui/AuthError/AuthError';

/**
 * ForgotPasswordForm component props
 */
export interface ForgotPasswordFormProps {
  /**
   * Callback called when the form is submitted
   */
  onSubmit?: (data: { email: string }) => Promise<void>;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Whether the form is loading
   */
  isLoading?: boolean;
  /**
   * Whether the form has been submitted successfully
   */
  isSuccess?: boolean;
}

/**
 * Forgot password form component
 */
export function ForgotPasswordForm({
  onSubmit,
  error,
  isLoading = false,
  isSuccess = false,
}: ForgotPasswordFormProps) {
  const { t } = useTranslation('auth');
  const [authError, setAuthError] = useState<string | undefined>(error);
  const [submitted, setSubmitted] = useState<boolean>(isSuccess);

  // Schéma de validation pour le formulaire de récupération de mot de passe
  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, { message: t('validation.required', { field: t('forgotPassword.email') }) })
      .email({ message: t('validation.email') }),
  });

  type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setAuthError(undefined);
      await onSubmit?.(data);
      setSubmitted(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : t('errors.default'));
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('forgotPassword.title')}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {t('forgotPassword.welcome')}
        </p>
      </div>

      <AuthError message={authError} />

      {submitted ? (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-green-800 dark:text-green-200 text-sm">
              {t('forgotPassword.success')}
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            label={t('forgotPassword.email')}
            id="email"
            type="email"
            placeholder="votre@email.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
            {isLoading ? t('forgotPassword.loading') : t('forgotPassword.submit')}
          </Button>

          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              {t('forgotPassword.rememberPassword')}{' '}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t('forgotPassword.signIn')}
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
