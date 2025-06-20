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
  const { t } = useTranslation('common');
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <Layout>
      <Head>
        <title>PenPal - Votre IA conversationnelle pour apprendre les langues</title>
        <meta
          name="description"
          content="Apprenez les langues naturellement avec votre partenaire IA conversationnel. Conversations 24/7, corrections personnalisées et progression adaptée."
        />
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
            className="absolute top-20 left-20 text-blue-200 dark:text-blue-800"
          >
            <MessageCircle size={80} />
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
            className="absolute top-40 right-20 text-purple-200 dark:text-purple-800"
          >
            <Globe size={60} />
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
            className="absolute bottom-40 left-40 text-indigo-200 dark:text-indigo-800"
          >
            <Sparkles size={70} />
          </motion.div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Parlez
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Naturellement</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Votre partenaire IA conversationnel pour{' '}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              maîtriser les langues
            </span>{' '}
            en discutant naturellement 🌟
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
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
                      Commencer à chatter
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
                      Démo AI Gratuite
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
                      Commencer gratuitement
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
                      Se connecter
                    </Link>

                    <Link
                      href="/demo"
                      className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Démo AI Gratuite
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
              className="mb-12"
            >
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Bon retour,{' '}
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Conversations 24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discutez quand vous voulez avec votre IA toujours disponible
              </p>
            </div>

            <div className="group p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Corrections intelligentes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Apprenez de vos erreurs avec des corrections contextuelles
              </p>
            </div>

            <div className="group p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Progressez naturellement
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Adaptez votre apprentissage à votre rythme et niveau
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
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
