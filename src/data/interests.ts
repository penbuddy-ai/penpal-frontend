/**
 * Interests data
 */

import { UserInterest } from '@/types/onboarding';

export const AVAILABLE_INTERESTS: UserInterest[] = [
  // Arts & Culture
  { id: 'art', name: 'Art', category: 'culture' },
  { id: 'cinema', name: 'Cinéma', category: 'culture' },
  { id: 'literature', name: 'Littérature', category: 'culture' },
  { id: 'music', name: 'Musique', category: 'culture' },
  { id: 'photography', name: 'Photographie', category: 'culture' },
  { id: 'theater', name: 'Théâtre', category: 'culture' },

  // Sciences
  { id: 'astronomy', name: 'Astronomie', category: 'science' },
  { id: 'biology', name: 'Biologie', category: 'science' },
  { id: 'technology', name: 'Technologie', category: 'science' },
  { id: 'environment', name: 'Environnement', category: 'science' },
  { id: 'psychology', name: 'Psychologie', category: 'science' },

  // Sports & Loisirs
  { id: 'sports', name: 'Sports', category: 'leisure' },
  { id: 'cooking', name: 'Cuisine', category: 'leisure' },
  { id: 'travel', name: 'Voyages', category: 'leisure' },
  { id: 'gaming', name: 'Jeux vidéo', category: 'leisure' },
  { id: 'gardening', name: 'Jardinage', category: 'leisure' },
  { id: 'fashion', name: 'Mode', category: 'leisure' },

  // Business & Carrière
  { id: 'business', name: 'Business', category: 'career' },
  { id: 'entrepreneurship', name: 'Entrepreneuriat', category: 'career' },
  { id: 'marketing', name: 'Marketing', category: 'career' },
  { id: 'finance', name: 'Finance', category: 'career' },
  { id: 'career', name: 'Développement de carrière', category: 'career' },

  // Société
  { id: 'politics', name: 'Politique', category: 'society' },
  { id: 'history', name: 'Histoire', category: 'society' },
  { id: 'economy', name: 'Économie', category: 'society' },
  { id: 'philosophy', name: 'Philosophie', category: 'society' },
  { id: 'current_events', name: 'Actualités', category: 'society' },

  // Santé & Bien-être
  { id: 'health', name: 'Santé', category: 'wellness' },
  { id: 'fitness', name: 'Fitness', category: 'wellness' },
  { id: 'nutrition', name: 'Nutrition', category: 'wellness' },
  { id: 'meditation', name: 'Méditation', category: 'wellness' },
  { id: 'personal_development', name: 'Développement personnel', category: 'wellness' },
];

// Regroupement par catégorie pour l'affichage
export const INTEREST_CATEGORIES = [
  { id: 'culture', name: 'Arts & Culture' },
  { id: 'science', name: 'Sciences & Technologie' },
  { id: 'leisure', name: 'Sports & Loisirs' },
  { id: 'career', name: 'Business & Carrière' },
  { id: 'society', name: 'Société' },
  { id: 'wellness', name: 'Santé & Bien-être' },
];

// Fonction pour obtenir les intérêts groupés par catégorie
export const getInterestsByCategory = () => {
  return INTEREST_CATEGORIES.map((category) => ({
    ...category,
    interests: AVAILABLE_INTERESTS.filter((interest) => interest.category === category.id),
  }));
};
