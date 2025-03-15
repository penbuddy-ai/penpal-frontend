/**
 * Support file for Cypress component tests
 */
import { mount } from 'cypress/react18';
import './commands';

// Add the mount command to the global Cypress namespace
Cypress.Commands.add('mount', mount);

// Import global styles
import '../../src/styles/globals.css';

// Declare the mount command for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mount a React component in the Cypress test environment
       * @param component - The React component to mount
       * @param options - Additional options for mounting
       */
      mount: typeof mount;
    }
  }
}
