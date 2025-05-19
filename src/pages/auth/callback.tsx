import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

/**
 * Page de callback OAuth
 */
export default function OAuthCallbackPage() {
  const router = useRouter();
  const { token, error } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { user } = useAuthStore();

  useEffect(() => {
    // Vérifier si les paramètres de requête sont disponibles
    if (!router.isReady) return;

    if (error) {
      console.error('OAuth error:', error);
      setStatus('error');
      // Rediriger vers la page de connexion après un délai
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

    if (token && typeof token === 'string') {
      handleOAuthCallback(token);
    } else {
      setStatus('error');
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    }
  }, [router, token, error, user]);

  /**
   * Function to handle the OAuth callback
   */
  const handleOAuthCallback = async (token: string) => {
    try {
      // Set token in localStorage
      localStorage.setItem('token', token);

      // Configure axios to use the token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Get user info from API
      const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? 'http://localhost:3001/auth';
      const response = await axios.get(`${baseUrl}/api/v1/auth/me`);
      
      if (response.data && response.data.user) {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update auth store
        useAuthStore.setState({ 
          user: response.data.user,
          isLoading: false,
          error: null
        });
        
        setStatus('success');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        throw new Error("Impossible de récupérer les données utilisateur");
      }
    } catch (err) {
      console.error('Error handling OAuth response:', err);
      setStatus('error');
      // Rediriger vers la page de connexion après un délai
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
