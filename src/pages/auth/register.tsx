import React, { useEffect } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/store/authStore';
import { redirectToOAuth } from '@/lib/auth';

/**
 * Register page
 */
export default function RegisterPage() {
  const { register, initiateOAuthLogin, error, isLoading, user } = useAuth();
  const router = useRouter();

  // Rediriger l'utilisateur s'il est déjà connecté
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    termsAccepted: boolean;
  }) => {
    try {
      await register(data);
      // La redirection est gérée dans le hook useAuth
    } catch (error) {
      // Les erreurs sont gérées dans le hook useAuth et passées au composant
      console.error('Registration error:', error);
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
        <title>Inscription | PenPal</title>
        <meta name="description" content="Créez votre compte PenPal" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm
          onSubmit={handleRegister}
          onOAuthLogin={handleOAuthLogin}
          error={error || undefined}
          isLoading={isLoading}
        />
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
