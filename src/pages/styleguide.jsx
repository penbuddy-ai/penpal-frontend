/**
 * Style Guide page
 * This page displays the style guide demo component
 */

import React from 'react';
import StyleGuideDemo from '../components/StyleGuideDemo';

const StyleGuidePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-primary-600">PenPal AI - Charte Graphique</h1>
        </div>
      </header>

      <main>
        <StyleGuideDemo />
      </main>

      <footer className="bg-neutral-100 dark:bg-neutral-800 py-6 mt-12">
        <div className="container">
          <p className="text-neutral-600 dark:text-neutral-400">
            © 2023 PenPal AI. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StyleGuidePage;
