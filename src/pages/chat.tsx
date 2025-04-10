/**
 * Chat Page
 * Main page for the chat functionality
 */

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { Layout } from '@/components/Layout';
import { ChatInterface } from '@/components/chat';

export default function ChatPage() {
  return (
    <Layout>
      <Head>
        <title>Chat - PenPal AI</title>
        <meta name="description" content="Pratiquez vos compétences linguistiques avec PenPal AI" />
      </Head>

      <div className="flex-1 h-[calc(100vh-64px-72px)]">
        <ChatInterface />
      </div>
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
