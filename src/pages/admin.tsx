import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AdminDashboard from '../components/admin/AdminDashboard';
import { Layout } from '../components/Layout';

/**
 * Admin Page
 * Page d'administration pour le monitoring des services
 */
const AdminPage: React.FC = () => {
  const { t } = useTranslation('admin');

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
