import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { LoginForm } from '@/components/auth/LoginForm';
import { useRouter } from 'next/router';
import useUserStore from '@/store/useUserStore';
import { authService } from '@/services/auth.service';

/**
 * Login page
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useUserStore();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      // Redirection après connexion réussie
      router.push('/');
    } catch (error) {
      // L'erreur est déjà gérée dans le store
      console.error('Erreur de connexion:', error);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    try {
      if (provider === 'google') {
        // Redirection vers Google OAuth avec URL de callback
        const currentUrl = window.location.origin;
        const redirectUrl = `${currentUrl}/auth/callback`;
        authService.redirectToGoogleOAuth(redirectUrl);
      } else {
        // Pour Apple, on pourrait implémenter une logique similaire
        console.log(`${provider} OAuth non encore implémenté`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'authentification ${provider}:`, error);
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
