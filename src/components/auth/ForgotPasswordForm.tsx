import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { FormField } from '../ui/FormField/FormField';
import Button from '../ui/Button/Button';
import { AuthError } from '../ui/AuthError/AuthError';
import { ArrowRight, CheckCircle, Mail } from 'lucide-react';

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
              Email envoyé ! 📧
            </h3>
            <div className="p-4 bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-2xl">
              <p className="text-green-700 dark:text-green-300 text-sm">
                {t('forgotPassword.success')}
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
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              {t('forgotPassword.backToLogin')}
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
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FormField
              label={t('forgotPassword.email')}
              id="email"
              required
              error={errors.email?.message}
              render={(props) => (
                <input
                  {...props}
                  {...register('email')}
                  type="email"
                  placeholder="votre@email.com"
                  className="h-12 w-full rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:outline-none px-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              type="submit"
              className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                  {t('forgotPassword.loading')}
                </>
              ) : (
                <>
                  <Mail className="mr-2 transition-transform group-hover:scale-110" size={20} />
                  {t('forgotPassword.submit')}
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
