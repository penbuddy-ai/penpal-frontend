# Module d'Onboarding Penpal

## 📋 Description

Le module d'onboarding guide les nouveaux utilisateurs à travers un processus de configuration étape par étape pour personnaliser leur expérience d'apprentissage linguistique sur Penpal.

## 🏗️ Architecture

### Structure des composants

```
src/components/onboarding/
├── OnboardingFlow.tsx          # Composant principal du flux
├── ProgressIndicator.tsx       # Indicateur de progression
├── NavigationButtons.tsx       # Boutons de navigation
├── steps/                      # Composants des étapes
│   ├── PreferredNameStep.tsx   # Étape 1: Nom préféré
│   ├── LanguageSelectionStep.tsx # Étape 2: Langue d'apprentissage
│   ├── ProficiencyLevelStep.tsx # Étape 3: Niveau de compétence
│   └── SummaryStep.tsx         # Étape 4: Récapitulatif
└── __tests__/                  # Tests unitaires
    └── OnboardingFlow.test.tsx
```

### Store et gestion d'état

```
src/store/onboardingStore.ts    # Store Zustand pour l'état global
src/types/onboarding.ts         # Types TypeScript
src/services/onboarding.service.ts # Service API
```

## 🚀 Fonctionnalités

### ✨ Étapes d'onboarding

1. **Nom préféré** (`PreferredNameStep`)

   - Saisie du nom d'usage
   - Validation en temps réel
   - Exemples interactifs

2. **Langue d'apprentissage** (`LanguageSelectionStep`)

   - Sélection parmi 7 langues populaires
   - Interface visuelle avec drapeaux
   - Feedback de confirmation

3. **Niveau de compétence** (`ProficiencyLevelStep`)

   - Choix entre Débutant, Intermédiaire, Avancé
   - Descriptions détaillées de chaque niveau
   - Icônes visuelles

4. **Récapitulatif** (`SummaryStep`)
   - Aperçu des informations saisies
   - Possibilité de modification
   - Finalisation du processus

### 🎯 Fonctionnalités avancées

- **Progressive Enhancement** : Sauvegarde automatique du progrès
- **Validation** : Contrôles de cohérence à chaque étape
- **Responsive Design** : Adaptable à tous les écrans
- **Animations** : Transitions fluides avec Framer Motion
- **Extensibilité** : Architecture modulaire pour ajouter de nouvelles étapes

## 🛠️ Utilisation

### Page d'onboarding

```tsx
// src/pages/onboarding.tsx
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
```

### Store d'onboarding

```tsx
import { useOnboardingStore } from '@/store/onboardingStore';

function MyComponent() {
  const { currentStep, progress, data, setPreferredName, nextStep, previousStep } =
    useOnboardingStore();

  // Utilisation du store...
}
```

## 🔧 Configuration

### Ajout d'une nouvelle étape

1. **Créer le composant d'étape**

```tsx
// src/components/onboarding/steps/NewStep.tsx
export function NewStep() {
  const { data, setNewField } = useOnboardingStore();

  return <div>{/* Interface de l'étape */}</div>;
}
```

2. **Ajouter à la configuration des étapes**

```tsx
// src/store/onboardingStore.ts
export const ONBOARDING_STEPS: OnboardingStep[] = [
  // ... étapes existantes
  {
    id: 'new-step',
    title: 'Nouvelle étape',
    description: 'Description de la nouvelle étape',
    component: 'NewStep',
    isRequired: true,
  },
];
```

3. **Mapper le composant**

```tsx
// src/components/onboarding/OnboardingFlow.tsx
const stepComponents = {
  // ... composants existants
  'new-step': NewStep,
};
```

### Types d'onboarding

```tsx
// src/types/onboarding.ts
export interface OnboardingData {
  preferredName: string;
  learningLanguage: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
  // Ajouter nouveaux champs ici
  newField?: string;
}
```

## 🧪 Tests

### Lancer les tests

```bash
npm test OnboardingFlow
```

### Structure des tests

- Tests unitaires pour chaque composant
- Tests d'intégration pour le flux complet
- Mocks pour les services externes

## 🎨 Personnalisation

### Thème et styles

Les composants utilisent Tailwind CSS avec des classes personnalisables :

```tsx
// Exemple de personnalisation
className = 'bg-gradient-to-br from-blue-500 to-indigo-600';
```

### Animations

Personnalisation des animations Framer Motion :

```tsx
const stepVariants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
};
```

## 🔗 API Backend

### Endpoints utilisés

- `PATCH /users/:id/onboarding/progress` - Sauvegarde du progrès
- `PATCH /users/:id/onboarding/complete` - Finalisation de l'onboarding
- `GET /users/:id/onboarding/status` - Statut de l'onboarding

### Structure des données envoyées

```json
{
  "preferredName": "Marie",
  "learningLanguages": ["en"],
  "proficiencyLevels": {
    "en": "intermediate"
  },
  "onboardingCompleted": true
}
```

## 📱 Responsive Design

Le module est optimisé pour :

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🌐 Internationalisation

Support pour l'ajout de nouvelles langues dans `POPULAR_LANGUAGES` :

```tsx
export const POPULAR_LANGUAGES: Language[] = [
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    isPopular: true,
  },
];
```

## 🚨 Gestion d'erreurs

- Validation côté client en temps réel
- Messages d'erreur contextuelle
- Fallbacks gracieux en cas d'échec réseau
- Sauvegarde locale pour récupération

## 📈 Performance

- Lazy loading des composants d'étapes
- Mise en cache du progrès avec localStorage
- Optimisation des re-renders avec Zustand
- Prefetch des ressources critiques

## 🔒 Sécurité

- Validation des données côté backend
- Authentification requise pour tous les endpoints
- Sanitisation des entrées utilisateur
- Protection contre les injections

---

**Développé avec ❤️ pour l'équipe Penpal**
