import { Layout } from '@/components/Layout';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>PenPal - Votre application de correspondance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-6 md:p-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
            {t('title')}
          </h1>
          <p className="text-xl mb-8 text-neutral-700 dark:text-neutral-300">{t('tagline')}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="bg-primary-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-primary-700 transition-colors dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              {t('login')}
            </Link>

            <Link
              href="/auth/register"
              className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-gray-700"
            >
              {t('register')}
            </Link>
          </div>
        </motion.div>
      </div>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://github.com/yourusername/penpal"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by PenPal
        </a>
      </footer>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
