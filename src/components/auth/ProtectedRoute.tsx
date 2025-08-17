import React, { ReactNode } from 'react';
import { useRequireAuth, useRequireGuest, useRequireAdmin } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface GuestOnlyRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

interface AdminOnlyRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Composant de chargement par défaut
 */
const DefaultLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Vérification de l&apos;authentification...</p>
    </div>
  </div>
);

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = <DefaultLoadingFallback />,
}) => {
  const { isLoading } = useRequireAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Composant pour les routes accessibles uniquement aux invités (non authentifiés)
 */
export const GuestOnlyRoute: React.FC<GuestOnlyRouteProps> = ({
  children,
  fallback = <DefaultLoadingFallback />,
  redirectTo,
}) => {
  const { isLoading } = useRequireGuest(redirectTo);

  if (isLoading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Composant pour les routes accessibles uniquement aux administrateurs
 */
export const AdminOnlyRoute: React.FC<AdminOnlyRouteProps> = ({
  children,
  fallback = <DefaultLoadingFallback />,
  redirectTo,
}) => {
  const { isLoading, isAdmin } = useRequireAdmin(redirectTo);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * HOC pour protéger une page entière
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    adminOnly?: boolean;
    guestOnly?: boolean;
    redirectTo?: string;
  }
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    if (options?.adminOnly) {
      return (
        <AdminOnlyRoute fallback={options.fallback} redirectTo={options.redirectTo}>
          <Component {...props} />
        </AdminOnlyRoute>
      );
    }

    if (options?.guestOnly) {
      return (
        <GuestOnlyRoute fallback={options.fallback} redirectTo={options.redirectTo}>
          <Component {...props} />
        </GuestOnlyRoute>
      );
    }

    return (
      <ProtectedRoute fallback={options?.fallback}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
