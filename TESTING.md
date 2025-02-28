# Guide de Tests pour Penpal AI Frontend

Ce document explique comment écrire et exécuter les tests pour le frontend de Penpal AI.

## Types de Tests

Le projet utilise trois types de tests :

1. **Tests Unitaires** : Tests de fonctions individuelles et utilitaires
2. **Tests de Composants** : Tests de composants React isolés
3. **Tests End-to-End (E2E)** : Tests qui simulent le comportement utilisateur dans un navigateur

## Outils de Test

- **Jest** : Framework de test pour les tests unitaires et de composants
- **React Testing Library** : Bibliothèque pour tester les composants React
- **Cypress** : Outil pour les tests end-to-end et les tests de composants

## Structure des Tests

```
penpal-ai-front/
├── tests/
│   ├── setup.js             # Configuration Jest
│   ├── __mocks__/           # Mocks pour les imports
│   └── unit/                # Tests unitaires et de composants
│       ├── components/      # Tests de composants
│       └── lib/             # Tests de fonctions utilitaires
├── cypress/
│   ├── e2e/                 # Tests end-to-end
│   ├── component/           # Tests de composants avec Cypress
│   └── support/             # Fichiers de support Cypress
```

## Exécution des Tests

### Tests Unitaires et de Composants avec Jest

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm test -- --watch

# Exécuter les tests avec couverture
npm test -- --coverage
```

### Tests End-to-End avec Cypress

```bash
# Ouvrir l'interface Cypress
npm run test:e2e

# Exécuter les tests en mode headless
npm run test:e2e:headless
```

## Écrire des Tests

### Tests Unitaires

```typescript
// tests/unit/lib/utils.test.ts
import { maFonction } from '../../../src/lib/utils';

describe('maFonction', () => {
  test('devrait faire quelque chose', () => {
    expect(maFonction('input')).toBe('output attendu');
  });
});
```

### Tests de Composants avec React Testing Library

```typescript
// tests/unit/components/MonComposant.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MonComposant from '../../../src/components/MonComposant';

describe('MonComposant', () => {
  test('devrait rendre correctement', () => {
    render(<MonComposant />);
    expect(screen.getByText('Texte attendu')).toBeInTheDocument();
  });

  test('devrait réagir aux interactions utilisateur', async () => {
    render(<MonComposant />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Nouveau texte')).toBeInTheDocument();
  });
});
```

### Tests End-to-End avec Cypress

```typescript
// cypress/e2e/mon-test.cy.ts
describe('Mon test E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('devrait effectuer une action utilisateur', () => {
    cy.contains('Bouton').click();
    cy.url().should('include', '/nouvelle-page');
    cy.contains('Texte sur la nouvelle page').should('be.visible');
  });
});
```

### Tests de Composants avec Cypress

```typescript
// cypress/component/MonComposant.cy.tsx
import MonComposant from '../../src/components/MonComposant';

describe('MonComposant', () => {
  it('devrait rendre correctement', () => {
    cy.mount(<MonComposant />);
    cy.contains('Texte attendu').should('be.visible');
  });
});
```

## Mocks

### Mocking des API

Pour les tests unitaires et de composants, nous utilisons Jest pour mocker les appels API :

```typescript
// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mocked data' }),
    ok: true,
    status: 200,
  })
);

// Vérifier les appels
expect(global.fetch).toHaveBeenCalledWith('/api/endpoint');
```

Pour Cypress, nous pouvons intercepter les requêtes réseau :

```typescript
cy.intercept('GET', '/api/endpoint', { fixture: 'example.json' }).as('getData');
cy.wait('@getData');
```

### Mocking de Next.js Router

```typescript
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    query: {},
    asPath: '/',
    locale: 'fr',
    // autres propriétés nécessaires
  }),
}));
```

## Couverture de Code

La configuration de couverture de code est définie dans `jest.config.js`. Pour voir la couverture :

```bash
npm test -- --coverage
```

Un rapport HTML sera généré dans le dossier `coverage/`.

## Bonnes Pratiques

1. **Testez le comportement, pas l'implémentation** : Concentrez-vous sur ce que l'utilisateur voit et fait.
2. **Utilisez des sélecteurs accessibles** : Préférez `getByRole`, `getByLabelText` à `getByTestId`.
3. **Gardez les tests simples** : Un test devrait vérifier une seule chose.
4. **Évitez les tests fragiles** : Ne testez pas les styles ou les détails d'implémentation qui peuvent changer.
5. **Utilisez des fixtures** : Pour les données de test réutilisables.
6. **Isolez les tests** : Chaque test devrait être indépendant des autres.

## CI/CD

Les tests sont exécutés automatiquement dans le pipeline CI/CD avec les commandes suivantes :

```bash
npm run test:ci        # Tests Jest
npm run cypress:ci     # Tests Cypress
```

## Résolution des Problèmes

- **Tests lents** : Utilisez `--runInBand` pour exécuter les tests en série.
- **Tests instables** : Augmentez les timeouts ou utilisez `cy.wait()` pour les tests Cypress.
- **Erreurs de mémoire** : Utilisez `--maxWorkers=2` pour limiter le nombre de workers Jest.
