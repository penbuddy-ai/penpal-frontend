import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FormField } from '../ui/FormField/FormField';
import { PasswordInput } from '../ui/PasswordInput/PasswordInput';
import Button from '../ui/Button/Button';
import { AuthError } from '../ui/AuthError/AuthError';
import { ArrowRight, CheckCircle, AlertTriangle, Lock } from 'lucide-react';

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
      <div className="w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center"
          >
            <AlertTriangle className="text-white" size={32} />
          </motion.div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('resetPassword.invalidLink')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('resetPassword.invalidLinkMessage')}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              {t('resetPassword.requestNewLink')}
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <AuthError message={authError} />

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="text-white" size={32} />
          </motion.div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Mot de passe mis à jour ! 🎉
            </h3>
            <div className="p-4 bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-2xl">
              <p className="text-green-700 dark:text-green-300 text-sm">
                {t('resetPassword.success')}
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/auth/login"
              className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
            >
              {t('resetPassword.loginWithNewPassword')}
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5"
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
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
                  className="h-12 rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-green-500 dark:focus:border-green-400 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-green-500/20 dark:focus:ring-green-400/20"
                />
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FormField
              label={t('resetPassword.confirmPassword')}
              id="confirmPassword"
              required
              error={errors.confirmPassword?.message}
              render={(props) => (
                <input
                  {...props}
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-green-500 dark:focus:border-green-400 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:outline-none px-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              type="submit"
              className="w-full group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                  {t('resetPassword.loading')}
                </>
              ) : (
                <>
                  <Lock className="mr-2 transition-transform group-hover:scale-110" size={20} />
                  {t('resetPassword.submit')}
                  <ArrowRight
                    className="ml-2 transition-transform group-hover:translate-x-1"
                    size={20}
                  />
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      )}
    </div>
  );
}
