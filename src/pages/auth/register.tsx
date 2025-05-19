import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { redirectToOAuth } from '@/lib/auth';

/**
 * Register page
 */
export default function RegisterPage() {
  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    termsAccepted: boolean;
  }) => {
    // TODO: Implement register logic with API
    console.log('Register data:', data);
    // Exemple: await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
    // Puis redirection ou connexion automatique
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
        <title>Créer un compte | PenPal</title>
        <meta name="description" content="Créez un compte pour commencer à utiliser PenPal" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm onSubmit={handleRegister} onOAuthLogin={handleOAuthLogin} />
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
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };
};
