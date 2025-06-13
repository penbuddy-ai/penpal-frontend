import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useUserStore from '@/store/useUserStore';

/**
 * Page de callback OAuth sécurisé
 */
export default function OAuthCallbackPage() {
  const router = useRouter();
  const { session, error: queryError } = router.query;
  const { handleOAuthCallback, isLoading, error } = useUserStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

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

  return (
    <>
      <Head>
        <title>Authentification | PenPal</title>
        <meta name="description" content="Finalisation de l'authentification" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {(status === 'loading' || isLoading) && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Authentification en cours...
              </h2>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Finalisation de votre connexion sécurisée...
              </p>
            </div>
          )}

          {status === 'success' && !isLoading && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Authentification réussie !
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Vous allez être redirigé vers la page d&apos;accueil...
              </p>
            </div>
          )}

          {(status === 'error' || error) && !isLoading && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Erreur d&apos;authentification
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {error || "Une erreur s'est produite lors de l'authentification."}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vous allez être redirigé vers la page de connexion...
              </p>
            </div>
          )}
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
