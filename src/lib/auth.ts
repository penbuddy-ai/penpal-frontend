/**
 * Utilitaires pour l'authentification
 */

/**
 * Configuration de l'API
 */
// S'assurer d'avoir une URL par défaut si la variable d'environnement n'est pas définie
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

console.log('API_URL configurée:', API_URL);

/**
 * Fonction pour obtenir l'URL OAuth Google
 * @returns L'URL complète pour l'authentification OAuth Google
 */
export const getGoogleOAuthUrl = (): string => {
  const url = `${API_URL}/api/v1/auth/oauth/google/login`;
  console.log('URL OAuth Google:', url);
  return url;
};

/**
 * Fonction pour obtenir l'URL OAuth Apple
 * @returns L'URL complète pour l'authentification OAuth Apple
 */
export const getAppleOAuthUrl = (): string => {
  const url = `${API_URL}/api/v1/auth/oauth/apple`;
  console.log('URL OAuth Apple:', url);
  return url;
};

/**
 * Fonction pour rediriger vers l'authentification OAuth
 * @param provider Le fournisseur OAuth ('google' ou 'apple')
 */
export const redirectToOAuth = (provider: 'google' | 'apple'): void => {
  try {
    const url = provider === 'google' ? getGoogleOAuthUrl() : getAppleOAuthUrl();
    console.log(`Redirection vers ${provider} OAuth:`, url);
    window.location.href = url;
  } catch (error) {
    console.error(`Erreur lors de la redirection vers ${provider} OAuth:`, error);
  }
};

/**
 * Fonction pour gérer la réponse OAuth
 * @param token Le token d'authentification reçu
 * @param redirectUrl L'URL de redirection après authentification réussie
 */
export const handleOAuthResponse = (token: string, redirectUrl: string = '/'): void => {
  // Stocker le token dans le localStorage ou un autre mécanisme de stockage sécurisé
  localStorage.setItem('auth_token', token);
  console.log('Token stocké, redirection vers:', redirectUrl);

  // Rediriger vers la page de destination
  window.location.href = redirectUrl;
};
