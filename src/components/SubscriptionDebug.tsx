import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

/**
 * Composant temporaire pour débugger les données d'abonnement
 */
export const SubscriptionDebug: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    subscription,
    needsUpgrade,
    canAccessPremiumFeatures,
    getSubscriptionDisplayText,
    getUpgradeMessage,
  } = useSubscription();

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-bold text-yellow-800">État d'authentification</h3>
        <p className="text-yellow-700">Utilisateur non connecté</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold text-blue-800 mb-4">Données d'abonnement (Debug)</h3>

      {/* Données utilisateur brutes */}
      <div className="mb-4">
        <h4 className="font-semibold text-blue-700">Données utilisateur brutes :</h4>
        <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
          {JSON.stringify(
            {
              id: user?.id,
              email: user?.email,
              firstName: user?.firstName,
              lastName: user?.lastName,
              subscriptionPlan: user?.subscriptionPlan,
              subscriptionStatus: user?.subscriptionStatus,
              subscriptionTrialEnd: user?.subscriptionTrialEnd,
            },
            null,
            2
          )}
        </pre>
      </div>

      {/* État d'abonnement calculé */}
      <div className="mb-4">
        <h4 className="font-semibold text-blue-700">État d'abonnement calculé :</h4>
        <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
          {JSON.stringify(subscription, null, 2)}
        </pre>
      </div>

      {/* Statuts booléens */}
      <div className="mb-4">
        <h4 className="font-semibold text-blue-700">Statuts :</h4>
        <ul className="text-sm space-y-1">
          <li>
            <span className="font-medium">Accès aux fonctionnalités premium :</span>{' '}
            <span className={canAccessPremiumFeatures ? 'text-green-600' : 'text-red-600'}>
              {canAccessPremiumFeatures ? '✅ Oui' : '❌ Non'}
            </span>
          </li>
          <li>
            <span className="font-medium">Besoin de mise à niveau :</span>{' '}
            <span className={needsUpgrade ? 'text-orange-600' : 'text-green-600'}>
              {needsUpgrade ? '⚠️ Oui' : '✅ Non'}
            </span>
          </li>
        </ul>
      </div>

      {/* Textes d'affichage */}
      <div className="mb-4">
        <h4 className="font-semibold text-blue-700">Textes d'affichage :</h4>
        <ul className="text-sm space-y-1">
          <li>
            <span className="font-medium">Statut abonnement :</span> {getSubscriptionDisplayText}
          </li>
          {getUpgradeMessage && (
            <li>
              <span className="font-medium">Message de mise à niveau :</span> {getUpgradeMessage}
            </li>
          )}
        </ul>
      </div>

      {/* Vérification API /me */}
      <div className="mt-4 text-xs text-blue-600">
        💡 Si tous les champs d'abonnement sont null/undefined, vérifiez que l'endpoint /me retourne
        bien les champs subscriptionPlan, subscriptionStatus et subscriptionTrialEnd.
      </div>
    </div>
  );
};

export default SubscriptionDebug;
