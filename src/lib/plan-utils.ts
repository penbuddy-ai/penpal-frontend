import { TFunction } from 'next-i18next';
import { SubscriptionPlan } from './stripe';

/**
 * Interface for a translated plan
 */
export interface TranslatedPlan {
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  savings?: number;
}

/**
 * Base plan data (only pricing and savings)
 */
const PLAN_DATA = {
  [SubscriptionPlan.MONTHLY]: {
    price: 20,
    savings: undefined,
  },
  [SubscriptionPlan.YEARLY]: {
    price: 200,
    savings: 40,
  },
} as const;

/**
 * Get translated plan details
 */
export function getTranslatedPlan(plan: SubscriptionPlan, t: TFunction): TranslatedPlan {
  const baseData = PLAN_DATA[plan];

  return {
    name: t(`plans.${plan}.name`),
    price: baseData.price,
    interval: t(`plans.intervals.${plan === SubscriptionPlan.YEARLY ? 'year' : 'month'}`),
    description: t(`plans.${plan}.description`),
    features: t(`plans.${plan}.features`, { returnObjects: true }) as string[],
    savings: baseData.savings,
  };
}

/**
 * Get all translated plans
 */
export function getAllTranslatedPlans(t: TFunction): Record<SubscriptionPlan, TranslatedPlan> {
  return {
    [SubscriptionPlan.MONTHLY]: getTranslatedPlan(SubscriptionPlan.MONTHLY, t),
    [SubscriptionPlan.YEARLY]: getTranslatedPlan(SubscriptionPlan.YEARLY, t),
  };
}
