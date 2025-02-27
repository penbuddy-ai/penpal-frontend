import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Layout } from '@/components/Layout';
import type { GetStaticProps } from 'next';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-6 md:p-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-white dark:bg-neutral-950 p-8 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800"
        >
          <h1 className="text-4xl font-bold mb-4 text-primary-600 dark:text-primary-400">
            {t('welcome')}
          </h1>
          <p className="text-xl mb-8 text-neutral-700 dark:text-neutral-300">{t('tagline')}</p>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-primary-700 transition-colors dark:bg-primary-700 dark:hover:bg-primary-600">
            {t('getStarted')}
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common'])),
    },
  };
};
