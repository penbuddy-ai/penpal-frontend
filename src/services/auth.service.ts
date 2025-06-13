import { z } from 'zod';

// Configuration de l'API
const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3002/api/v1';

// Types et interfaces
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified?: boolean;
  provider?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Schémas de validation
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Mot de passe requis (min. 8 caractères)')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Doit contenir au moins un caractère spécial'),
});

// Classe de service d'authentification
export class AuthService {
  private static instance: AuthService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = AUTH_SERVICE_URL;
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Effectue une requête HTTP avec gestion d'erreurs
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important pour les cookies
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erreur HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la requête vers ${url}:`, error);
      throw error;
    }
  }

  /**
   * Connexion avec email/mot de passe
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const validatedData = loginSchema.parse(credentials);

    return this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData: RegisterData): Promise<User> {
    const validatedData = registerSchema.parse(userData);

    return this.makeRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });
  }

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    await this.makeRequest<void>('/auth/logout', {
      method: 'POST',
    });
  }

  /**
   * Obtenir l'URL d'authentification OAuth Google
   */
  getGoogleOAuthUrl(redirectUrl?: string): string {
    const params = new URLSearchParams();
    if (redirectUrl) {
      params.append('redirect_url', redirectUrl);
    }

    return `${this.baseUrl}/auth/oauth/google/login${params.toString() ? `?${params.toString()}` : ''}`;
  }

  /**
   * Redirection vers l'authentification OAuth Google
   */
  redirectToGoogleOAuth(redirectUrl?: string): void {
    const url = this.getGoogleOAuthUrl(redirectUrl);
    window.location.href = url;
  }

  /**
   * Récupérer les données utilisateur après callback OAuth
   */
  async getOAuthSessionUser(sessionToken: string): Promise<{ user: User }> {
    return this.makeRequest<{ user: User }>(`/auth/oauth/session/user?session=${sessionToken}`);
  }

  /**
   * Authentification OAuth Facebook
   */
  async authenticateWithFacebook(accessToken: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/oauth/facebook', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  }

  /**
   * Authentification OAuth Apple
   */
  async authenticateWithApple(idToken: string, authorizationCode?: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/oauth/apple', {
      method: 'POST',
      body: JSON.stringify({ idToken, authorizationCode }),
    });
  }

  /**
   * Authentification OAuth GitHub
   */
  async authenticateWithGitHub(accessToken: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/oauth/github', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  }

  /**
   * Obtenir les statistiques de sécurité (admin uniquement)
   */
  async getSecurityStats(): Promise<any> {
    return this.makeRequest<any>('/auth/oauth/security/stats');
  }

  /**
   * Vérifier si l'utilisateur est authentifié via les cookies
   */
  async checkAuthStatus(): Promise<boolean> {
    try {
      // Tentative d'accès à un endpoint protégé pour vérifier l'auth
      await this.makeRequest<any>('/users/me');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtenir le profil utilisateur actuel
   */
  async getCurrentUser(): Promise<User> {
    return this.makeRequest<User>('/users/me');
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.makeRequest<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.makeRequest<void>('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
  }
}

// Export de l'instance singleton
export const authService = AuthService.getInstance();

// Utilitaires pour la gestion des erreurs
export class AuthError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Utilitaires pour la validation côté client
export const validateLoginForm = (data: any) => {
  try {
    return { data: loginSchema.parse(data), errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, errors: error.errors };
    }
    throw error;
  }
};

export const validateRegisterForm = (data: any) => {
  try {
    return { data: registerSchema.parse(data), errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, errors: error.errors };
    }
    throw error;
  }
};
