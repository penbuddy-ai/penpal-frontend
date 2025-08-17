import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { PricingCard } from '@/components/pricing/PricingCard';
import { SubscriptionPlan } from '@/lib/stripe';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Head from 'next/head';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation('pages');

  // Hook subscription management
  const { subscription } = useSubscription();

  const requireAuthForAction = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/pricing'));
      return false;
    }
    return true;
  };

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    try {
      setLoading(true);

      if (!requireAuthForAction()) {
        return;
      }

      if (subscription.hasActiveSubscription) {
        alert(t('pricing.subscription.alreadyActive'));
        return;
      }

      router.push(`/checkout?plan=${plan}`);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{t('pricing.title')}</title>
        <meta name="description" content={t('pricing.subtitle')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t('pricing.title')}
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {subscription.isInTrial
                ? t('pricing.trialWarning', { days: subscription.daysLeftInTrial })
                : t('pricing.subtitle')}
            </motion.p>

            {/* User greeting and subscription status */}
            {user && (
              <motion.div
                className="mt-4 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                {t('pricing.hello', { firstName: user.firstName, lastName: user.lastName })}
              </motion.div>
            )}

            {/* Current subscription status */}
            {(subscription.isInTrial || subscription.hasActiveSubscription) && (
              <motion.div
                className="mt-6 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {subscription.isInTrial
                  ? t('pricing.subscription.trialActive', { days: subscription.daysLeftInTrial })
                  : t('pricing.subscription.activeSubscription', { plan: subscription.plan })}
              </motion.div>
            )}

            {/* Authentication notice for non-authenticated users */}
            {!isAuthenticated && (
              <motion.div
                className="mt-6 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {t('pricing.authNotice')}
              </motion.div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PricingCard
                plan={SubscriptionPlan.MONTHLY}
                onSelectPlan={handleSelectPlan}
                loading={loading}
                currentPlan={
                  subscription.plan === 'monthly'
                    ? SubscriptionPlan.MONTHLY
                    : subscription.plan === 'yearly'
                      ? SubscriptionPlan.YEARLY
                      : undefined
                }
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <PricingCard
                plan={SubscriptionPlan.YEARLY}
                isPopular={true}
                onSelectPlan={handleSelectPlan}
                loading={loading}
                currentPlan={
                  subscription.plan === 'monthly'
                    ? SubscriptionPlan.MONTHLY
                    : subscription.plan === 'yearly'
                      ? SubscriptionPlan.YEARLY
                      : undefined
                }
              />
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            className="mt-20 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              {t('pricing.faq.title')}
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('pricing.faq.afterTrial.question')}
                </h3>
                <p className="text-gray-600">{t('pricing.faq.afterTrial.answer')}</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('pricing.faq.changePlan.question')}
                </h3>
                <p className="text-gray-600">{t('pricing.faq.changePlan.answer')}</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('pricing.faq.hiddenFees.question')}
                </h3>
                <p className="text-gray-600">{t('pricing.faq.hiddenFees.answer')}</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-gray-600">
              {t('pricing.contact')}{' '}
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
