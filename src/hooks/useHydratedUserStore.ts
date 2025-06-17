import { useState, useEffect } from 'react';
import useUserStore from '@/store/useUserStore';

/**
 * Hook that ensures the user store is properly hydrated before use
 * Prevents premature redirects during SSR/hydration
 */
export function useHydratedUserStore() {
  const [isHydrated, setIsHydrated] = useState(false);
  const userStore = useUserStore();

  useEffect(() => {
    // Mark as hydrated after the store has been initialized
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Return the store state with hydration status
  return {
    ...userStore,
    isHydrated,
  };
}

export default useHydratedUserStore;
