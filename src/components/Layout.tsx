/**
 * Layout Component
 * Main layout component for the application
 */

import React, { useState } from 'react';
import { ThemeToggle } from './theme';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/store/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

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
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <span className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                  <span className="hidden sm:block">{user.firstName} {user.lastName}</span>
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-neutral-800 rounded-md shadow-lg z-10 border border-neutral-200 dark:border-neutral-700">
                    <div className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                      <p className="font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                      Mon profil
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Connexion
              </Link>
            )}
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
