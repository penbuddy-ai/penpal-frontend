import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Shield, CheckCircle, Key } from 'lucide-react';

/**
 * Reset password page props
 */
interface ResetPasswordPageProps {
  token: string | null;
}

/**
 * Reset password page
 */
export default function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  const { t } = useTranslation('pages');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleResetPassword = async (data: { password: string }) => {
    try {
      setIsLoading(true);
      setError(undefined);

      if (!token) {
        throw new Error('Token invalide');
      }

      // TODO: Implement reset password logic with API
      console.log('Reset password data:', { ...data, token });
      // Exemple: await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   body: JSON.stringify({ ...data, token })
      // });

      // Simuler un délai pour l'exemple
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Réinitialiser le mot de passe | PenPal</title>
        <meta
          name="description"
          content="Créez un nouveau mot de passe sécurisé pour votre compte PenPal"
        />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [-16, 16, -16],
              rotate: [0, 4, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-24 left-12 text-green-200 dark:text-green-800 opacity-60"
          >
            <Lock size={58} />
          </motion.div>

          <motion.div
            animate={{
              y: [14, -14, 14],
              rotate: [0, -3, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-16 right-16 text-emerald-200 dark:text-emerald-800 opacity-60"
          >
            <Shield size={52} />
          </motion.div>

          <motion.div
            animate={{
              y: [-12, 12, -12],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-36 left-16 text-teal-200 dark:text-teal-800 opacity-60"
          >
            <Key size={48} />
          </motion.div>

          <motion.div
            animate={{
              y: [10, -10, 10],
              rotate: [0, -2, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-20 right-20 text-green-200 dark:text-green-800 opacity-60"
          >
            <CheckCircle size={55} />
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          {/* Back to Login Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 left-8"
          >
            <Link
              href="/auth/login"
              className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <ArrowLeft
                className="mr-2 transition-transform group-hover:-translate-x-1"
                size={20}
              />
              {t('auth.resetPasswordPage.backToLogin')}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Nouveau mot de passe
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              Créez un mot de passe sécurisé pour protéger votre compte 🔐
            </p>
          </motion.div>

          {/* Reset Password Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <ResetPasswordForm
                onSubmit={handleResetPassword}
                isLoading={isLoading}
                isSuccess={isSuccess}
                error={error}
                token={token || undefined}
              />
            </div>
          </motion.div>

          {/* Bottom Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-8 space-y-4"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                Connectez-vous
              </Link>
            </p>

            {/* Security Tips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="pt-6"
            >
              <div className="max-w-md mx-auto p-4 bg-green-50/50 dark:bg-green-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center">
                  <Shield size={16} className="mr-2" />
                  Conseils de sécurité
                </h3>
                <ul className="text-xs text-green-700 dark:text-green-400 space-y-1">
                  <li>• Utilisez au moins 8 caractères</li>
                  <li>• Mélangez majuscules, minuscules et chiffres</li>
                  <li>• Ajoutez des caractères spéciaux</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

/**
 * Get server side props for the reset password page
 */
export const getServerSideProps: GetServerSideProps = async ({ locale = 'fr', query }) => {
  const { token } = query;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
      token: typeof token === 'string' ? token : null,
    },
  };
};
