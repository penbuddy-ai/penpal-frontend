import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button/Button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { GetStaticProps } from 'next';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative bg-gray-100">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-4 text-blue-600">{t('welcome')}</h1>
        <p className="text-xl mb-8 text-gray-700">{t('tagline')}</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors">
          {t('getStarted')}
        </button>
      </motion.div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common'])),
    },
  };
};
