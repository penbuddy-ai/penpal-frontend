import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { TrialSignupForm } from '../components/payment/TrialSignupForm';
import { SubscriptionPlan } from '../lib/stripe';
import { useAuth } from '../hooks/useAuth';
import SubscriptionDebug from '../components/SubscriptionDebug';
import { useTranslation } from 'next-i18next';
import { getTranslatedPlan } from '../lib/plan-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Head from 'next/head';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, requireAuth } = useAuth();
  const { t } = useTranslation('pages');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/checkout'));
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const { plan } = router.query;
    if (plan === 'monthly' || plan === 'yearly') {
      setSelectedPlan(plan as SubscriptionPlan);
    } else if (router.isReady) {
      router.push('/pricing');
    }
  }, [router.query, router.isReady]);

  const handleSuccess = () => {
    router.push('/checkout/success');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleBack = () => {
    router.push('/pricing');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const planDetails = getTranslatedPlan(selectedPlan, t);

  return (
    <>
      <Head>
        <title>{t('checkout.title')}</title>
        <meta name="description" content={t('checkout.title')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('checkout.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('checkout.planSelected', {
                planName: planDetails.name,
                price: planDetails.price,
                interval: planDetails.interval,
              })}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {t('checkout.welcome', { firstName: user.firstName, lastName: user.lastName })}
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex">
                <span className="text-red-500 text-xl mr-3">⚠️</span>
                <div>
                  <h3 className="font-medium text-red-800">{t('checkout.error.title')}</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
                  >
                    {t('checkout.error.retry')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Debug Component - Temporaire */}
          <div className="mb-8">
            <SubscriptionDebug />
          </div>

          {/* Trial Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TrialSignupForm
              userId={user.id}
              email={user.email}
              name={`${user.firstName} ${user.lastName}`}
              selectedPlan={selectedPlan}
              onSuccess={handleSuccess}
              onError={handleError}
              onBack={handleBack}
            />
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-center space-x-8 text-gray-500 text-sm">
              <div className="flex items-center">
                <span className="mr-2">🔒</span>
                {t('checkout.trustSignals.secure')}
              </div>
              <div className="flex items-center">
                <span className="mr-2">✨</span>
                {t('checkout.trustSignals.noCommitment')}
              </div>
              <div className="flex items-center">
                <span className="mr-2">🚫</span>
                {t('checkout.trustSignals.easyCancel')}
              </div>
            </div>

            <p className="text-gray-600 mt-6">
              {t('checkout.contact')}{' '}
              <a
                href="mailto:support@penpal-ai.com"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                support@penpal-ai.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'pages'])),
    },
  };
};
