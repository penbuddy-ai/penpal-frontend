import { useState } from 'react';
import { motion } from 'framer-motion';
import { SubscriptionPlan } from '@/lib/stripe';
import { CheckIcon } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { getTranslatedPlan } from '@/lib/plan-utils';

interface PricingCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  loading?: boolean;
  currentPlan?: SubscriptionPlan;
}

export function PricingCard({
  plan,
  isPopular = false,
  onSelectPlan,
  loading = false,
  currentPlan,
}: PricingCardProps) {
  const { t } = useTranslation('pages');
  const planDetails = getTranslatedPlan(plan, t);
  const isCurrentPlan = currentPlan === plan;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300
        ${
          isPopular
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }
        ${isCurrentPlan ? 'ring-2 ring-green-500 border-green-500' : ''}
      `}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            {t('components.pricingCard.popular')}
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {t('components.pricingCard.currentPlan')}
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{planDetails.name}</h3>
        <p className="text-gray-600 mb-4">{planDetails.description}</p>

        {/* Price */}
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold text-gray-900">{planDetails.price}€</span>
          <span className="text-gray-500 ml-1">/{planDetails.interval}</span>
        </div>

        {/* Savings for yearly */}
        {plan === SubscriptionPlan.YEARLY && 'savings' in planDetails && planDetails.savings && (
          <div className="mt-2">
            <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              {t('components.pricingCard.savings', { amount: planDetails.savings })}
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {planDetails.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.button
        onClick={() => onSelectPlan(plan)}
        disabled={loading || isCurrentPlan}
        className={`
          w-full py-3 px-6 rounded-lg font-medium text-center transition-all duration-200
          ${
            isPopular
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }
          ${(loading || isCurrentPlan) && 'opacity-50 cursor-not-allowed'}
          ${isHovered && !loading && !isCurrentPlan && 'shadow-xl'}
        `}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            {t('components.pricingCard.loading')}
          </div>
        ) : isCurrentPlan ? (
          t('components.pricingCard.currentPlan')
        ) : (
          <>
            {plan === SubscriptionPlan.YEARLY
              ? t('components.pricingCard.startYearly')
              : t('components.pricingCard.startMonthly')}
            <div className="text-sm opacity-80 mt-1">{t('components.pricingCard.trialInfo')}</div>
          </>
        )}
      </motion.button>

      {/* Trial Info */}
      {!isCurrentPlan && (
        <p className="text-xs text-gray-500 text-center mt-3">
          {t('components.pricingCard.validationInfo')}
        </p>
      )}
    </motion.div>
  );
}
