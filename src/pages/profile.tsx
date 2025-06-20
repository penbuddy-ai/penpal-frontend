import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/auth';
import { useHydratedUserStore } from '@/hooks/useHydratedUserStore';
import { useSubscription } from '@/hooks/useSubscription';
import Button from '@/components/ui/Button/Button';
import { FormField } from '@/components/ui/FormField/FormField';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentService } from '@/services/payment.service';
import { PLANS } from '@/lib/stripe';
import {
  CreditCardIcon,
  CalendarIcon,
  AlertTriangleIcon,
  CheckIcon,
  UserIcon,
  ShieldIcon,
  KeyIcon,
  SmartphoneIcon,
  EditIcon,
} from 'lucide-react';
import { ConfirmationModal, AlertModal } from '@/components/ui/Modal';
import { useModal } from '@/hooks/useModal';

// Profile schema
const profileSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Email invalide'),
  preferredName: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * User profile page
 */
function ProfilePage() {
  const { user, isLoading, isHydrated, isAuthenticated, updateProfile } = useHydratedUserStore();
  const router = useRouter();
  const { subscription, getSubscriptionDisplayText } = useSubscription();
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const cancelModal = useModal();
  const successModal = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      preferredName: (user as any)?.preferredName || '',
    },
    mode: 'onChange',
  });

  // Solve hydration problem by delaying client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Authentication management with hydration
  useEffect(() => {
    // Only redirect if the store is hydrated, not loading, and not authenticated
    if (isHydrated && !isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
      return;
    }
  }, [isAuthenticated, isLoading, isHydrated, router]);

  // Reset form when user changes
  React.useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        preferredName: (user as any).preferredName || '',
      });
    }
  }, [user, reset]);

  const handleUpdateProfile = async (data: ProfileFormValues) => {
    setUpdateLoading(true);
    setMessage(null);

    try {
      await updateProfile(data);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setMessage(null);
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        preferredName: (user as any).preferredName || '',
      });
    }
  };

  const handleCancelSubscription = async () => {
    if (!user?.id || !subscription.hasActiveSubscription) return;

    setCancelLoading(true);
    setMessage(null);

    try {
      await PaymentService.cancelSubscription(user.id, true); // cancelAtPeriodEnd = true
      cancelModal.closeModal();
      successModal.openModal();

      // Refresh user data to get updated cancelAtPeriodEnd status
      window.location.reload();
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : "Erreur lors de l'annulation de l'abonnement",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  // Show loading state while checking authentication or hydrating
  if (!isHydrated || isLoading || (!isAuthenticated && !user)) {
    return (
      <Layout>
        <div className="h-[calc(100vh-73px)] flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 mx-auto mb-4"
            >
              <div className="w-12 h-12 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {!isHydrated ? 'Initialisation...' : "Vérification de l'authentification..."}
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Mon Profil | PenPal AI</title>
          <meta name="description" content="Gérez votre profil PenPal AI" />
        </Head>

        <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Profile header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-gray-700/50 rounded-2xl mb-8"
            >
              <div className="px-8 py-10">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user?.firstName?.charAt(0)?.toUpperCase() ||
                      user?.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mt-1">{user?.email}</p>
                    {user?.role && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-200 mt-3">
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Profile form - Left column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-gray-700/50 rounded-2xl"
              >
                <div className="px-8 py-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <UserIcon className="w-5 h-5 mr-3 text-blue-500" />
                      Informations personnelles
                    </h2>
                    {!isEditing && (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <EditIcon size={16} />
                        Modifier
                      </Button>
                    )}
                  </div>

                  {/* Feedback messages */}
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`mb-6 p-4 rounded-xl border ${
                        message.type === 'success'
                          ? 'bg-green-50/80 text-green-800 border-green-200/50 dark:bg-green-900/20 dark:text-green-200 dark:border-green-700/50'
                          : 'bg-red-50/80 text-red-800 border-red-200/50 dark:bg-red-900/20 dark:text-red-200 dark:border-red-700/50'
                      }`}
                    >
                      {message.text}
                    </motion.div>
                  )}

                  {/* Profile form */}
                  <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Prénom"
                        id="firstName"
                        type="text"
                        disabled={!isEditing}
                        error={errors.firstName?.message}
                        {...register('firstName')}
                      />

                      <FormField
                        label="Nom"
                        id="lastName"
                        type="text"
                        disabled={!isEditing}
                        error={errors.lastName?.message}
                        {...register('lastName')}
                      />
                    </div>

                    <FormField
                      label="Nom préféré (optionnel)"
                      id="preferredName"
                      type="text"
                      disabled={!isEditing}
                      error={errors.preferredName?.message}
                      {...register('preferredName')}
                    />

                    <FormField
                      label="Email"
                      id="email"
                      type="email"
                      disabled={!isEditing}
                      error={errors.email?.message}
                      {...register('email')}
                    />

                    {/* Additional information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Langue native
                        </label>
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-200/30 dark:border-blue-700/30 rounded-xl text-gray-700 dark:text-gray-300">
                          {user?.nativeLanguage || 'Non définie'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Langues apprises
                        </label>
                        <div className="px-4 py-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200/30 dark:border-purple-700/30 rounded-xl text-gray-700 dark:text-gray-300">
                          {user?.learningLanguages?.length
                            ? user.learningLanguages.join(', ')
                            : 'Aucune langue sélectionnée'}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {isEditing && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                        <Button
                          type="button"
                          onClick={handleCancelEdit}
                          variant="outline"
                          disabled={updateLoading}
                        >
                          Annuler
                        </Button>
                        <Button type="submit" disabled={!isValid || updateLoading}>
                          {updateLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Mise à jour...
                            </div>
                          ) : (
                            'Sauvegarder'
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              </motion.div>

              {/* Right column - Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-gray-700/50 rounded-2xl h-fit"
              >
                <div className="px-8 py-8 h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <ShieldIcon className="w-5 h-5 mr-3 text-green-500" />
                      Sécurité
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-700/50 dark:to-blue-900/20 border border-gray-200/30 dark:border-gray-600/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <KeyIcon className="w-5 h-5 text-blue-500 mr-4" />
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">
                              Mot de passe
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Dernière modification récente
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Changer
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-gray-50/80 to-purple-50/80 dark:from-gray-700/50 dark:to-purple-900/20 border border-gray-200/30 dark:border-gray-600/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <SmartphoneIcon className="w-5 h-5 text-purple-500 mr-4" />
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">
                              Authentification 2FA
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Protection supplémentaire
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Configurer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Subscription section - Full width */}
            {isClient && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-gray-700/50 rounded-2xl"
              >
                <div className="px-8 py-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 flex items-center">
                    <CreditCardIcon className="w-6 h-6 mr-3 text-blue-500" />
                    Mon Abonnement
                  </h2>

                  {/* Current status */}
                  <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-2xl p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <div
                            className={`w-4 h-4 rounded-full mr-4 ${
                              subscription.hasActiveSubscription || subscription.isInTrial
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          ></div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {getSubscriptionDisplayText}
                          </h3>
                        </div>

                        {/* Plan details */}
                        {subscription.plan && (
                          <div className="space-y-3 mb-6">
                            <div className="text-gray-600 dark:text-gray-300">
                              <strong>Plan :</strong>{' '}
                              {PLANS[subscription.plan]?.name || subscription.plan}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                              <strong>Prix :</strong> {PLANS[subscription.plan]?.price || 'N/A'}€/
                              {PLANS[subscription.plan]?.interval || 'N/A'}
                            </div>
                          </div>
                        )}

                        {/* Trial status */}
                        {subscription.isInTrial && (
                          <div className="bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200/50 dark:border-yellow-700/50 rounded-xl p-6 mb-6">
                            <div className="flex items-start">
                              <CalendarIcon className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                                  Période d'essai gratuit
                                </h4>
                                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                                  {subscription.daysLeftInTrial} jour
                                  {subscription.daysLeftInTrial > 1 ? 's' : ''} restant
                                  {subscription.daysLeftInTrial > 1 ? 's' : ''}
                                  {subscription.trialEnd && (
                                    <span>
                                      {' '}
                                      • Se termine le{' '}
                                      {subscription.trialEnd.toLocaleDateString('fr-FR')}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Cancellation status */}
                        {user?.cancelAtPeriodEnd && (
                          <div className="bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200/50 dark:border-orange-700/50 rounded-xl p-6 mb-6">
                            <div className="flex items-start">
                              <AlertTriangleIcon className="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-orange-800 dark:text-orange-200">
                                  Abonnement en cours d'annulation
                                </h4>
                                <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
                                  Votre abonnement se terminera à la fin de votre période de
                                  facturation actuelle. Vous garderez l'accès à toutes les
                                  fonctionnalités jusqu'à cette date.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Fonctionnalités incluses */}
                        {subscription.plan && PLANS[subscription.plan] && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                              Fonctionnalités incluses :
                            </h4>
                            <ul className="space-y-3">
                              {PLANS[subscription.plan].features.map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-center text-gray-600 dark:text-gray-300"
                                >
                                  <CheckIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="ml-8 flex flex-col space-y-3">
                        {subscription.hasActiveSubscription && !user?.cancelAtPeriodEnd && (
                          <Button
                            onClick={cancelModal.openModal}
                            variant="outline"
                            size="sm"
                            disabled={cancelLoading}
                            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                          >
                            Annuler l'abonnement
                          </Button>
                        )}

                        {!subscription.hasActiveSubscription && !subscription.isInTrial && (
                          <Button onClick={() => (window.location.href = '/pricing')} size="sm">
                            Choisir un plan
                          </Button>
                        )}

                        {(subscription.hasActiveSubscription || subscription.isInTrial) && (
                          <Button
                            onClick={() => (window.location.href = '/pricing')}
                            variant="outline"
                            size="sm"
                          >
                            Changer de plan
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Avertissement si essai expiré */}
                  {subscription.isTrialExpired && (
                    <div className="mt-6 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/50 dark:border-red-700/50 rounded-xl p-6">
                      <div className="flex items-start">
                        <AlertTriangleIcon className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-200">
                            Essai gratuit expiré
                          </h4>
                          <p className="text-red-700 dark:text-red-300 text-sm mt-1 mb-4">
                            Votre période d'essai a pris fin. Choisissez un plan pour continuer à
                            utiliser Penpal AI.
                          </p>
                          <Button onClick={() => (window.location.href = '/pricing')} size="sm">
                            Voir les plans
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Modale de confirmation d'annulation - Seulement affiché côté client */}
        {isClient && (
          <>
            <ConfirmationModal
              isOpen={cancelModal.isOpen}
              onClose={cancelModal.closeModal}
              onConfirm={handleCancelSubscription}
              title="Annuler votre abonnement"
              message="Êtes-vous sûr de vouloir annuler votre abonnement ? Vous garderez l'accès jusqu'à la fin de votre période de facturation actuelle, mais votre abonnement ne sera pas renouvelé."
              confirmText="Oui, annuler"
              cancelText="Non, garder"
              type="danger"
              isLoading={cancelLoading}
            />

            <AlertModal
              isOpen={successModal.isOpen}
              onClose={successModal.closeModal}
              title="Abonnement annulé avec succès"
              message="Votre abonnement a été annulé et se terminera à la fin de votre période de facturation actuelle. Vous garderez l'accès à toutes les fonctionnalités jusqu'à cette date."
              type="success"
              closeText="D'accord"
            />
          </>
        )}
      </Layout>
    </ProtectedRoute>
  );
}

/**
 * Page de profil avec gestion d'authentification intégrée
 */
export default ProfilePage;

/**
 * Get static props pour la page de profil
 */
export const getStaticProps: GetStaticProps = async ({ locale = 'fr' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };
};
