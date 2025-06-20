import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { useRouter } from 'next/router';
import useUserStore from '@/store/useUserStore';
import { authService } from '@/services/auth.service';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, ArrowLeft, Users } from 'lucide-react';

/**
 * Login page
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useUserStore();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      // Redirection après connexion réussie
      router.push('/');
    } catch (error) {
      // L'erreur est déjà gérée dans le store
      console.error('Erreur de connexion:', error);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    try {
      if (provider === 'google') {
        // Redirection vers Google OAuth avec URL de callback
        const currentUrl = window.location.origin;
        const redirectUrl = `${currentUrl}/auth/callback`;
        authService.redirectToGoogleOAuth(redirectUrl);
      } else {
        // Pour Apple, on pourrait implémenter une logique similaire
        console.log(`${provider} OAuth non encore implémenté`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'authentification ${provider}:`, error);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion | PenPal</title>
        <meta name="description" content="Connectez-vous à votre compte PenPal" />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [-15, 15, -15],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 left-10 text-blue-200 dark:text-blue-800 opacity-60"
          >
            <MessageCircle size={60} />
          </motion.div>

          <motion.div
            animate={{
              y: [20, -20, 20],
              rotate: [0, -4, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-40 right-10 text-purple-200 dark:text-purple-800 opacity-60"
          >
            <Sparkles size={50} />
          </motion.div>

          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-32 left-20 text-indigo-200 dark:text-indigo-800 opacity-60"
          >
            <Users size={55} />
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 left-8"
          >
            <Link
              href="/"
              className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <ArrowLeft
                className="mr-2 transition-transform group-hover:-translate-x-1"
                size={20}
              />
              Retour à l'accueil
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
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Bon retour !
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Connectez-vous pour continuer vos conversations 💬
            </p>
          </motion.div>

          {/* Login Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <LoginForm
                onSubmit={handleLogin}
                onOAuthLogin={handleOAuthLogin}
                error={error || undefined}
                isLoading={isLoading}
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
              Pas encore de compte ?{' '}
              <Link
                href="/auth/register"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                Créez-en un gratuitement
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}

/**
 * Get static props for the login page
 */
export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };
};
