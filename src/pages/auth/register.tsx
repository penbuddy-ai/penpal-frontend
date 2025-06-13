import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useRouter } from 'next/router';
import useUserStore from '@/store/useUserStore';
import { authService } from '@/services/auth.service';

/**
 * Register page
 */
export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useUserStore();

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    termsAccepted: boolean;
  }) => {
    try {
      // Séparer le nom complet en prénom et nom
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await register({
        firstName,
        lastName,
        email: data.email,
        password: data.password,
      });

      // Redirection vers la page de connexion après inscription réussie
      router.push('/auth/login?message=registration-success');
    } catch (error) {
      // L'erreur est déjà gérée dans le store
      console.error("Erreur d'inscription:", error);
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
