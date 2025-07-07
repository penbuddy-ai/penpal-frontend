/**
 * Demo Page
 * Showcases the AI demo functionality for language learning
 */

import { NextPage, GetStaticProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout } from '@/components/Layout';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useChatStore } from '@/store/chatStore';
import { Bot, Sparkles } from 'lucide-react';

const DemoPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation('pages');
  const createNewDemoConversation = useChatStore((state) => state.createNewDemoConversation);
  const currentConversation = useChatStore((state) => state.getCurrentConversation());
  const isCurrentConversationDemo = useChatStore((state) => state.isCurrentConversationDemo());

  // Create a demo conversation on page load if none exists or current is not a demo
  useEffect(() => {
    if (!currentConversation || !isCurrentConversationDemo) {
      createNewDemoConversation('AI Demo');
    }
  }, [createNewDemoConversation, currentConversation, isCurrentConversationDemo]);

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Demo Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t('demo.header.title')}</h1>
                <p className="text-primary-100">{t('demo.header.subtitle')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles size={16} className="text-primary-200" />
                <span>{t('demo.header.features.realTimeCorrections')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles size={16} className="text-primary-200" />
                <span>{t('demo.header.features.detailedExplanations')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles size={16} className="text-primary-200" />
                <span>{t('demo.header.features.naturalConversation')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <h2 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 {t('demo.instructions.title')}
            </h2>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {(t('demo.instructions.steps', { returnObjects: true }) as string[]).map(
                (step, index) => (
                  <li key={index}>• {step}</li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="h-[calc(100vh-280px)]">
          <ChatInterface />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'pages', 'chat'])),
    },
  };
};

export default DemoPage;
