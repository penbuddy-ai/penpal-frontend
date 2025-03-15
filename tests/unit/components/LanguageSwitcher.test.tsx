/**
 * Tests for LanguageSwitcher component
 */
import { render, screen } from '@testing-library/react';
import LanguageSwitcher from '../../../src/components/LanguageSwitcher';
import { useRouter } from 'next/router';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
  });

  test('renders the language switcher with correct language option', () => {
    // Set up the mock for this specific test
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/',
      query: {},
      asPath: '/',
      locales: ['fr', 'en'],
      locale: 'fr', // Current locale is French
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    });

    render(<LanguageSwitcher />);

    // Since current locale is 'fr', it should show the English option
    const englishLink = screen.getByText(/English/i);
    expect(englishLink).toBeInTheDocument();
    expect(englishLink).toHaveAttribute('href', '/');

    // It should not show the French option since that's the current locale
    const frenchLink = screen.queryByText(/Français/i);
    expect(frenchLink).not.toBeInTheDocument();
  });

  test('renders the language switcher with French option when locale is English', () => {
    // Set up the mock for this specific test
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/',
      query: {},
      asPath: '/',
      locales: ['fr', 'en'],
      locale: 'en', // Current locale is English
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    });

    render(<LanguageSwitcher />);

    // Since current locale is 'en', it should show the French option
    const frenchLink = screen.getByText(/Français/i);
    expect(frenchLink).toBeInTheDocument();
    expect(frenchLink).toHaveAttribute('href', '/');

    // It should not show the English option since that's the current locale
    const englishLink = screen.queryByText(/English/i);
    expect(englishLink).not.toBeInTheDocument();
  });
});
