/**
 * Chat Page
 * Main page for the chat functionality
 * Requires active subscription to access
 */

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { ChatInterface } from '@/components/chat';
import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';

export default function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

  useEffect(() => {
    // Only check subscription when user data is loaded
    if (!isLoading && user) {
      setIsCheckingSubscription(false);

      // Check if user has active subscription
      if (!user.hasActiveSubscription) {
        console.log('User does not have active subscription, redirecting to pricing');
        router.replace('/pricing');
        return;
      }
    } else if (!isLoading) {
      // User not authenticated, will be handled by ProtectedRoute
      setIsCheckingSubscription(false);
    }
  }, [user, isLoading, router]);

  // Show loading while checking subscription
  if (isLoading || isCheckingSubscription) {
    return (
      <Layout>
        <Head>
          <title>Chat - PenPal AI</title>
          <meta
            name="description"
            content="Pratiquez vos compétences linguistiques avec PenPal AI"
          />
        </Head>
        <div className="h-[calc(100vh-73px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 mx-auto mb-4"
            >
              <div className="w-12 h-12 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Vérification de votre abonnement...
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Chat - PenPal AI</title>
          <meta
            name="description"
            content="Pratiquez vos compétences linguistiques avec PenPal AI"
          />
        </Head>

        <div className="h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
          <ChatInterface />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'chat'])),
    },
  };
};
