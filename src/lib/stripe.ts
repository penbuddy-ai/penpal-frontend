import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe client
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured');
    }

    stripePromise = loadStripe(publishableKey).catch((error) => {
      console.error('Failed to load Stripe:', error);
      if (
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('ERR_BLOCKED_BY_CLIENT')
      ) {
        throw new Error(
          'Stripe est bloqué par votre navigateur ou extension. Veuillez désactiver votre bloqueur de publicités et rafraîchir la page.'
        );
      }
      throw error;
    });
  }

  return stripePromise;
};

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'eur',
  country: 'FR',
  locale: 'fr' as const,
} as const;

// Plan types
export enum SubscriptionPlan {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

// Plan configurations
export const PLANS = {
  [SubscriptionPlan.MONTHLY]: {
    name: 'Mensuel',
    price: 20,
    interval: 'mois',
    description: 'Accès complet à Penpal AI',
    features: [
      'IA conversationnelle avancée',
      'Génération de contenu',
      'Support par email',
      'Accès mobile et desktop',
    ],
  },
  [SubscriptionPlan.YEARLY]: {
    name: 'Annuel',
    price: 200,
    interval: 'an',
    description: 'Accès complet à Penpal AI (économisez 2 mois)',
    savings: 40,
    features: [
      'IA conversationnelle avancée',
      'Génération de contenu',
      'Support prioritaire',
      'Accès mobile et desktop',
      '2 mois gratuits',
      'Nouvelles fonctionnalités en avant-première',
    ],
  },
} as const;
