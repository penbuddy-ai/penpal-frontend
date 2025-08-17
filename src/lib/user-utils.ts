import useUserStore from '@/store/useUserStore';

/**
 * Utilitaire global pour récupérer l'ID de l'utilisateur connecté
 * @returns L'ID de l'utilisateur ou null si non connecté
 */
export function getCurrentUserId(): string | null {
  return useUserStore.getState().getCurrentUserId();
}

/**
 * Utilitaire global pour vérifier si l'utilisateur est connecté
 * @returns true si l'utilisateur est connecté, false sinon
 */
export function isUserAuthenticated(): boolean {
  return useUserStore.getState().isAuthenticated;
}

/**
 * Utilitaire global pour récupérer l'utilisateur connecté
 * @returns L'utilisateur connecté ou null
 */
export function getCurrentUser() {
  return useUserStore.getState().user;
}

/**
 * Utilitaire pour obtenir l'ID utilisateur avec une erreur si non connecté
 * @throws Error si l'utilisateur n'est pas connecté
 * @returns L'ID de l'utilisateur
 */
export function requireCurrentUserId(): string {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('Utilisateur non connecté - ID requis');
  }
  return userId;
}
