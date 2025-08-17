import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAuth } from '../hooks/useAuth';
import AdminDashboard from '../components/admin/AdminDashboard';
import { Layout } from '../components/Layout';

/**
 * Admin Page
 * Page d'administration pour le monitoring des services
 */
const AdminPage: React.FC = () => {
  const { t } = useTranslation('admin');
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">{t('common.loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect if not authenticated (this should be handled by getServerSideProps but as backup)
  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Access Denied
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              You need to be logged in to access the admin dashboard.
            </p>
            <Link href="/auth/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{t('title')} - Penpal AI</title>
        <meta name="description" content={t('description')} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Layout>
        <AdminDashboard />
      </Layout>
    </>
  );
};

/**
 * Server-side props for i18n
 */
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'admin', 'pages'])),
    },
  };
};

export default AdminPage;
