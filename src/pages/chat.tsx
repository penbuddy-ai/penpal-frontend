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
        <div className="flex-1 flex items-center justify-center h-[calc(100vh-64px-72px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification de votre abonnement...</p>
          </div>
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

        <div className="flex-1 h-[calc(100vh-64px-72px)]">
          <ChatInterface />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
