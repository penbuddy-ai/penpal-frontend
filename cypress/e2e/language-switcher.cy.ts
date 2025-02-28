/**
 * End-to-end tests for language switcher functionality
 */
describe('Language Switcher', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should switch language when clicking on language option', () => {
    // Find and click the English language option
    cy.contains('English').click();

    // URL should now contain the 'en' locale
    cy.url().should('include', '/en');

    // The language switcher should now show the French option
    cy.contains('Français').should('be.visible');
    cy.contains('English').should('not.exist');

    // Click on the French option to switch back
    cy.contains('Français').click();

    // URL should now contain the 'fr' locale or no locale (default)
    cy.url().should('not.include', '/en');

    // The language switcher should now show the English option again
    cy.contains('English').should('be.visible');
    cy.contains('Français').should('not.exist');
  });
});
