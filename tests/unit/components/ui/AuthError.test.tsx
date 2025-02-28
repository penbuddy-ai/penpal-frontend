/**
 * Tests for AuthError component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthError } from '@/components/ui/AuthError/AuthError';

// Mock useState pour contrôler l'état isClient
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn(),
  };
});

describe('AuthError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when no message is provided', () => {
    // Simuler que isClient est true
    (React.useState as jest.Mock).mockImplementation(() => [true, jest.fn()]);

    const { container } = render(<AuthError />);

    // Container should be empty
    expect(container.firstChild).toBeNull();
  });

  test('renders nothing when message is provided but isClient is false', () => {
    // Simuler que isClient est false
    (React.useState as jest.Mock).mockImplementation(() => [false, jest.fn()]);

    const { container } = render(<AuthError message="Une erreur est survenue" />);

    // Container should be empty because isClient is false
    expect(container.firstChild).toBeNull();
  });

  test('renders error message when provided and isClient is true', () => {
    // Simuler que isClient est true
    (React.useState as jest.Mock).mockImplementation(() => [true, jest.fn()]);

    render(<AuthError message="Une erreur est survenue" />);

    // Error message should be displayed
    const errorMessage = screen.getByText('Une erreur est survenue');
    expect(errorMessage).toBeInTheDocument();

    // Alert icon should be present - vérifier la présence de l'élément SVG
    const alertIcon = document.querySelector('svg.lucide-alert-circle');
    expect(alertIcon).not.toBeNull();
  });

  test('applies custom className when provided', () => {
    // Simuler que isClient est true
    (React.useState as jest.Mock).mockImplementation(() => [true, jest.fn()]);

    const customClass = 'custom-error';
    render(<AuthError message="Une erreur est survenue" className={customClass} />);

    // Error container should have the custom class
    const errorContainer = screen.getByText('Une erreur est survenue').closest('div');
    expect(errorContainer).toHaveClass(customClass);
  });
});
