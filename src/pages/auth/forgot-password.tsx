import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Shield, Clock, Key } from 'lucide-react';

/**
 * Forgot password page
 */
export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleForgotPassword = async (data: { email: string }) => {
    try {
      setIsLoading(true);
      setError(undefined);

      // TODO: Implement forgot password logic with API
      console.log('Forgot password data:', data);
      // Exemple: await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) });

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
        <title>Mot de passe oublié | PenPal</title>
        <meta
          name="description"
          content="Récupérez l'accès à votre compte PenPal en réinitialisant votre mot de passe"
        />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-indigo-900 dark:to-blue-900"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [-18, 18, -18],
              rotate: [0, 6, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 left-16 text-blue-200 dark:text-blue-800 opacity-60"
          >
            <Mail size={60} />
          </motion.div>

          <motion.div
            animate={{
              y: [12, -12, 12],
              rotate: [0, -4, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-32 right-12 text-indigo-200 dark:text-indigo-800 opacity-60"
          >
            <Shield size={55} />
          </motion.div>

          <motion.div
            animate={{
              y: [-15, 15, -15],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-32 left-20 text-cyan-200 dark:text-cyan-800 opacity-60"
          >
            <Key size={50} />
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
            className="absolute bottom-24 right-24 text-blue-200 dark:text-blue-800 opacity-60"
          >
            <Clock size={45} />
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
              className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft
                className="mr-2 transition-transform group-hover:-translate-x-1"
                size={20}
              />
              Retour à la connexion
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
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Mot de passe oublié ?
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              Pas de problème ! Entrez votre email et nous vous enverrons un lien de
              réinitialisation 📧
            </p>
          </motion.div>

          {/* Forgot Password Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <ForgotPasswordForm
                onSubmit={handleForgotPassword}
                isLoading={isLoading}
                isSuccess={isSuccess}
                error={error}
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
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Connectez-vous
              </Link>
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <Link
                href="/auth/register"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Créez-en un gratuitement
              </Link>
            </p>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="pt-6 text-sm text-gray-500 dark:text-gray-400"
            >
              <p className="max-w-md mx-auto">
                Si vous ne recevez pas l'email, vérifiez votre dossier spam ou contactez notre
                support.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

/**
 * Get static props for the forgot password page
 */
export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };
};
