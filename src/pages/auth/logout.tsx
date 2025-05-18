import { useEffect } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAuth } from '@/store/authStore';

/**
 * Logout page
 * Cette page déconnecte automatiquement l'utilisateur et le redirige vers la page de connexion
 */
export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
    };

    performLogout();
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Déconnexion en cours...</p>
      </div>
    </div>
  );
}

/**
 * Get static props for the logout page
 */
export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };
};
