// /**
//  * End-to-end tests for user profile functionality
//  */
// describe('User Profile', () => {
//   beforeEach(() => {
//     // Load user fixture
//     cy.fixture('user.json').as('userData');

//     // Intercept API calls
//     cy.intercept('GET', '/api/user/profile', { fixture: 'user.json' }).as('getUserProfile');

//     // Visit the profile page
//     cy.visit('/profile');

//     // Wait for the API call to complete
//     cy.wait('@getUserProfile');
//   });

//   it('should display user information correctly', () => {
//     // Get user data from fixture
//     cy.get('@userData').then((userData: any) => {
//       // Check if user name is displayed
//       cy.contains(userData.name).should('be.visible');

//       // Check if user email is displayed
//       cy.contains(userData.email).should('be.visible');

//       // Check if language preference is displayed
//       cy.contains(userData.preferences.language === 'fr' ? 'Français' : 'English').should('be.visible');
//     });
//   });

//   it('should allow changing user preferences', () => {
//     // Click on the theme toggle
//     cy.contains('Thème').click();

//     // Select dark theme
//     cy.contains('Sombre').click();

//     // Verify that the theme has changed
//     cy.get('html').should('have.class', 'dark');
//   });
// });
