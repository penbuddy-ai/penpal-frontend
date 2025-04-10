/**
 * Layout Component
 * Main layout component for the application
 */

import React from 'react';
import { ThemeToggle } from './theme';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-primary-600 dark:text-primary-400 mr-8"
            >
              PenPal AI
            </Link>

            <nav className="hidden md:flex space-x-6">
              <NavLink href="/chat" active={router.pathname === '/chat'}>
                Chat
              </NavLink>
              <NavLink href="/progress" active={router.pathname === '/progress'}>
                Progrès
              </NavLink>
              <NavLink href="/about" active={router.pathname === '/about'}>
                À propos
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-neutral-100 dark:bg-neutral-800 py-6">
        <div className="container">
          <p className="text-neutral-600 dark:text-neutral-400">
            © 2025 PenPal AI. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
        active ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-700 dark:text-neutral-300'
      }`}
    >
      {children}
    </Link>
  );
}
