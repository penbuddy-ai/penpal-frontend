import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { FormField } from '../ui/FormField/FormField';
import { PasswordInput } from '../ui/PasswordInput/PasswordInput';
import Button from '../ui/Button/Button';
import { Divider } from '../ui/Divider/Divider';
import { OAuthButton } from '../ui/OAuthButton/OAuthButton';
import { AuthError } from '../ui/AuthError/AuthError';
import { Checkbox } from '../ui/Checkbox/Checkbox';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * RegisterForm component props
 */
export interface RegisterFormProps {
  /**
   * Callback called when the form is submitted
   */
  onSubmit?: (data: {
    name: string;
    email: string;
    password: string;
    termsAccepted: boolean;
  }) => Promise<void>;
  /**
   * Callback called when OAuth login is clicked
   */
  onOAuthLogin?: (provider: 'google') => Promise<void>;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Whether the form is loading
   */
  isLoading?: boolean;
}

/**
 * Register form component
 */
export function RegisterForm({
  onSubmit,
  onOAuthLogin,
  error,
  isLoading = false,
}: RegisterFormProps) {
  const { t } = useTranslation('auth');
  const [authError, setAuthError] = useState<string | undefined>(error);
  const [isClient, setIsClient] = useState(false);

  // Résoudre le problème d'hydratation en retardant le rendu côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Schéma de validation pour le formulaire d'inscription
  const registerSchema = z.object({
    name: z
      .string()
      .min(2, { message: t('validation.minLength', { field: t('register.fullName'), count: 2 }) })
      .max(50, {
        message: t('validation.maxLength', { field: t('register.fullName'), count: 50 }),
      }),
    email: z
      .string()
      .min(1, { message: t('validation.required', { field: t('register.email') }) })
      .email({ message: t('validation.email') }),
    password: z
      .string()
      .min(8, { message: t('validation.minLength', { field: t('register.password'), count: 8 }) })
      .regex(/[A-Z]/, { message: t('validation.uppercase', { field: t('register.password') }) })
      .regex(/[a-z]/, { message: t('validation.lowercase', { field: t('register.password') }) })
      .regex(/[0-9]/, { message: t('validation.number', { field: t('register.password') }) })
      .regex(/[^A-Za-z0-9]/, {
        message: t('validation.specialChar', { field: t('register.password') }),
      }),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, { message: t('validation.termsAccepted') }),
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: RegisterFormValues) => {
    try {
      setAuthError(undefined);
      await onSubmit?.(data);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : t('errors.default'));
    }
  };

  const handleOAuthLogin = async (provider: 'google') => {
    try {
      setAuthError(undefined);
      await onOAuthLogin?.(provider);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : t('errors.default'));
    }
  };

  return (
    <div className="w-full space-y-6">
      <AuthError message={authError} />

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
            label={isClient ? t('register.fullName') : ''}
            id="name"
            required
            error={errors.name?.message}
            data-testid="name-input"
            render={(props) => (
              <input
                {...props}
                {...register('name')}
                type="text"
                placeholder="Jean Dupont"
                className="h-12 w-full rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:outline-none px-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
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
            label={isClient ? t('register.email') : ''}
            id="email"
            required
            error={errors.email?.message}
            data-testid="email-input"
            render={(props) => (
              <input
                {...props}
                {...register('email')}
                type="email"
                placeholder="votre@email.com"
                className="h-12 w-full rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:outline-none px-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FormField
            label={isClient ? t('register.password') : ''}
            id="password"
            required
            error={errors.password?.message}
            render={(props) => (
              <PasswordInput
                {...props}
                {...register('password')}
                placeholder="••••••••"
                showStrength
                className="h-12 rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
                data-testid="password-input"
              />
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-2"
        >
          <Checkbox
            id="termsAccepted"
            label={
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {isClient ? t('register.termsAccept') : ''}{' '}
                <Link
                  href="/terms"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                >
                  {isClient ? t('register.termsLink') : ''}
                </Link>{' '}
                {isClient ? t('register.and') : ''}{' '}
                <Link
                  href="/privacy"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                >
                  {isClient ? t('register.privacyLink') : ''}
                </Link>
              </span>
            }
            error={errors.termsAccepted?.message}
            {...register('termsAccepted')}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            type="submit"
            className="w-full group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center"
            disabled={!isValid || isLoading}
          >
            {isClient ? (
              isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                  {t('register.loading')}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 transition-transform group-hover:rotate-12" size={20} />
                  {t('register.submit')}
                  <ArrowRight
                    className="ml-2 transition-transform group-hover:translate-x-1"
                    size={20}
                  />
                </>
              )
            ) : (
              ''
            )}
          </Button>
        </motion.div>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Divider
          text={isClient ? t('register.divider') : ''}
          className="text-gray-500 dark:text-gray-400"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="space-y-3"
      >
        <OAuthButton
          provider="google"
          className="w-full group bg-white dark:bg-gray-800 border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 rounded-2xl py-3 px-6 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          }
          onClick={() => handleOAuthLogin('google')}
          disabled={isLoading}
        >
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {isClient ? t('register.googleSignup') : ''}
          </span>
        </OAuthButton>
      </motion.div>
    </div>
  );
}
