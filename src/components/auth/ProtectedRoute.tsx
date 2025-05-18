import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';

/**
 * ProtectedRoute component props
 */
interface ProtectedRouteProps {
  /**
   * The children to render if the user is authenticated
   */
  children: React.ReactNode;
  /**
   * Optional redirect path if the user is not authenticated
   */
  redirectTo?: string;
}

/**
 * Component to protect routes that require authentication
 */
export function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Only render children if the user is authenticated
  return user ? <>{children}</> : null;
}

export default ProtectedRoute;
