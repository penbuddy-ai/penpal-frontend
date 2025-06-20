import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import useUserStore from '@/store/useUserStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react';

/**
 * Page de callback OAuth sécurisé
 */
export default function OAuthCallbackPage() {
  const router = useRouter();
  const { session, error: queryError } = router.query;
  const { handleOAuthCallback, isLoading, error } = useUserStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Vérifier si les paramètres de requête sont disponibles
    if (!router.isReady) return;

    const processOAuthCallback = async () => {
      try {
        // Gérer les erreurs OAuth
        if (queryError) {
          console.error('Erreur OAuth:', queryError);
          setStatus('error');
          setTimeout(() => {
            router.push('/auth/login?error=oauth-error');
          }, 3000);
          return;
        }

        // Vérifier la présence du token de session
        if (!session || typeof session !== 'string') {
          console.error('Token de session manquant');
          setStatus('error');
          setTimeout(() => {
            router.push('/auth/login?error=missing-session');
          }, 3000);
          return;
        }

        // Traiter le callback OAuth avec le token de session
        await handleOAuthCallback(session);
        setStatus('success');

        // Redirection vers la page d'accueil après succès
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (err) {
        console.error('Erreur lors du traitement du callback OAuth:', err);
        setStatus('error');
        setTimeout(() => {
          router.push('/auth/login?error=callback-failed');
        }, 3000);
      }
    };

    processOAuthCallback();
  }, [router, session, queryError, handleOAuthCallback]);

  // Countdown pour les redirections
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>Authentification | PenPal</title>
        <meta name="description" content="Finalisation de l'authentification" />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Dynamic Background based on status */}
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            status === 'loading'
              ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900'
              : status === 'success'
                ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900'
                : 'bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-red-900 dark:to-pink-900'
          }`}
        ></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* Loading State */}
            {(status === 'loading' || isLoading) && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md w-full"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="mx-auto mb-6 w-16 h-16 text-blue-600 dark:text-blue-400"
                  >
                    <Loader2 size={64} />
                  </motion.div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Authentification en cours...
                    </span>
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Finalisation de votre connexion sécurisée
                  </p>

                  <div className="flex justify-center space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {status === 'success' && !isLoading && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-md w-full"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mx-auto mb-6 w-16 h-16 text-green-600 dark:text-green-400"
                  >
                    <CheckCircle size={64} />
                  </motion.div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Authentification réussie !
                    </span>
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Bienvenue ! Vous allez être redirigé vers l'accueil...
                  </p>

                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Redirection dans</span>
                    <motion.span
                      key={countdown}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="font-bold text-green-600 dark:text-green-400"
                    >
                      {countdown}
                    </motion.span>
                    <span>seconde{countdown > 1 ? 's' : ''}</span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4"
                  >
                    <Link
                      href="/"
                      className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                    >
                      Aller à l'accueil maintenant
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {(status === 'error' || error) && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-md w-full"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mx-auto mb-6 w-16 h-16 text-red-600 dark:text-red-400"
                  >
                    <XCircle size={64} />
                  </motion.div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                      Erreur d'authentification
                    </span>
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {error || "Une erreur s'est produite lors de l'authentification."}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Redirection vers la connexion dans {countdown} seconde{countdown > 1 ? 's' : ''}
                    ...
                  </p>

                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-colors"
                    >
                      Retour à la connexion
                      <ArrowRight className="ml-2" size={16} />
                    </Link>

                    <Link
                      href="/"
                      className="inline-flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      <Home className="mr-2" size={16} />
                      Retour à l'accueil
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

/**
 * Get server side props pour la page de callback
 */
export const getServerSideProps: GetServerSideProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };
};
