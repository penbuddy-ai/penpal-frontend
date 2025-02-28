/**
 * Tests for PasswordInput component
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordInput } from '@/components/ui/PasswordInput/PasswordInput';
import { useTranslation } from 'react-i18next';

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('PasswordInput', () => {
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();

    // Setup translation mock
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'passwordStrength.veryWeak': 'Très faible',
          'passwordStrength.weak': 'Faible',
          'passwordStrength.medium': 'Moyen',
          'passwordStrength.good': 'Bon',
          'passwordStrength.strong': 'Fort',
          'passwordStrength.veryStrong': 'Très fort',
          'passwordStrength.label': 'Force du mot de passe',
        };
        return translations[key] || key;
      },
    });
  });

  test('renders password input with masked password by default', () => {
    render(<PasswordInput placeholder="Entrez votre mot de passe" />);

    const inputElement = screen.getByPlaceholderText('Entrez votre mot de passe');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  test('toggles password visibility when toggle button is clicked', () => {
    render(<PasswordInput placeholder="Entrez votre mot de passe" />);

    const inputElement = screen.getByPlaceholderText('Entrez votre mot de passe');
    expect(inputElement).toHaveAttribute('type', 'password');

    // Find and click the toggle button
    const toggleButton = screen.getByRole('button', { name: /Afficher le mot de passe/i });
    fireEvent.click(toggleButton);

    // Password should now be visible
    expect(inputElement).toHaveAttribute('type', 'text');

    // Toggle again
    fireEvent.click(toggleButton);

    // Password should be hidden again
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  test('shows password strength indicator when showStrength is true', () => {
    render(
      <PasswordInput placeholder="Entrez votre mot de passe" showStrength value="Password123!" />
    );

    // Wait for client-side rendering
    setTimeout(() => {
      // Check if strength indicator is shown
      const strengthLabel = screen.getByText('Force du mot de passe');
      expect(strengthLabel).toBeInTheDocument();

      // With the given password, strength should be "Très fort"
      const strengthValue = screen.getByText('Très fort');
      expect(strengthValue).toBeInTheDocument();
    }, 0);
  });

  test('does not show strength indicator when showStrength is false', () => {
    render(<PasswordInput placeholder="Entrez votre mot de passe" value="Password123!" />);

    // Strength indicator should not be present
    const strengthLabel = screen.queryByText('Force du mot de passe');
    expect(strengthLabel).not.toBeInTheDocument();
  });

  test('calculates password strength correctly', () => {
    const { rerender } = render(
      <PasswordInput placeholder="Entrez votre mot de passe" showStrength value="a" />
    );

    // Wait for client-side rendering
    setTimeout(() => {
      // Very weak password (just one lowercase letter)
      expect(screen.getByText('Très faible')).toBeInTheDocument();

      // Rerender with a slightly better password
      rerender(
        <PasswordInput placeholder="Entrez votre mot de passe" showStrength value="password" />
      );

      // Weak password (lowercase letters only, but long enough)
      expect(screen.getByText('Faible')).toBeInTheDocument();

      // Rerender with a medium strength password
      rerender(
        <PasswordInput placeholder="Entrez votre mot de passe" showStrength value="Password1" />
      );

      // Medium password (uppercase, lowercase, and number)
      expect(screen.getByText('Bon')).toBeInTheDocument();

      // Rerender with a strong password
      rerender(
        <PasswordInput placeholder="Entrez votre mot de passe" showStrength value="Password123!" />
      );

      // Strong password (uppercase, lowercase, number, and special character)
      expect(screen.getByText('Très fort')).toBeInTheDocument();
    }, 0);
  });

  test('displays error message when provided', () => {
    render(
      <PasswordInput placeholder="Entrez votre mot de passe" error="Le mot de passe est requis" />
    );

    const errorMessage = screen.getByText('Le mot de passe est requis');
    expect(errorMessage).toBeInTheDocument();
  });
});
