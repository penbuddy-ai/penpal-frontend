# Guide de Migration vers les Traductions i18n

## Travail Effectué

### ✅ Fichiers de traduction créés

Les nouveaux fichiers de traduction suivants ont été créés dans `public/locales/` :

1. **`onboarding.json`** (fr/en) - Textes pour le processus d'onboarding
2. **`chat.json`** (fr/en) - Interface de chat et messages
3. **`profile.json`** (fr/en) - Page de profil utilisateur
4. **`pages.json`** (fr/en) - Pages générales (accueil, tarifs, auth, etc.)
5. **`ui.json`** (fr/en) - Éléments d'interface utilisateur
6. **`common.json`** (mis à jour) - Éléments communs étendus

### ✅ Composants partiellement migués

1. **`PreferredNameStep.tsx`** - ✅ Entièrement migré
2. **`MessageInput.tsx`** - ✅ Entièrement migré
3. **`MessageBubble.tsx`** - ⚠️ Partiellement migré (import ajouté)
4. **`UserMenu.tsx`** - ⚠️ Partiellement migré (import ajouté)

## Prochaines Étapes

### 🔧 Pages à migrer prioritairement

#### 1. Pages principales

```typescript
// src/pages/index.tsx - Page d'accueil
// Remplacer les textes comme :
"maîtriser les langues" → t('pages.home.hero.title')
"Commencer à chatter" → t('pages.home.hero.getStarted')

// src/pages/profile.tsx - Page de profil
// Remplacer les textes comme :
"Mon Profil | PenPal AI" → t('profile.title')
"Prénom" → t('profile.firstName')
"Sauvegarder" → t('profile.actions.save')

// src/pages/auth/*.tsx - Pages d'authentification
// Utiliser auth.json existant + pages.json
```

#### 2. Composants onboarding

```typescript
// src/components/onboarding/steps/LanguageSelectionStep.tsx
// src/components/onboarding/steps/ProficiencyLevelStep.tsx
// src/components/onboarding/steps/SummaryStep.tsx
// Utiliser onboarding.json
```

#### 3. Composants de thème

```typescript
// src/components/theme/ThemeToggle.tsx
// Utiliser ui.json pour les labels des thèmes
aria-label="Activer le thème clair" → aria-label={t('ui.theme.light')}
```

### 📋 Template pour la migration

Pour chaque composant/page :

1. **Ajouter l'import useTranslation :**

```typescript
import { useTranslation } from 'react-i18next';
```

2. **Initialiser le hook :**

```typescript
const { t } = useTranslation('namespace'); // namespace = onboarding, chat, profile, pages, ui, common, auth
```

3. **Remplacer les textes français :**

```typescript
// Avant
<h1>Bienvenue sur Penpal !</h1>

// Après
<h1>{t('welcome.title')}</h1>
```

### 🎯 Textes Français Identifiés

#### Pages critiques avec textes français en dur :

1. **`src/pages/checkout.tsx`**

   - "Bienvenue {{firstName}} {{lastName}} !"
   - "Erreur lors de l'inscription"
   - "Des questions ? Contactez-nous à"

2. **`src/pages/demo.tsx`**

   - "Découvrez l'intelligence artificielle..."
   - Instructions de configuration

3. **`src/pages/pricing.tsx`**

   - "Choisissez votre plan Penpal AI"
   - "Votre essai gratuit se termine dans..."
   - FAQ sections

4. **`src/pages/onboarding.tsx`**

   - "Bienvenue sur Penpal ! 🎉"
   - "Votre profil a été configuré..."

5. **`src/store/chatStore.ts`**
   - Messages de simulation
   - Messages d'erreur

### 🚀 Commandes pour tester

```bash
# Démarrer le serveur de développement
npm run dev

# Changer la langue dans l'interface pour tester
# Vérifier que les traductions s'affichent correctement

# Ou modifier manuellement dans le navigateur :
localStorage.setItem('i18nextLng', 'en'); // Pour anglais
localStorage.setItem('i18nextLng', 'fr'); // Pour français
```

### 🔍 Recherche de textes français

```bash
# Chercher tous les textes français dans les composants
grep -r "Bienvenue\|Bonjour\|Merci\|Désolé\|Erreur\|Succès" src/ --include="*.tsx" --include="*.jsx"

# Chercher les placeholders français
grep -r "placeholder.*[àâäéèêëïîôöùûüÿç]" src/ --include="*.tsx" --include="*.jsx"

# Chercher les aria-label français
grep -r "aria-label.*[àâäéèêëïîôöùûüÿç]" src/ --include="*.tsx" --include="*.jsx"
```

### ⚡ Script d'automatisation suggéré

Créer un script pour automatiser les remplacements courants :

```typescript
// scripts/migrate-translations.ts
const commonReplacements = {
  'Chargement...': "t('common.loading')",
  Erreur: "t('common.error')",
  Succès: "t('common.success')",
  Sauvegarder: "t('common.save')",
  Annuler: "t('common.cancel')",
  // ...autres remplacements fréquents
};
```

### 📝 Points d'attention

1. **Interpolation des variables :**

```typescript
// Pour les textes avec variables comme "Bonjour {{firstName}}"
t('greeting', { firstName: user.firstName });
```

2. **Gestion du pluriel :**

```typescript
// Pour "1 jour" vs "2 jours"
t('daysLeft', { count: days });
```

3. **Formatage des dates :**

```typescript
// Utiliser les locales pour formater les dates
date.toLocaleDateString(i18n.language);
```

4. **Namespace approprié :**

- `common` : Éléments génériques réutilisables
- `auth` : Authentification
- `onboarding` : Processus d'inscription
- `chat` : Interface de chat
- `profile` : Page de profil
- `pages` : Pages spécifiques
- `ui` : Composants d'interface

### 🎯 Priorité de migration

1. **Haute priorité :** Pages d'authentification, onboarding, profil
2. **Moyenne priorité :** Chat, tarifs, accueil
3. **Basse priorité :** Pages admin, composants secondaires

Le système est maintenant prêt pour une migration complète. Tous les fichiers de traduction sont en place et les premiers composants servent d'exemple pour continuer le travail.
