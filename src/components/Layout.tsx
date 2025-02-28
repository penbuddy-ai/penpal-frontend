/**
 * Layout Component
 * Main layout component for the application
 */

import React from 'react';
import { ThemeToggle } from './theme';
import LanguageSwitcher from './LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">PenPal AI</h1>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-neutral-100 dark:bg-neutral-800 py-6 mt-12">
        <div className="container">
          <p className="text-neutral-600 dark:text-neutral-400">
            © 2025 PenPal AI. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
