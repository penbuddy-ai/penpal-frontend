import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useHydratedUserStore } from '@/hooks/useHydratedUserStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { motion } from 'framer-motion';

/**
 * Onboarding page component
 */
export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuthStatus, isHydrated } = useHydratedUserStore();
  const { data, resetOnboarding } = useOnboardingStore();

  useEffect(() => {
    // Check auth status when component mounts
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    // Only redirect if the store is hydrated, not loading, and not authenticated
    if (isHydrated && !isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/onboarding');
      return;
    }

    // Redirect if onboarding is already completed according to backend
    if (isHydrated && !isLoading && user?.onboardingCompleted === true) {
      console.log('User has already completed onboarding, redirecting to chat');
      router.push('/chat');
      return;
    }

    // Reset local onboarding store if backend says onboarding is not completed
    // This handles the case where local storage has stale "completed" data
    if (
      isHydrated &&
      !isLoading &&
      user &&
      user.onboardingCompleted === false &&
      data.isCompleted
    ) {
      console.log('Backend says onboarding not completed, resetting local store');
      resetOnboarding();
    }
  }, [isAuthenticated, isLoading, isHydrated, user, router, data.isCompleted, resetOnboarding]);

  useEffect(() => {
    // Handle onboarding completion redirect
    // Only redirect if both local store AND backend confirm completion
    if (data.isCompleted && user?.onboardingCompleted === true) {
      const timer = setTimeout(() => {
        router.push('/chat');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [data.isCompleted, user?.onboardingCompleted, router]);

  // Show loading state while checking authentication or hydrating
  if (!isHydrated || isLoading || (!isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!isHydrated ? 'Initialisation...' : "Vérification de l'authentification..."}
          </p>
        </div>
      </div>
    );
  }

  // Show completion state only if both local and backend confirm completion
  if (data.isCompleted && user?.onboardingCompleted === true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bienvenue sur Penpal ! 🎉</h1>
          <p className="text-lg text-gray-600 mb-6">
            Votre profil a été configuré avec succès. Redirection vers vos conversations...
          </p>
          <div className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Configuration - Penpal</title>
        <meta
          name="description"
          content="Configurez votre profil Penpal pour une expérience d'apprentissage personnalisée"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <OnboardingFlow />
    </>
  );
}

// Static props for better performance
export async function getStaticProps() {
  return {
    props: {},
  };
}
