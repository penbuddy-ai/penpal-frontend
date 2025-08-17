import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useHydratedUserStore } from './useHydratedUserStore';

/**
 * Hook to redirect users to onboarding if they haven't completed it
 */
export function useOnboardingRedirect() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, isLoading } = useHydratedUserStore();

  useEffect(() => {
    // Only check if:
    // - Store is hydrated (client-side ready)
    // - Not currently loading auth state
    // - User is authenticated
    // - We have user data
    if (isHydrated && !isLoading && isAuthenticated && user) {
      // Skip redirection if already on onboarding pages
      if (router.pathname.startsWith('/onboarding')) {
        return;
      }

      // Skip redirection for auth pages
      if (router.pathname.startsWith('/auth')) {
        return;
      }

      // Check if user has completed onboarding
      if (user.onboardingCompleted === false) {
        console.log('User has not completed onboarding, redirecting to /onboarding');
        router.replace('/onboarding');
      }
    }
  }, [user, isAuthenticated, isHydrated, isLoading, router]);

  // Return whether onboarding is required
  return {
    needsOnboarding:
      isHydrated && !isLoading && isAuthenticated && user && user.onboardingCompleted === false,
    isCheckingOnboarding: !isHydrated || isLoading,
  };
}
