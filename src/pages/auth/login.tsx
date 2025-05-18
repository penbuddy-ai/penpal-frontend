import React, { useEffect } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/store/authStore';
import { useRouter } from 'next/router';
import { redirectToOAuth } from '@/lib/auth';

/**
 * Login page
 */
export default function LoginPage() {
  const { login, initiateOAuthLogin, error, isLoading, user } = useAuth();
  const router = useRouter();

  // Rediriger l'utilisateur s'il est déjà connecté
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      // La redirection est gérée dans le hook useAuth
    } catch (error) {
      // Les erreurs sont gérées dans le hook useAuth et passées au composant
      console.error('Login error:', error);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    try {
      redirectToOAuth(provider);
    } catch (error) {
      console.error(`Error during ${provider} OAuth:`, error);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion | PenPal</title>
        <meta name="description" content="Connectez-vous à votre compte PenPal" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm
          onSubmit={handleLogin}
          onOAuthLogin={handleOAuthLogin}
          error={error || undefined}
          isLoading={isLoading}
        />
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
