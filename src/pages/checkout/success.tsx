import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation('pages');
  const [countdown, setCountdown] = useState(5);

  // Redirect countdown
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/chat');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, router]);

  const handleGoToChat = () => {
    router.push('/chat');
  };

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{t('checkoutSuccess.title')}</title>
        <meta name="description" content={t('checkoutSuccess.subtitle')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <motion.div
          className="max-w-2xl w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Success Icon */}
          <motion.div
            className="mx-auto mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircleIcon className="w-14 h-14 text-white" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('checkoutSuccess.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-2">{t('checkoutSuccess.subtitle')}</p>
            <p className="text-lg text-gray-500">
              {t('checkoutSuccess.welcome', { firstName: user.firstName })}
            </p>
          </motion.div>

          {/* Trial Info Card */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {t('checkoutSuccess.features.days')}
                </div>
                <div className="text-sm text-gray-600">{t('checkoutSuccess.features.trial')}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {t('checkoutSuccess.features.unlimited')}
                </div>
                <div className="text-sm text-gray-600">
                  {t('checkoutSuccess.features.conversations')}
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {t('checkoutSuccess.features.support24')}
                </div>
                <div className="text-sm text-gray-600">{t('checkoutSuccess.features.support')}</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>{t('checkoutSuccess.reminder.title')}</strong>{' '}
                {t('checkoutSuccess.reminder.text')}
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={handleGoToChat}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t('checkoutSuccess.actions.startChat')}
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </button>

            <button
              onClick={handleGoToProfile}
              className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl font-medium text-lg transition-all hover:bg-gray-50"
            >
              {t('checkoutSuccess.actions.viewProfile')}
            </button>
          </motion.div>

          {/* Auto-redirect Notice */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-gray-500 text-sm">
              {t('checkoutSuccess.autoRedirect', { countdown })}
            </p>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            className="mt-12 text-center text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p>
              {t('checkoutSuccess.contact')}{' '}
              <a
                href="mailto:support@penpal-ai.com"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                support@penpal-ai.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'pages'])),
    },
  };
};
