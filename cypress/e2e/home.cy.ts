describe('Home Page', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.contains('PenPal AI').should('be.visible');
  });
});
