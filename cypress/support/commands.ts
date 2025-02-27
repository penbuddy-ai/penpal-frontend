/// <reference types="cypress" />

// Add custom commands here
Cypress.Commands.add('login', (email, password) => {
  // Implementation will depend on your authentication method
  cy.visit('/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
});

// Commande pour changer le thème
Cypress.Commands.add('setTheme', (theme: 'light' | 'dark' | 'system') => {
  // Trouver et cliquer sur le bouton correspondant au thème
  if (theme === 'light') {
    cy.get('button[aria-label="Activer le thème clair"]').click();
  } else if (theme === 'dark') {
    cy.get('button[aria-label="Activer le thème sombre"]').click();
  } else if (theme === 'system') {
    cy.get('button[aria-label="Utiliser le thème système"]').click();
  }
});

// Commande pour simuler la préférence système
Cypress.Commands.add('setSystemThemePreference', (preference: 'light' | 'dark') => {
  cy.window().then((win) => {
    win.matchMedia = (query) => ({
      matches: query.includes('dark') ? preference === 'dark' : preference === 'light',
      media: query,
      onchange: null,
      addListener: cy.stub(),
      removeListener: cy.stub(),
      addEventListener: cy.stub(),
      removeEventListener: cy.stub(),
      dispatchEvent: cy.stub(),
    });
  });
});

// Declare global Cypress namespace to add custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login to the application
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<Element>;

      /**
       * Custom command to set the theme
       * @example cy.setTheme('dark')
       */
      setTheme(theme: 'light' | 'dark' | 'system'): Chainable<Element>;

      /**
       * Custom command to simulate system theme preference
       * @example cy.setSystemThemePreference('dark')
       */
      setSystemThemePreference(preference: 'light' | 'dark'): Chainable<Element>;
    }
  }
}

export {};
