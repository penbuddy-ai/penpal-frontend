import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

/**
 * Reset password page props
 */
interface ResetPasswordPageProps {
  token: string | null;
}

/**
 * Reset password page
 */
export default function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleResetPassword = async (data: { password: string }) => {
    try {
      setIsLoading(true);
      setError(undefined);

      if (!token) {
        throw new Error('Token invalide');
      }

      // TODO: Implement reset password logic with API
      console.log('Reset password data:', { ...data, token });
      // Exemple: await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   body: JSON.stringify({ ...data, token })
      // });

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
        <title>Réinitialiser le mot de passe | PenPal</title>
        <meta name="description" content="Réinitialisez votre mot de passe PenPal" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <ResetPasswordForm
          onSubmit={handleResetPassword}
          isLoading={isLoading}
          isSuccess={isSuccess}
          error={error}
          token={token || undefined}
        />
      </div>
    </>
  );
}

/**
 * Get server side props for the reset password page
 */
export const getServerSideProps: GetServerSideProps = async ({ locale = 'fr', query }) => {
  const { token } = query;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
      token: typeof token === 'string' ? token : null,
    },
  };
};
