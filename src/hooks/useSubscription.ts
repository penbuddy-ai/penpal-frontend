import { useMemo } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook personnalisé pour la gestion de l'abonnement utilisateur
 */
export const useSubscription = () => {
  const { user, isAuthenticated } = useAuth();

  // État de l'abonnement
  const subscription = useMemo(() => {
    if (!isAuthenticated || !user) {
      return {
        plan: null,
        status: null,
        trialEnd: null,
        hasActiveSubscription: false,
        isInTrial: false,
        isTrialExpired: false,
        daysLeftInTrial: 0,
      };
    }

    const plan = user.subscriptionPlan || null;
    const status = user.subscriptionStatus || null;
    const trialEnd = user.subscriptionTrialEnd ? new Date(user.subscriptionTrialEnd) : null;
    const now = new Date();

    // Vérifications d'état - utilise le champ calculé côté backend si disponible
    const hasActiveSubscription = user.hasActiveSubscription ?? status === 'active';
    const isInTrial = status === 'trial' && trialEnd && trialEnd > now;
    const isTrialExpired = status === 'trial' && trialEnd && trialEnd <= now;

    // Calcul des jours restants dans l'essai
    let daysLeftInTrial = 0;
    if (isInTrial && trialEnd) {
      const diffTime = trialEnd.getTime() - now.getTime();
      daysLeftInTrial = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      plan,
      status,
      trialEnd,
      hasActiveSubscription,
      isInTrial,
      isTrialExpired,
      daysLeftInTrial,
    };
  }, [user, isAuthenticated]);

  // Helpers
  const needsUpgrade = useMemo(() => {
    return !subscription.hasActiveSubscription && !subscription.isInTrial;
  }, [subscription]);

  const canAccessPremiumFeatures = useMemo(() => {
    return subscription.hasActiveSubscription || subscription.isInTrial;
  }, [subscription]);

  const getSubscriptionDisplayText = useMemo(() => {
    if (!isAuthenticated) return 'Non connecté';

    if (subscription.isInTrial) {
      const days = subscription.daysLeftInTrial;
      return `Essai gratuit (${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''})`;
    }

    if (subscription.hasActiveSubscription) {
      const planName = subscription.plan === 'monthly' ? 'Mensuel' : 'Annuel';
      return `Abonnement ${planName} actif`;
    }

    if (subscription.isTrialExpired) {
      return 'Essai gratuit expiré';
    }

    return 'Aucun abonnement';
  }, [subscription, isAuthenticated]);

  const getUpgradeMessage = useMemo(() => {
    if (subscription.isTrialExpired) {
      return 'Votre essai gratuit a expiré. Choisissez un plan pour continuer.';
    }

    if (!subscription.isInTrial && !subscription.hasActiveSubscription) {
      return 'Démarrez votre essai gratuit de 30 jours dès maintenant !';
    }

    return null;
  }, [subscription]);

  return {
    // État de l'abonnement
    subscription,

    // Statuts booléens
    needsUpgrade,
    canAccessPremiumFeatures,

    // Textes d'affichage
    getSubscriptionDisplayText,
    getUpgradeMessage,

    // Données brutes pour plus de flexibilité
    user,
    isAuthenticated,
  };
};

/**
 * Hook pour vérifier l'accès aux fonctionnalités premium
 */
export const useFeatureAccess = () => {
  const { canAccessPremiumFeatures, needsUpgrade } = useSubscription();

  const checkFeatureAccess = (featureName: string = 'cette fonctionnalité') => {
    if (!canAccessPremiumFeatures) {
      return {
        hasAccess: false,
        message: `Vous devez avoir un abonnement actif pour accéder à ${featureName}.`,
        actionText: needsUpgrade ? 'Choisir un plan' : "Gérer l'abonnement",
      };
    }

    return {
      hasAccess: true,
      message: null,
      actionText: null,
    };
  };

  return {
    canAccessPremiumFeatures,
    needsUpgrade,
    checkFeatureAccess,
  };
};

export default useSubscription;
