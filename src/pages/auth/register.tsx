import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useRouter } from 'next/router';
import useUserStore from '@/store/useUserStore';
import { authService } from '@/services/auth.service';
import { motion } from 'framer-motion';
import { Sparkles, Globe, ArrowLeft, Heart, Star } from 'lucide-react';

/**
 * Register page
 */
export default function RegisterPage() {
  const { t } = useTranslation('pages');
  const router = useRouter();
  const { register, isLoading, error } = useUserStore();

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    termsAccepted: boolean;
  }) => {
    try {
      // Séparer le nom complet en prénom et nom
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await register({
        firstName,
        lastName,
        email: data.email,
        password: data.password,
      });

      // Redirection vers la page de connexion après inscription réussie
      router.push('/auth/login?message=registration-success');
    } catch (error) {
      // L'erreur est déjà gérée dans le store
      console.error("Erreur d'inscription:", error);
    }
  };

  const handleOAuthLogin = async (provider: 'google') => {
    try {
      // Redirection vers Google OAuth avec URL de callback
      const currentUrl = window.location.origin;
      const redirectUrl = `${currentUrl}/auth/callback`;
      authService.redirectToGoogleOAuth(redirectUrl);
    } catch (error) {
      console.error(`Erreur lors de l'authentification ${provider}:`, error);
    }
  };

  return (
    <>
      <Head>
        <title>{t('auth.registerPage.title')}</title>
        <meta name="description" content={t('auth.registerPage.description')} />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-16 right-12 text-purple-200 dark:text-purple-800 opacity-60"
          >
            <Sparkles size={65} />
          </motion.div>

          <motion.div
            animate={{
              y: [15, -15, 15],
              rotate: [0, -3, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-32 left-8 text-pink-200 dark:text-pink-800 opacity-60"
          >
            <Globe size={55} />
          </motion.div>

          <motion.div
            animate={{
              y: [-12, 12, -12],
              rotate: [0, 4, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-40 right-16 text-orange-200 dark:text-orange-800 opacity-60"
          >
            <Heart size={50} />
          </motion.div>

          <motion.div
            animate={{
              y: [8, -8, 8],
              rotate: [0, -2, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-20 left-12 text-yellow-200 dark:text-yellow-700 opacity-60"
          >
            <Star size={45} />
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
              {t('auth.registerPage.backToHome')}
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
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                {t('auth.registerPage.welcome')}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              {t('auth.registerPage.subtitle')}
            </p>
          </motion.div>

          {/* Register Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <RegisterForm
                onSubmit={handleRegister}
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
              {t('auth.registerPage.hasAccount')}{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                {t('auth.registerPage.signIn')}
              </Link>
            </p>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400 pt-4"
            >
              <div className="flex items-center">
                <span className="mr-1">🔒</span>
                {t('auth.registerPage.trustIndicators.secure')}
              </div>
              <div className="flex items-center">
                <span className="mr-1">✨</span>
                {t('auth.registerPage.trustIndicators.free')}
              </div>
              <div className="flex items-center">
                <span className="mr-1">🚀</span>
                {t('auth.registerPage.trustIndicators.instant')}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

/**
 * Get static props for the register page
 */
export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth', 'pages'])),
    },
  };
};
