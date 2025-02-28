/**
 * Tests for Divider component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Divider } from '@/components/ui/Divider/Divider';

describe('Divider', () => {
  test('renders a simple divider when no text is provided', () => {
    render(<Divider />);

    // Should render an hr element
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider.tagName).toBe('HR');
  });

  test('renders a divider with text when text is provided', () => {
    // We need to mock the client-side rendering for the isClient state
    jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

    render(<Divider text="OU" />);

    // Should not render an hr element
    const divider = screen.queryByRole('separator');
    expect(divider).not.toBeInTheDocument();

    // Should render the text
    const text = screen.getByText('OU');
    expect(text).toBeInTheDocument();
  });

  test('applies custom className when provided', () => {
    const customClass = 'custom-divider';
    render(<Divider className={customClass} />);

    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass(customClass);
  });

  test('applies custom className when text is provided', () => {
    // We need to mock the client-side rendering for the isClient state
    jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

    const customClass = 'custom-divider';
    render(<Divider text="OU" className={customClass} />);

    const dividerContainer = screen.getByText('OU').closest('div');
    expect(dividerContainer).toHaveClass(customClass);
  });
});
