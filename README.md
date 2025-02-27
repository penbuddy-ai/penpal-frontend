# PenPal AI Frontend

Application d'apprentissage des langues utilisant l'intelligence artificielle pour offrir un partenaire de conversation disponible 24/7, sans jugement ni stress social.

## Concept

- Partenaire de conversation IA disponible 24/7
- S'adapte intelligemment au niveau réel de l'utilisateur
- Conversations contextuelles naturelles dans plusieurs langues
- Feedback immédiat et personnalisé pour progresser rapidement
- Suivi automatique des progrès avec analyse des points à améliorer

## Technologies

- Next.js
- TypeScript
- Tailwind CSS
- i18n pour l'internationalisation
- Zustand pour la gestion d'état
- Framer Motion pour les animations
- Tests unitaires avec Jest
- Tests E2E avec Cypress
- ESLint et Prettier pour le linting et le formatage
- Husky pour les hooks Git

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/penpal-ai-front.git
cd penpal-ai-front

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## Scripts disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire l'application pour la production
- `npm run start` - Démarrer l'application en mode production
- `npm run lint` - Vérifier le code avec ESLint
- `npm run format` - Formater le code avec Prettier
- `npm run test` - Exécuter les tests unitaires
- `npm run test:e2e` - Exécuter les tests E2E avec Cypress
- `npm run test:e2e:headless` - Exécuter les tests E2E en mode headless

## CI/CD

Le projet utilise GitHub Actions pour l'intégration et le déploiement continus. Le pipeline CI/CD comprend :

1. Vérification du code avec ESLint
2. Exécution des tests unitaires
3. Exécution des tests E2E avec Cypress
4. Déploiement automatique sur Vercel

### Branches

- `main` - Code de production
- `develop` - Code de développement
- `feature/*` - Nouvelles fonctionnalités
- `bugfix/*` - Corrections de bugs
- `release/*` - Préparation des versions

## Déploiement

L'application est automatiquement déployée sur Vercel :

- La branche `develop` est déployée sur l'environnement de développement
- La branche `main` est déployée sur l'environnement de production

## Contribution

1. Créez une branche à partir de `develop`
2. Faites vos modifications
3. Soumettez une pull request vers `develop`
