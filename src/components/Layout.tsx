/**
 * Layout Component
 * Main layout component for the application with authentication
 */

import React from 'react';
import { ThemeToggle } from './theme';
import LanguageSwitcher from './LanguageSwitcher';
import { UserMenu } from './auth/UserMenu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

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

            {/* Navigation principale - visible seulement si authentifié */}
            {isAuthenticated && (
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
            )}

            {/* Navigation publique - visible si non authentifié */}
            {!isAuthenticated && !isLoading && (
              <nav className="hidden md:flex space-x-6">
                <NavLink href="/about" active={router.pathname === '/about'}>
                  À propos
                </NavLink>
                <NavLink href="/features" active={router.pathname === '/features'}>
                  Fonctionnalités
                </NavLink>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Menu utilisateur avec gestion d'authentification */}
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-neutral-100 dark:bg-neutral-800 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 md:mb-0">
              © 2025 PenPal AI. Tous droits réservés.
            </p>

            {/* Liens du footer */}
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Conditions
              </Link>
              <Link
                href="/support"
                className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
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
