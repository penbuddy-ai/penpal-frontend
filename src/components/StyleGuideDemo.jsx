/**
 * StyleGuideDemo component
 * This component demonstrates the usage of the style guide elements
 */

import React from 'react';
import theme from '../styles/theme';

const StyleGuideDemo = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">PenPal AI - Démonstration de la charte graphique</h1>

      {/* Color Palette */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Palette de couleurs</h2>

        <div className="space-y-6">
          {/* Primary Colors */}
          <div>
            <h3 className="text-xl font-medium mb-3">Couleurs primaires</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-2">
              <ColorSwatch color={theme.colors.primary[50]} name="50" />
              <ColorSwatch color={theme.colors.primary[100]} name="100" />
              <ColorSwatch color={theme.colors.primary[200]} name="200" />
              <ColorSwatch color={theme.colors.primary[300]} name="300" />
              <ColorSwatch color={theme.colors.primary[400]} name="400" />
              <ColorSwatch color={theme.colors.primary[500]} name="500" />
              <ColorSwatch color={theme.colors.primary[600]} name="600" />
              <ColorSwatch color={theme.colors.primary[700]} name="700" />
              <ColorSwatch color={theme.colors.primary[800]} name="800" />
              <ColorSwatch color={theme.colors.primary[900]} name="900" />
              <ColorSwatch color={theme.colors.primary[950]} name="950" />
            </div>
          </div>

          {/* Secondary Colors */}
          <div>
            <h3 className="text-xl font-medium mb-3">Couleurs secondaires</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-2">
              <ColorSwatch color={theme.colors.secondary[50]} name="50" />
              <ColorSwatch color={theme.colors.secondary[100]} name="100" />
              <ColorSwatch color={theme.colors.secondary[200]} name="200" />
              <ColorSwatch color={theme.colors.secondary[300]} name="300" />
              <ColorSwatch color={theme.colors.secondary[400]} name="400" />
              <ColorSwatch color={theme.colors.secondary[500]} name="500" />
              <ColorSwatch color={theme.colors.secondary[600]} name="600" />
              <ColorSwatch color={theme.colors.secondary[700]} name="700" />
              <ColorSwatch color={theme.colors.secondary[800]} name="800" />
              <ColorSwatch color={theme.colors.secondary[900]} name="900" />
              <ColorSwatch color={theme.colors.secondary[950]} name="950" />
            </div>
          </div>

          {/* Neutral Colors */}
          <div>
            <h3 className="text-xl font-medium mb-3">Couleurs neutres</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-2">
              <ColorSwatch color={theme.colors.neutral[50]} name="50" />
              <ColorSwatch color={theme.colors.neutral[100]} name="100" />
              <ColorSwatch color={theme.colors.neutral[200]} name="200" />
              <ColorSwatch color={theme.colors.neutral[300]} name="300" />
              <ColorSwatch color={theme.colors.neutral[400]} name="400" />
              <ColorSwatch color={theme.colors.neutral[500]} name="500" />
              <ColorSwatch color={theme.colors.neutral[600]} name="600" />
              <ColorSwatch color={theme.colors.neutral[700]} name="700" />
              <ColorSwatch color={theme.colors.neutral[800]} name="800" />
              <ColorSwatch color={theme.colors.neutral[900]} name="900" />
              <ColorSwatch color={theme.colors.neutral[950]} name="950" />
            </div>
          </div>

          {/* Semantic Colors */}
          <div>
            <h3 className="text-xl font-medium mb-3">Couleurs sémantiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <ColorSwatch color={theme.colors.success} name="Success" />
              <ColorSwatch color={theme.colors.warning} name="Warning" />
              <ColorSwatch color={theme.colors.error} name="Error" />
              <ColorSwatch color={theme.colors.info} name="Info" />
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Typographie</h2>

        <div className="space-y-6">
          {/* Font Families */}
          <div>
            <h3 className="text-xl font-medium mb-3">Familles de polices</h3>
            <div className="space-y-2">
              <p className="font-sans text-lg">
                Inter (font-sans) - Police principale pour l'interface
              </p>
              <p className="font-serif text-lg">
                Merriweather (font-serif) - Police pour les titres et contenus éditoriaux
              </p>
              <p className="font-mono text-lg">JetBrains Mono (font-mono) - Police pour le code</p>
            </div>
          </div>

          {/* Font Sizes */}
          <div>
            <h3 className="text-xl font-medium mb-3">Tailles de police</h3>
            <div className="space-y-2">
              <p className="text-xs">text-xs (0.75rem / 12px) - Texte très petit</p>
              <p className="text-sm">text-sm (0.875rem / 14px) - Texte petit</p>
              <p className="text-base">text-base (1rem / 16px) - Texte normal</p>
              <p className="text-lg">text-lg (1.125rem / 18px) - Texte large</p>
              <p className="text-xl">text-xl (1.25rem / 20px) - Texte extra large</p>
              <p className="text-2xl">text-2xl (1.5rem / 24px) - Titre niveau 2</p>
              <p className="text-3xl">text-3xl (1.875rem / 30px) - Titre niveau 3</p>
              <p className="text-4xl">text-4xl (2.25rem / 36px) - Titre niveau 4</p>
              <p className="text-5xl">text-5xl (3rem / 48px) - Titre niveau 5</p>
            </div>
          </div>

          {/* Font Weights */}
          <div>
            <h3 className="text-xl font-medium mb-3">Épaisseurs de police</h3>
            <div className="space-y-2">
              <p className="font-light text-lg">font-light (300) - Texte léger</p>
              <p className="font-normal text-lg">font-normal (400) - Texte normal</p>
              <p className="font-medium text-lg">font-medium (500) - Texte medium</p>
              <p className="font-semibold text-lg">font-semibold (600) - Texte semi-gras</p>
              <p className="font-bold text-lg">font-bold (700) - Texte gras</p>
            </div>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Composants</h2>

        <div className="space-y-8">
          {/* Buttons */}
          <div>
            <h3 className="text-xl font-medium mb-3">Boutons</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium mb-2">Variantes</h4>
                <div className="flex flex-wrap gap-3">
                  <button className="btn btn-primary btn-md">Primaire</button>
                  <button className="btn btn-secondary btn-md">Secondaire</button>
                  <button className="btn btn-outline btn-md">Outline</button>
                  <button className="btn btn-ghost btn-md">Ghost</button>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2">Tailles</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="btn btn-primary btn-sm">Petit</button>
                  <button className="btn btn-primary btn-md">Moyen</button>
                  <button className="btn btn-primary btn-lg">Grand</button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-xl font-medium mb-3">Cartes</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-6">
                <h4 className="text-lg font-semibold mb-2">Carte simple</h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Une carte basique avec du contenu.
                </p>
              </div>

              <div className="card p-6">
                <h4 className="text-lg font-semibold mb-2">Carte avec action</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Une carte avec un bouton d'action.
                </p>
                <button className="btn btn-primary btn-sm">Action</button>
              </div>

              <div className="card p-6 border-primary-500">
                <h4 className="text-lg font-semibold mb-2">Carte avec bordure</h4>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Une carte avec une bordure colorée.
                </p>
              </div>
            </div>
          </div>

          {/* Form Elements */}
          <div>
            <h3 className="text-xl font-medium mb-3">Éléments de formulaire</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Champ de texte
                </label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  placeholder="Saisissez votre texte"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input id="email" type="email" className="input" placeholder="votre@email.com" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Espacement</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium mb-3">Échelle d'espacement</h3>
            <div className="flex flex-wrap items-end gap-1">
              <div className="bg-primary-200 p-1 h-6 w-6" title="p-1 (4px)"></div>
              <div className="bg-primary-300 p-2 h-8 w-8" title="p-2 (8px)"></div>
              <div className="bg-primary-400 p-3 h-10 w-10" title="p-3 (12px)"></div>
              <div className="bg-primary-500 p-4 h-12 w-12" title="p-4 (16px)"></div>
              <div className="bg-primary-600 p-6 h-16 w-16" title="p-6 (24px)"></div>
              <div className="bg-primary-700 p-8 h-20 w-20" title="p-8 (32px)"></div>
              <div className="bg-primary-800 p-10 h-24 w-24" title="p-10 (40px)"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Borders & Radius */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Bordures et arrondis</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-neutral-300 rounded-none dark:bg-neutral-800 dark:border-neutral-700">
            <p className="text-center">rounded-none</p>
          </div>
          <div className="p-4 bg-white border border-neutral-300 rounded-sm dark:bg-neutral-800 dark:border-neutral-700">
            <p className="text-center">rounded-sm</p>
          </div>
          <div className="p-4 bg-white border border-neutral-300 rounded dark:bg-neutral-800 dark:border-neutral-700">
            <p className="text-center">rounded</p>
          </div>
          <div className="p-4 bg-white border border-neutral-300 rounded-md dark:bg-neutral-800 dark:border-neutral-700">
            <p className="text-center">rounded-md</p>
          </div>
          <div className="p-4 bg-white border border-neutral-300 rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
            <p className="text-center">rounded-lg</p>
          </div>
          <div className="p-4 bg-white border border-neutral-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
            <p className="text-center">rounded-xl</p>
          </div>
          <div className="p-4 bg-white border border-neutral-300 rounded-2xl dark:bg-neutral-800 dark:border-neutral-700">
            <p className="text-center">rounded-2xl</p>
          </div>
          <div className="p-4 bg-white border border-neutral-300 rounded-full dark:bg-neutral-800 dark:border-neutral-700">
            <p className="text-center">rounded-full</p>
          </div>
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Ombres</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-neutral-800">
            <p className="text-center">shadow-sm</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow dark:bg-neutral-800">
            <p className="text-center">shadow</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md dark:bg-neutral-800">
            <p className="text-center">shadow-md</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-lg dark:bg-neutral-800">
            <p className="text-center">shadow-lg</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-xl dark:bg-neutral-800">
            <p className="text-center">shadow-xl</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-2xl dark:bg-neutral-800">
            <p className="text-center">shadow-2xl</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-inner dark:bg-neutral-800">
            <p className="text-center">shadow-inner</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-none dark:bg-neutral-800">
            <p className="text-center">shadow-none</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Color Swatch Component
const ColorSwatch = ({ color, name }) => {
  return (
    <div className="flex flex-col">
      <div
        className="h-12 w-full rounded-md border border-neutral-200 dark:border-neutral-700"
        style={{ backgroundColor: color }}
        title={color}
      ></div>
      <span className="text-xs mt-1 text-center">{name}</span>
    </div>
  );
};

export default StyleGuideDemo;
