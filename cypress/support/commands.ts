/// <reference types="cypress" />

// Add custom commands here
Cypress.Commands.add('login', (email, password) => {
  // Implementation will depend on your authentication method
  cy.visit('/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
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
    }
  }
}

export {};
