import { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chatStore';

export function useHydratedChatStore() {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useChatStore();

  useEffect(() => {
    // Simple check for hydration
    const checkHydration = () => {
      setIsHydrated(true);
    };

    // Set hydrated after a short delay to ensure client-side
    const timer = setTimeout(checkHydration, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    ...store,
    isHydrated,
  };
}
