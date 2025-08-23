/**
 * Layout Component
 * Main layout component for the application with authentication
 */

import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ThemeToggle } from './theme';
import LanguageSwitcher from './LanguageSwitcher';
import { UserMenu } from './auth/UserMenu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingRedirect } from '@/hooks/useOnboardingRedirect';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check onboarding status and redirect if needed
  useOnboardingRedirect();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400 mr-4 md:mr-8"
              >
                PenPal AI
              </Link>

              {/* Navigation principale - visible seulement si authentifié */}
              {isAuthenticated && (
                <nav className="hidden md:flex space-x-6">
                  <NavLink href="/chat" active={router.pathname === '/chat'}>
                    {t('navigation.chat')}
                  </NavLink>
                  <NavLink href="/progress" active={router.pathname === '/progress'}>
                    {t('navigation.progress')}
                  </NavLink>
                  <NavLink href="/about" active={router.pathname === '/about'}>
                    {t('navigation.about')}
                  </NavLink>
                </nav>
              )}

              {/* Navigation publique - visible si non authentifié */}
              {!isAuthenticated && !isLoading && (
                <nav className="hidden md:flex space-x-6">
                  <NavLink href="/about" active={router.pathname === '/about'}>
                    {t('navigation.about')}
                  </NavLink>
                  <NavLink href="/features" active={router.pathname === '/features'}>
                    {t('navigation.features')}
                  </NavLink>
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              {/* Menu utilisateur avec gestion d'authentification */}
              <UserMenu />

              {/* Bouton menu mobile */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Menu mobile */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
              {/* Navigation mobile */}
              <nav className="flex flex-col space-y-3 mb-4">
                {isAuthenticated ? (
                  <>
                    <MobileNavLink
                      href="/chat"
                      active={router.pathname === '/chat'}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('navigation.chat')}
                    </MobileNavLink>
                    <MobileNavLink
                      href="/progress"
                      active={router.pathname === '/progress'}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('navigation.progress')}
                    </MobileNavLink>
                    <MobileNavLink
                      href="/about"
                      active={router.pathname === '/about'}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('navigation.about')}
                    </MobileNavLink>
                  </>
                ) : (
                  !isLoading && (
                    <>
                      <MobileNavLink
                        href="/about"
                        active={router.pathname === '/about'}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t('navigation.about')}
                      </MobileNavLink>
                      <MobileNavLink
                        href="/features"
                        active={router.pathname === '/features'}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t('navigation.features')}
                      </MobileNavLink>
                    </>
                  )
                )}
              </nav>

              {/* Controles mobile */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-neutral-100 dark:bg-neutral-800 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 md:mb-0 text-center md:text-left text-sm">
              {t('footer.copyright')}
            </p>

            {/* Liens du footer */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link
                href="/terms"
                className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {t('footer.terms')}
              </Link>
              <Link
                href="/support"
                className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {t('footer.support')}
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

interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

function MobileNavLink({ href, active, children, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2 text-base font-medium rounded-lg transition-colors ${
        active
          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
          : 'text-neutral-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
}
