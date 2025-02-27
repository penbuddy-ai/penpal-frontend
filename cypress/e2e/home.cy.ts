describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display welcome message', () => {
    cy.contains('Welcome to PenPal AI');
  });

  it('should have a get started button', () => {
    cy.contains('Get Started').should('be.visible');
  });

  it('should navigate to the correct page when clicking Get Started', () => {
    cy.contains('Get Started').click();
    // Update this assertion based on where your button should navigate to
    cy.url().should('include', '/get-started');
  });
});
