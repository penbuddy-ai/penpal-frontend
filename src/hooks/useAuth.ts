import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import useUserStore from '@/store/useUserStore';
import { authService } from '@/services/auth.service';

/**
 * Hook personnalisé pour la gestion de l'authentification
 */
export const useAuth = () => {
  const router = useRouter();
  const hasInitialized = useRef(false);
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    clearError,
    setError,
  } = useUserStore();

  /**
   * Vérifier le statut d'authentification au chargement (une seule fois)
   */
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      checkAuthStatus();
    }
  }, []); // Pas de dépendances pour éviter les re-exécutions

  /**
   * Connexion avec gestion d'erreurs et redirection
   */
  const handleLogin = useCallback(
    async (email: string, password: string, redirectTo: string = '/') => {
      try {
        await login(email, password);
        router.push(redirectTo);
      } catch (error) {
        throw error;
      }
    },
    [login, router]
  );

  /**
   * Inscription avec gestion d'erreurs et redirection
   */
  const handleRegister = useCallback(
    async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
      try {
        await register(userData);
        router.push('/auth/login?message=registration-success');
      } catch (error) {
        throw error;
      }
    },
    [register, router]
  );

  /**
   * Déconnexion avec redirection
   */
  const handleLogout = useCallback(
    async (redirectTo: string = '/auth/login') => {
      try {
        await logout();
        router.push(redirectTo);
      } catch (error) {
        // Même en cas d'erreur, on redirige
        router.push(redirectTo);
      }
    },
    [logout, router]
  );

  /**
   * Redirection OAuth Google
   */
  const handleGoogleOAuth = useCallback(() => {
    const currentUrl = window.location.origin;
    const redirectUrl = `${currentUrl}/auth/callback`;
    authService.redirectToGoogleOAuth(redirectUrl);
  }, []);

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user]
  );

  /**
   * Vérifier si l'utilisateur est admin
   */
  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  /**
   * Rediriger vers la page de connexion si non authentifié
   */
  const requireAuth = useCallback(
    (redirectTo?: string) => {
      if (!isAuthenticated && !isLoading) {
        const currentPath = router.asPath;
        const loginUrl = redirectTo || `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
        return false;
      }
      return true;
    },
    [isAuthenticated, isLoading, router]
  );

  /**
   * Rediriger vers la page d'accueil si déjà authentifié
   */
  const requireGuest = useCallback(
    (redirectTo: string = '/') => {
      if (isAuthenticated && !isLoading) {
        router.push(redirectTo);
        return false;
      }
      return true;
    },
    [isAuthenticated, isLoading, router]
  );

  /**
   * Obtenir l'URL de redirection depuis les paramètres de requête
   */
  const getRedirectUrl = useCallback(() => {
    const { redirect } = router.query;
    return typeof redirect === 'string' ? redirect : '/';
  }, [router.query]);

  return {
    // État
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions d'authentification
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    googleOAuth: handleGoogleOAuth,

    // Vérifications
    hasRole,
    isAdmin,
    requireAuth,
    requireGuest,

    // Utilitaires
    clearError,
    setError,
    getRedirectUrl,
    checkAuthStatus,
  };
};

/**
 * Hook pour protéger les routes qui nécessitent une authentification
 */
export const useRequireAuth = (redirectTo?: string) => {
  const { requireAuth, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      requireAuth(redirectTo);
    }
  }, [requireAuth, isLoading, redirectTo]);

  return { isLoading };
};

/**
 * Hook pour protéger les routes qui nécessitent d'être déconnecté (login, register)
 */
export const useRequireGuest = (redirectTo?: string) => {
  const { requireGuest, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      requireGuest(redirectTo);
    }
  }, [requireGuest, isLoading, redirectTo]);

  return { isLoading };
};

/**
 * Hook pour vérifier les permissions d'admin
 */
export const useRequireAdmin = (redirectTo: string = '/') => {
  const { isAdmin, requireAuth, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!requireAuth()) return;

      if (isAuthenticated && !isAdmin()) {
        // Rediriger si authentifié mais pas admin
        window.location.href = redirectTo;
      }
    }
  }, [isAdmin, requireAuth, isLoading, isAuthenticated, redirectTo]);

  return { isLoading, isAdmin: isAdmin() };
};
