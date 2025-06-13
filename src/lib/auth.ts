/**
 * Utilitaires pour l'authentification - Version intégrée avec le service d'auth
 */

import { authService } from '@/services/auth.service';

/**
 * Configuration de l'API (rétrocompatibilité)
 */
const API_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3002/api/v1';

console.log("Service d'authentification configuré:", API_URL);

/**
 * Fonction pour obtenir l'URL OAuth Google (rétrocompatibilité)
 * @deprecated Utilisez authService.getGoogleOAuthUrl() à la place
 * @returns L'URL complète pour l'authentification OAuth Google
 */
export const getGoogleOAuthUrl = (): string => {
  console.warn(
    'getGoogleOAuthUrl est déprécié. Utilisez authService.getGoogleOAuthUrl() à la place.'
  );
  return authService.getGoogleOAuthUrl();
};

/**
 * Fonction pour obtenir l'URL OAuth Apple (rétrocompatibilité)
 * @deprecated Non implémenté dans le nouveau service
 * @returns L'URL complète pour l'authentification OAuth Apple
 */
export const getAppleOAuthUrl = (): string => {
  console.warn('getAppleOAuthUrl est déprécié et non implémenté dans le nouveau service.');
  return `${API_URL}/auth/oauth/apple`;
};

/**
 * Fonction pour rediriger vers l'authentification OAuth (rétrocompatibilité)
 * @deprecated Utilisez authService.redirectToGoogleOAuth() à la place
 * @param provider Le fournisseur OAuth ('google' ou 'apple')
 */
export const redirectToOAuth = (provider: 'google' | 'apple'): void => {
  console.warn(
    'redirectToOAuth est déprécié. Utilisez authService.redirectToGoogleOAuth() à la place.'
  );

  try {
    if (provider === 'google') {
      const currentUrl = window.location.origin;
      const redirectUrl = `${currentUrl}/auth/callback`;
      authService.redirectToGoogleOAuth(redirectUrl);
    } else {
      console.error(`${provider} OAuth n'est pas encore implémenté dans le nouveau service`);
    }
  } catch (error) {
    console.error(`Erreur lors de la redirection vers ${provider} OAuth:`, error);
  }
};

/**
 * Fonction pour gérer la réponse OAuth (rétrocompatibilité)
 * @deprecated Le nouveau service utilise un système de session tokens
 * @param token Le token d'authentification reçu
 * @param redirectUrl L'URL de redirection après authentification réussie
 */
export const handleOAuthResponse = (token: string, redirectUrl: string = '/'): void => {
  console.warn(
    'handleOAuthResponse est déprécié. Le nouveau service utilise un système de session tokens.'
  );

  // Pour la rétrocompatibilité, on stocke le token et redirige
  localStorage.setItem('auth_token', token);
  console.log('Token stocké (mode compatibilité), redirection vers:', redirectUrl);

  window.location.href = redirectUrl;
};

/**
 * Utilitaires pour la gestion des tokens JWT
 */
export const tokenUtils = {
  /**
   * Décoder un token JWT (sans vérification de signature)
   */
  decode: (token: string) => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  },

  /**
   * Vérifier si un token est expiré
   */
  isExpired: (token: string): boolean => {
    const decoded = tokenUtils.decode(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  },

  /**
   * Obtenir le temps restant avant expiration (en secondes)
   */
  getTimeToExpiry: (token: string): number => {
    const decoded = tokenUtils.decode(token);
    if (!decoded || !decoded.exp) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, decoded.exp - currentTime);
  },
};

/**
 * Utilitaires pour la gestion des cookies d'authentification
 */
export const cookieUtils = {
  /**
   * Vérifier si les cookies d'authentification sont présents
   */
  hasAuthCookie: (): boolean => {
    if (typeof document === 'undefined') return false;
    return document.cookie.includes('auth_token=');
  },

  /**
   * Obtenir la valeur d'un cookie
   */
  getCookie: (name: string): string | null => {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  },

  /**
   * Supprimer un cookie
   */
  deleteCookie: (name: string): void => {
    if (typeof document === 'undefined') return;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

/**
 * Utilitaires pour la validation des données d'authentification
 */
export const validationUtils = {
  /**
   * Valider un email
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valider la force d'un mot de passe
   */
  validatePassword: (
    password: string
  ): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Calculer la force d'un mot de passe (0-100)
   */
  getPasswordStrength: (password: string): number => {
    let score = 0;

    // Longueur
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;

    // Caractères
    if (/[a-z]/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;

    // Complexité
    if (password.length >= 16) score += 10;

    return Math.min(100, score);
  },
};

/**
 * Constantes pour l'authentification
 */
export const AUTH_CONSTANTS = {
  STORAGE_KEYS: {
    USER: 'penpal-user-storage',
    TOKEN: 'auth_token',
  },
  ROUTES: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CALLBACK: '/auth/callback',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
  },
} as const;
