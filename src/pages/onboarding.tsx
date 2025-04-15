/**
 * Onboarding Page
 */

import { useEffect } from 'react';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useOnboardingStore } from '@/store/onboardingStore';

// Utilisation de dynamic import pour éviter les erreurs SSR
const OnboardingSteps = dynamic(
  () =>
    import('@/components/onboarding/OnboardingSteps').then((mod) => ({
      default: mod.OnboardingSteps,
    })),
  { ssr: false }
);

export default function OnboardingPage() {
  const router = useRouter();
  const { data } = useOnboardingStore();

  // Rediriger vers le chat si l'onboarding est déjà complété
  useEffect(() => {
    if (data.onboardingCompleted) {
      router.push('/chat');
    }
  }, [data.onboardingCompleted, router]);

  return <OnboardingSteps />;
}

export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
