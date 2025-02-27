'use client';

import { useTranslation } from '../../node_modules/react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import '../lib/i18n';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">{t('welcome')}</h1>
        <p className="text-xl mb-8">{t('tagline')}</p>
        <Button size="lg">{t('getStarted')}</Button>
      </motion.div>
    </main>
  );
}
