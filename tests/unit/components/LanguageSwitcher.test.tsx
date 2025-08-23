/**
 * Tests for LanguageSwitcher component
 */
import { render, screen, fireEvent } from '@testing-library/react';
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

    // Open dropdown
    fireEvent.click(screen.getByRole('button', { name: /language.switchLanguage/i }));

    // Since current locale is 'fr', it should show the English option in the dropdown
    const englishLink = screen.getAllByRole('link', { name: /English/i })[0];
    expect(englishLink).toBeInTheDocument();
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

    // Open dropdown
    fireEvent.click(screen.getByRole('button', { name: /language.switchLanguage/i }));

    // Since current locale is 'en', it should show the French option in the dropdown
    const frenchLink = screen.getAllByRole('link', { name: /Français/i })[0];
    expect(frenchLink).toBeInTheDocument();
  });
});
