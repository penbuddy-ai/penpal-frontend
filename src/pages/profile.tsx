import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import useUserStore from '@/store/useUserStore';
import Button from '@/components/ui/Button/Button';
import { FormField } from '@/components/ui/FormField/FormField';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schéma de validation pour le profil
const profileSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Email invalide'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * Page de profil utilisateur
 */
function ProfilePage() {
  const { user, isLoading } = useAuth();
  const userStore = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    },
    mode: 'onChange',
  });

  // Réinitialiser le formulaire quand l'utilisateur change
  React.useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user, reset]);

  const handleUpdateProfile = async (data: ProfileFormValues) => {
    setUpdateLoading(true);
    setMessage(null);

    try {
      await userStore.updateProfile(data);
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
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Mon Profil | PenPal</title>
        <meta name="description" content="Gérez votre profil PenPal" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            {/* En-tête du profil */}
            <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user?.firstName?.charAt(0)?.toUpperCase() || user?.email.charAt(0).toUpperCase()}
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
                  {user?.role && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-2">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contenu du profil */}
            <div className="px-6 py-8">
              {/* Messages de feedback */}
              {message && (
                <div
                  className={`mb-6 p-4 rounded-md ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Formulaire de profil */}
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
                  label="Email"
                  id="email"
                  type="email"
                  disabled={!isEditing}
                  error={errors.email?.message}
                  {...register('email')}
                />

                {/* Informations supplémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Langue native
                    </label>
                    <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {user?.nativeLanguage || 'Non définie'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Langues apprises
                    </label>
                    <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {user?.learningLanguages?.length
                        ? user.learningLanguages.join(', ')
                        : 'Aucune langue sélectionnée'}
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {!isEditing ? (
                    <Button type="button" onClick={() => setIsEditing(true)} variant="outline">
                      Modifier le profil
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        variant="outline"
                        disabled={updateLoading}
                      >
                        Annuler
                      </Button>
                      <Button type="submit" disabled={!isValid || updateLoading}>
                        {updateLoading ? 'Mise à jour...' : 'Sauvegarder'}
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Section de sécurité */}
          <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Sécurité du compte
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Mot de passe
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Dernière modification il y a plus de 30 jours
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Changer
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Authentification à deux facteurs
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Sécurisez votre compte avec 2FA
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Page de profil avec protection d'authentification
 */
export default function ProtectedProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}

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
