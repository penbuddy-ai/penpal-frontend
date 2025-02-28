import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

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
        <meta name="description" content="Récupérez l'accès à votre compte PenPal" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
          isLoading={isLoading}
          isSuccess={isSuccess}
          error={error}
        />
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
