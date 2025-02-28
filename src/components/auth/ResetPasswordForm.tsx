import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FormField } from '../ui/FormField/FormField';
import { PasswordInput } from '../ui/PasswordInput/PasswordInput';
import Button from '../ui/Button/Button';
import { AuthError } from '../ui/AuthError/AuthError';

/**
 * ResetPasswordForm component props
 */
export interface ResetPasswordFormProps {
  /**
   * Callback called when the form is submitted
   */
  onSubmit?: (data: { password: string }) => Promise<void>;
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
  /**
   * Token from the URL
   */
  token?: string;
}

/**
 * Reset password form component
 */
export function ResetPasswordForm({
  onSubmit,
  error,
  isLoading = false,
  isSuccess = false,
  token,
}: ResetPasswordFormProps) {
  const { t } = useTranslation('auth');
  const [authError, setAuthError] = useState<string | undefined>(error);
  const [submitted, setSubmitted] = useState<boolean>(isSuccess);

  // Schéma de validation pour le formulaire de réinitialisation de mot de passe
  const resetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(8, {
          message: t('validation.minLength', { field: t('resetPassword.newPassword'), count: 8 }),
        })
        .regex(/[A-Z]/, {
          message: t('validation.uppercase', { field: t('resetPassword.newPassword') }),
        })
        .regex(/[a-z]/, {
          message: t('validation.lowercase', { field: t('resetPassword.newPassword') }),
        })
        .regex(/[0-9]/, {
          message: t('validation.number', { field: t('resetPassword.newPassword') }),
        })
        .regex(/[^A-Za-z0-9]/, {
          message: t('validation.specialChar', { field: t('resetPassword.newPassword') }),
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMatch'),
      path: ['confirmPassword'],
    });

  type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setAuthError(undefined);
      await onSubmit?.({ password: data.password });
      setSubmitted(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : t('errors.default'));
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('resetPassword.invalidLink')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {t('resetPassword.invalidLinkMessage')}
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            {t('resetPassword.requestNewLink')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('resetPassword.title')}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {t('resetPassword.welcome')}
        </p>
      </div>

      <AuthError message={authError} />

      {submitted ? (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-green-800 dark:text-green-200 text-sm">
              {t('resetPassword.success')}
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t('resetPassword.loginWithNewPassword')}
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            label={t('resetPassword.newPassword')}
            id="password"
            required
            error={errors.password?.message}
            render={(props) => (
              <PasswordInput
                {...props}
                {...register('password')}
                placeholder="••••••••"
                showStrength
              />
            )}
          />

          <FormField
            label={t('resetPassword.confirmPassword')}
            id="confirmPassword"
            type="password"
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
            {isLoading ? t('resetPassword.loading') : t('resetPassword.submit')}
          </Button>
        </form>
      )}
    </div>
  );
}
