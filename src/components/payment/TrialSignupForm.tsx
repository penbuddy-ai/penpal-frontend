import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { getStripe, SubscriptionPlan, PLANS } from '../../lib/stripe';
import { PaymentService, CreateSubscriptionWithCardRequest } from '../../services/payment.service';
import { CheckIcon, CreditCardIcon } from 'lucide-react';

interface TrialSignupFormProps {
  userId: string;
  email: string;
  name: string;
  selectedPlan: SubscriptionPlan;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onBack?: () => void;
}

// Card styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: '"Inter", sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

function TrialSignupFormContent({
  userId,
  email,
  name,
  selectedPlan,
  onSuccess,
  onError,
  onBack,
}: TrialSignupFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState<'info' | 'card' | 'processing'>('info');
  const [stripeReady, setStripeReady] = useState(false);

  const planDetails = PLANS[selectedPlan];

  // Check if Stripe is ready
  React.useEffect(() => {
    if (stripe && elements) {
      setStripeReady(true);
    } else {
      setStripeReady(false);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError?.("Stripe n'est pas encore initialisé. Veuillez rafraîchir la page.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError?.('Élément de carte non trouvé. Veuillez rafraîchir la page.');
      return;
    }

    setLoading(true);

    // Add a small delay to ensure the element is stable
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: name,
          email: email,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Only change step after successful payment method creation
      setCurrentStep('processing');

      // Create subscription with card validation
      const subscriptionData: CreateSubscriptionWithCardRequest = {
        userId,
        email,
        name,
        plan: selectedPlan,
        paymentMethodId: paymentMethod.id,
      };

      await PaymentService.createSubscriptionWithCard(subscriptionData);

      // Success!
      onSuccess?.();
      router.push('/dashboard?welcome=true&trial=true');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      onError?.(errorMessage);
      setCurrentStep('card');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToCard = () => {
    setCurrentStep('card');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex items-center ${currentStep === 'info' ? 'text-blue-600' : 'text-green-600'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'info'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-green-600 bg-green-600'
              }`}
            >
              {currentStep === 'info' ? '1' : <CheckIcon className="w-4 h-4 text-white" />}
            </div>
            <span className="ml-2 font-medium">Plan sélectionné</span>
          </div>

          <div className="flex-1 h-1 mx-4 bg-gray-200 rounded">
            <div
              className={`h-1 bg-blue-600 rounded transition-all duration-300 ${
                currentStep !== 'info' ? 'w-full' : 'w-0'
              }`}
            />
          </div>

          <div
            className={`flex items-center ${
              currentStep === 'card'
                ? 'text-blue-600'
                : currentStep === 'processing'
                  ? 'text-green-600'
                  : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'card'
                  ? 'border-blue-600 bg-blue-50'
                  : currentStep === 'processing'
                    ? 'border-green-600 bg-green-600'
                    : 'border-gray-300'
              }`}
            >
              {currentStep === 'processing' ? (
                <CheckIcon className="w-4 h-4 text-white" />
              ) : (
                <CreditCardIcon className="w-4 h-4" />
              )}
            </div>
            <span className="ml-2 font-medium">Informations de paiement</span>
          </div>
        </div>
      </div>

      {/* Step 1: Plan Info */}
      {currentStep === 'info' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Confirmez votre choix</h2>
            <p className="text-gray-600">Vous avez sélectionné le plan {planDetails.name}</p>
          </div>

          {/* Plan Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{planDetails.name}</h3>
                <p className="text-gray-600">{planDetails.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{planDetails.price}€</div>
                <div className="text-gray-500">/{planDetails.interval}</div>
              </div>
            </div>

            {/* Free Trial Banner */}
            <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎉</span>
                <div>
                  <h4 className="font-semibold text-green-800">30 jours gratuits inclus !</h4>
                  <p className="text-green-700 text-sm">
                    Profitez de toutes les fonctionnalités sans payer maintenant. Le paiement
                    commencera après votre période d'essai.
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {planDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
            )}
            <button
              onClick={handleContinueToCard}
              className="flex-1 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Continuer
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Payment Info */}
      {(currentStep === 'card' || currentStep === 'processing') && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-white rounded-2xl border border-gray-200 p-8"
        >
          {currentStep === 'processing' && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Traitement en cours...</h3>
                <p className="text-gray-600">
                  Validation de votre carte et création de votre compte
                </p>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Informations de paiement</h2>
            <p className="text-gray-600">
              Nous validons votre carte avec un paiement de 0€ pour sécuriser votre essai gratuit
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`space-y-6 ${currentStep === 'processing' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {/* Security Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-blue-500 text-xl mr-3">🔒</span>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">
                    Pourquoi demandons-nous votre carte maintenant ?
                  </h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>
                      • Validation avec un paiement de <strong>0€</strong> (aucun frais)
                    </li>
                    <li>• Transition automatique après les 30 jours gratuits</li>
                    <li>• Vous pouvez annuler à tout moment</li>
                    <li>• Vos données sont sécurisées par Stripe</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Informations de carte bancaire
              </label>

              <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <CardElement
                  options={cardElementOptions}
                  onChange={(event) => {
                    setCardComplete(event.complete);
                  }}
                  onReady={() => {}}
                  onFocus={() => {}}
                  onBlur={() => {}}
                />
              </div>

              <p className="text-xs text-gray-500">
                Vos informations sont sécurisées et chiffrées par Stripe. Aucun paiement ne sera
                effectué pendant votre essai gratuit.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep('info')}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>

              <motion.button
                type="submit"
                disabled={!stripeReady || !cardComplete || loading}
                className={`
                  flex-1 py-3 px-6 rounded-lg font-medium text-white transition-all duration-200
                  ${
                    !stripeReady || !cardComplete || loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
                  }
                `}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Validation en cours...
                  </div>
                ) : (
                  'Commencer mon essai gratuit'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}

export function TrialSignupForm(props: TrialSignupFormProps) {
  const [stripeError, setStripeError] = useState<string | null>(null);

  const stripePromise = React.useMemo(() => {
    try {
      return getStripe();
    } catch (error) {
      setStripeError(error instanceof Error ? error.message : 'Erreur de chargement Stripe');
      return null;
    }
  }, []);

  if (stripeError) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="font-medium text-red-800 mb-2">
                Erreur de chargement du système de paiement
              </h3>
              <p className="text-red-700 text-sm mb-4">{stripeError}</p>
              <div className="text-red-700 text-sm">
                <p className="font-medium mb-2">Solutions :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Désactivez votre bloqueur de publicités</li>
                  <li>Ajoutez *.stripe.com à votre liste blanche</li>
                  <li>Essayez en mode navigation privée</li>
                  <li>Utilisez un autre navigateur</li>
                </ul>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Rafraîchir la page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du système de paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <TrialSignupFormContent {...props} />
    </Elements>
  );
}
