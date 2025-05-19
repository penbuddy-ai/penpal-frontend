import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuthStore } from '@/store/authStore';

/**
 * Parse les cookies en objet
 */
function parseCookies() {
  if (typeof document === 'undefined') return {};

  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .reduce(
      (acc, cookie) => {
        const [name, value] = cookie.split('=');
        if (name && value) {
          acc[name] = decodeURIComponent(value);
        }
        return acc;
      },
      {} as Record<string, string>
    );
}

/**
 * Page de callback OAuth
 */
export default function OAuthCallbackPage() {
  const router = useRouter();
  const { error, userData } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { user } = useAuthStore();

  useEffect(() => {
    // Vérifier si les paramètres de requête sont disponibles
    if (!router.isReady) return;

    if (error) {
      console.error('OAuth error:', error);
      setStatus('error');
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      return;
    }

    // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
    if (user) {
      router.push('/');
      return;
    }

    // Traiter la réponse OAuth
    handleOAuthCallback();
  }, [router, error, userData, user]);

  /**
   * Function to handle the OAuth callback
   */
  const handleOAuthCallback = () => {
    try {
      if (userData) {
        // Décoder les informations utilisateur depuis le paramètre d'URL
        const decodedUserData = decodeURIComponent(userData as string);
        const parsedUserData = JSON.parse(decodedUserData);

        // Sauvegarder dans localStorage pour la persistance
        localStorage.setItem('user', JSON.stringify(parsedUserData));

        // Mettre à jour le store d'authentification
        useAuthStore.setState({
          user: parsedUserData,
          isLoading: false,
          error: null,
        });

        setStatus('success');

        // Rediriger vers la page d'accueil après un court délai
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        throw new Error("Impossible de récupérer les données utilisateur depuis l'URL");
      }
    } catch (err) {
      console.error('Error handling OAuth response:', err);
      setStatus('error');
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    }
  };

  return (
    <>
      <Head>
        <title>Authentification | PenPal</title>
        <meta name="description" content="Finalisation de l'authentification" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {status === 'loading' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Authentification en cours...
              </h2>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Authentification réussie!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Vous allez être redirigé vers la page d&apos;accueil...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Erreur d&apos;authentification
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Une erreur s&apos;est produite lors de l&apos;authentification. Vous allez être
                redirigé vers la page de connexion...
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
