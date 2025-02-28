/**
 * Type definitions for Jest
 */
import '@testing-library/jest-dom';

// Extend Jest's expect
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}
