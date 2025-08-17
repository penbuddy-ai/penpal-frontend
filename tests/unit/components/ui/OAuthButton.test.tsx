/**
 * Tests for OAuthButton component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OAuthButton } from '@/components/ui/OAuthButton/OAuthButton';

describe('OAuthButton', () => {
  test('renders with Google provider styling', () => {
    render(
      <OAuthButton provider="google" onClick={() => {}}>
        Continuer avec Google
      </OAuthButton>
    );

    const button = screen.getByRole('button', { name: /Continuer avec Google/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveClass('text-gray-700');
    expect(button).toHaveClass('border-gray-300');
  });

  test('renders with Apple provider styling', () => {
    render(
      <OAuthButton provider="apple" onClick={() => {}}>
        Continuer avec Apple
      </OAuthButton>
    );

    const button = screen.getByRole('button', { name: /Continuer avec Apple/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-black');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('border-gray-300');
  });

  test('renders with custom icon', () => {
    const icon = <svg data-testid="custom-icon" />;

    render(
      <OAuthButton provider="google" icon={icon} onClick={() => {}}>
        Continuer avec Google
      </OAuthButton>
    );

    const customIcon = screen.getByTestId('custom-icon');
    expect(customIcon).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();

    render(
      <OAuthButton provider="google" onClick={handleClick}>
        Continuer avec Google
      </OAuthButton>
    );

    const button = screen.getByRole('button', { name: /Continuer avec Google/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(
      <OAuthButton provider="google" onClick={() => {}} disabled>
        Continuer avec Google
      </OAuthButton>
    );

    const button = screen.getByRole('button', { name: /Continuer avec Google/i });
    expect(button).toBeDisabled();
  });

  test('applies custom className when provided', () => {
    const customClass = 'custom-button';

    render(
      <OAuthButton provider="google" onClick={() => {}} className={customClass}>
        Continuer avec Google
      </OAuthButton>
    );

    const button = screen.getByRole('button', { name: /Continuer avec Google/i });
    expect(button).toHaveClass(customClass);
  });
});
