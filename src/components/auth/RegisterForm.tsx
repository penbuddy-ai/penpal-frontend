import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FormField } from '../ui/FormField/FormField';
import { PasswordInput } from '../ui/PasswordInput/PasswordInput';
import Button from '../ui/Button/Button';
import { Divider } from '../ui/Divider/Divider';
import { OAuthButton } from '../ui/OAuthButton/OAuthButton';
import { AuthError } from '../ui/AuthError/AuthError';
import { Checkbox } from '../ui/Checkbox/Checkbox';

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
  onOAuthLogin?: (provider: 'google' | 'apple') => Promise<void>;
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

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    try {
      setAuthError(undefined);
      await onOAuthLogin?.(provider);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : t('errors.default'));
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {isClient ? (
        <>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('register.title')}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('register.welcome')}</p>
          </div>

          <AuthError message={authError} />

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              label={t('register.fullName')}
              id="name"
              type="text"
              placeholder="Jean Dupont"
              required
              error={errors.name?.message}
              data-testid="name-input"
              {...register('name')}
            />

            <FormField
              label={t('register.email')}
              id="email"
              type="email"
              placeholder="votre@email.com"
              required
              error={errors.email?.message}
              data-testid="email-input"
              {...register('email')}
            />

            <FormField
              label={t('register.password')}
              id="password"
              required
              error={errors.password?.message}
              render={(props) => (
                <PasswordInput
                  {...props}
                  {...register('password')}
                  placeholder="••••••••"
                  showStrength
                  data-testid="password-input"
                />
              )}
            />

            <div className="pt-2">
              <Checkbox
                id="termsAccepted"
                label={
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {t('register.termsAccept')}{' '}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {t('register.termsLink')}
                    </Link>{' '}
                    {t('register.and')}{' '}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {t('register.privacyLink')}
                    </Link>
                  </span>
                }
                error={errors.termsAccepted?.message}
                {...register('termsAccepted')}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
              {isLoading ? t('register.loading') : t('register.submit')}
            </Button>
          </form>

          <Divider text={t('register.divider')} />

          <div className="space-y-3">
            <OAuthButton
              provider="google"
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
              {t('register.googleRegister')}
            </OAuthButton>

            <OAuthButton
              provider="apple"
              icon={
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                </svg>
              }
              onClick={() => handleOAuthLogin('apple')}
              disabled={isLoading}
            >
              {t('register.appleRegister')}
            </OAuthButton>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              {t('register.hasAccount')}{' '}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t('register.signIn')}
              </Link>
            </p>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          {/* Placeholder when rendering on server */}
        </div>
      )}
    </div>
  );
}
