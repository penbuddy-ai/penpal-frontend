/**
 * Component tests for LanguageSwitcher using Cypress
 */
import LanguageSwitcher from '../../src/components/LanguageSwitcher';

// Mock Next.js router
const mockRouter = {
  pathname: '/',
  query: {},
  asPath: '/',
  locales: ['fr', 'en'],
  locale: 'fr', // Current locale is French
  events: {
    on: cy.stub(),
    off: cy.stub(),
    emit: cy.stub(),
  },
};

// Mock the useRouter hook
cy.stub(require('next/router'), 'useRouter').returns(mockRouter);

describe('LanguageSwitcher Component', () => {
  it('renders with English option when locale is French', () => {
    // Mount the component
    cy.mount(<LanguageSwitcher />);

    // Should show the English option
    cy.contains('English').should('be.visible');

    // Should not show the French option
    cy.contains('Français').should('not.exist');
  });

  it('renders with French option when locale is English', () => {
    // Change the mock locale to English
    mockRouter.locale = 'en';

    // Mount the component
    cy.mount(<LanguageSwitcher />);

    // Should show the French option
    cy.contains('Français').should('be.visible');

    // Should not show the English option
    cy.contains('English').should('not.exist');
  });
});
