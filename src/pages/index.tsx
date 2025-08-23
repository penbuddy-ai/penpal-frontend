import { Layout } from '@/components/Layout';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, Sparkles, Globe, Users, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation('pages');
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <Layout>
      <Head>
        <title>{t('home.title')}</title>
        <meta name="description" content={t('home.description')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 left-10 md:left-20 text-blue-200 dark:text-blue-800"
          >
            <MessageCircle className="w-12 h-12 md:w-20 md:h-20" />
          </motion.div>

          <motion.div
            animate={{
              y: [20, -20, 20],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-40 right-10 md:right-20 text-purple-200 dark:text-purple-800"
          >
            <Globe className="w-10 h-10 md:w-16 md:h-16" />
          </motion.div>

          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-40 left-10 md:left-40 text-indigo-200 dark:text-indigo-800"
          >
            <Sparkles className="w-12 h-12 md:w-18 md:h-18" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('home.hero.mainTitle')}
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">{t('home.hero.mainSubtitle')}</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: t('home.hero.subtitle', { interpolation: { escapeValue: false } })
                  .replace(
                    /<highlight>/g,
                    '<span class="font-semibold text-purple-600 dark:text-purple-400">'
                  )
                  .replace(/<\/highlight>/g, '</span>'),
              }}
            />
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  // User is authenticated - Show chat button and demo
                  <>
                    <Link
                      href="/chat"
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                    >
                      <MessageCircle
                        className="mr-3 transition-transform group-hover:rotate-12"
                        size={24}
                      />
                      {t('home.hero.startChat')}
                      <ArrowRight
                        className="ml-3 transition-transform group-hover:translate-x-1"
                        size={20}
                      />
                    </Link>

                    <Link
                      href="/demo"
                      className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('home.hero.demoFree')}
                    </Link>
                  </>
                ) : (
                  // User is not authenticated - Show auth buttons and demo
                  <>
                    <Link
                      href="/auth/register"
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                    >
                      <Sparkles
                        className="mr-3 transition-transform group-hover:rotate-12"
                        size={24}
                      />
                      {t('home.hero.signUpFree')}
                      <ArrowRight
                        className="ml-3 transition-transform group-hover:translate-x-1"
                        size={20}
                      />
                    </Link>

                    <Link
                      href="/auth/login"
                      className="group bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                    >
                      <Users
                        className="mr-3 transition-transform group-hover:scale-110"
                        size={24}
                      />
                      {t('home.hero.signIn')}
                    </Link>

                    <Link
                      href="/demo"
                      className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('home.hero.demoFree')}
                    </Link>
                  </>
                )}
              </>
            )}

            {isLoading && (
              <div className="bg-gray-200 dark:bg-gray-700 px-8 py-4 rounded-2xl text-lg">
                <div className="animate-pulse flex items-center">
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded mr-3"></div>
                  <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Welcome message for authenticated users */}
          {isAuthenticated && user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('home.hero.welcomeBack')}
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {user.firstName}
                </span>{' '}
                ! 👋
              </p>
            </motion.div>
          )}

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="group p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mr-3">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('home.features.chat247.title')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.features.chat247.description')}
              </p>
            </div>

            <div className="group p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mr-3">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('home.features.smartCorrections.title')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.features.smartCorrections.description')}
              </p>
            </div>

            <div className="group p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mr-3">
                  <Globe className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('home.features.naturalProgress.title')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.features.naturalProgress.description')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'pages'])),
    },
  };
};
