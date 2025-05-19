import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { LoginForm } from '@/components/auth/LoginForm';
import { useRouter } from 'next/router';
import { redirectToOAuth } from '@/lib/auth';

/**
 * Login page
 */
export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
    // TODO: Implement login logic with API
    console.log('Login data:', data);
    // Exemple: await signIn('credentials', { ...data, callbackUrl: '/' });
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
        <LoginForm onSubmit={handleLogin} onOAuthLogin={handleOAuthLogin} />
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
