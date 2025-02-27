# PenPal AI - Guide de Style

Ce document présente la charte graphique de PenPal AI et explique comment l'utiliser dans le projet.

## Palette de couleurs

### Couleurs primaires

La couleur primaire est un indigo qui représente l'innovation et la technologie.

```jsx
// Exemple d'utilisation
<div className="bg-primary-500 text-white">Contenu</div>
```

| Variante | Hex Code | Utilisation                           |
| -------- | -------- | ------------------------------------- |
| 50       | #eef2ff  | Arrière-plan très léger, hover states |
| 100      | #e0e7ff  | Arrière-plan léger                    |
| 200      | #c7d2fe  | Arrière-plan, hover states            |
| 300      | #a5b4fc  | Éléments secondaires                  |
| 400      | #818cf8  | Éléments d'accentuation               |
| 500      | #6366f1  | **Couleur principale**                |
| 600      | #4f46e5  | Boutons, liens                        |
| 700      | #4338ca  | Hover states, focus                   |
| 800      | #3730a3  | Texte sur fond clair                  |
| 900      | #312e81  | Texte important sur fond clair        |
| 950      | #1e1b4b  | Texte très important sur fond clair   |

### Couleurs secondaires

La couleur secondaire est un turquoise qui apporte fraîcheur et convivialité.

```jsx
// Exemple d'utilisation
<div className="bg-secondary-500 text-white">Contenu</div>
```

| Variante | Hex Code | Utilisation                           |
| -------- | -------- | ------------------------------------- |
| 50       | #f0fdfa  | Arrière-plan très léger, hover states |
| 100      | #ccfbf1  | Arrière-plan léger                    |
| 200      | #99f6e4  | Arrière-plan, hover states            |
| 300      | #5eead4  | Éléments secondaires                  |
| 400      | #2dd4bf  | Éléments d'accentuation               |
| 500      | #14b8a6  | **Couleur secondaire principale**     |
| 600      | #0d9488  | Boutons, liens                        |
| 700      | #0f766e  | Hover states, focus                   |
| 800      | #115e59  | Texte sur fond clair                  |
| 900      | #134e4a  | Texte important sur fond clair        |
| 950      | #042f2e  | Texte très important sur fond clair   |

### Couleurs neutres

Les couleurs neutres sont utilisées pour le texte, les arrière-plans et les bordures.

```jsx
// Exemple d'utilisation
<div className="bg-neutral-100 text-neutral-900">Contenu</div>
```

| Variante | Hex Code | Utilisation                          |
| -------- | -------- | ------------------------------------ |
| 50       | #f9fafb  | Arrière-plan (mode clair)            |
| 100      | #f3f4f6  | Arrière-plan secondaire (mode clair) |
| 200      | #e5e7eb  | Bordures légères (mode clair)        |
| 300      | #d1d5db  | Bordures (mode clair)                |
| 400      | #9ca3af  | Texte désactivé                      |
| 500      | #6b7280  | Texte secondaire                     |
| 600      | #4b5563  | Texte                                |
| 700      | #374151  | Texte important                      |
| 800      | #1f2937  | Texte très important                 |
| 900      | #111827  | Titres                               |
| 950      | #030712  | Texte sur fond clair                 |

### Couleurs sémantiques

Ces couleurs sont utilisées pour communiquer un statut ou une information.

```jsx
// Exemple d'utilisation
<div className="bg-success text-white">Succès</div>
```

| Couleur | Hex Code | Utilisation                      |
| ------- | -------- | -------------------------------- |
| success | #10b981  | Succès, validation, confirmation |
| warning | #f59e0b  | Avertissement, attention         |
| error   | #ef4444  | Erreur, danger, suppression      |
| info    | #3b82f6  | Information, aide                |

## Typographie

### Familles de polices

```jsx
// Exemple d'utilisation
<p className="font-sans">Texte en Inter</p>
<p className="font-serif">Texte en Merriweather</p>
<p className="font-mono">Texte en JetBrains Mono</p>
```

| Famille | Police         | Utilisation                            |
| ------- | -------------- | -------------------------------------- |
| sans    | Inter          | Texte principal, interface utilisateur |
| serif   | Merriweather   | Titres, contenu éditorial              |
| mono    | JetBrains Mono | Code, données techniques               |

### Tailles de police

```jsx
// Exemple d'utilisation
<p className="text-base">Texte normal</p>
<p className="text-lg">Texte plus grand</p>
<p className="text-xl">Texte encore plus grand</p>
```

| Classe    | Taille   | Utilisation             |
| --------- | -------- | ----------------------- |
| text-xs   | 0.75rem  | Texte très petit, notes |
| text-sm   | 0.875rem | Texte petit, légendes   |
| text-base | 1rem     | Texte principal         |
| text-lg   | 1.125rem | Texte important         |
| text-xl   | 1.25rem  | Sous-titres             |
| text-2xl  | 1.5rem   | Petits titres           |
| text-3xl  | 1.875rem | Titres moyens           |
| text-4xl  | 2.25rem  | Grands titres           |
| text-5xl  | 3rem     | Très grands titres      |

### Épaisseurs de police

```jsx
// Exemple d'utilisation
<p className="font-normal">Texte normal</p>
<p className="font-medium">Texte medium</p>
<p className="font-bold">Texte gras</p>
```

| Classe        | Poids | Utilisation                |
| ------------- | ----- | -------------------------- |
| font-light    | 300   | Texte léger                |
| font-normal   | 400   | Texte normal               |
| font-medium   | 500   | Accentuation légère        |
| font-semibold | 600   | Sous-titres, accentuation  |
| font-bold     | 700   | Titres, accentuation forte |

## Composants

### Boutons

```jsx
// Exemples d'utilisation
<button className="btn btn-primary btn-md">Bouton primaire</button>
<button className="btn btn-secondary btn-md">Bouton secondaire</button>
<button className="btn btn-outline btn-md">Bouton outline</button>
<button className="btn btn-ghost btn-md">Bouton ghost</button>
```

| Variante   | Classe        | Utilisation         |
| ---------- | ------------- | ------------------- |
| Primaire   | btn-primary   | Actions principales |
| Secondaire | btn-secondary | Actions secondaires |
| Outline    | btn-outline   | Actions tertiaires  |
| Ghost      | btn-ghost     | Actions subtiles    |

| Taille | Classe | Utilisation                |
| ------ | ------ | -------------------------- |
| Petit  | btn-sm | Interfaces denses          |
| Moyen  | btn-md | Usage général              |
| Grand  | btn-lg | Appel à l'action important |

### Cartes

```jsx
// Exemple d'utilisation
<div className="card p-4">
  <h3 className="text-xl font-semibold mb-2">Titre de la carte</h3>
  <p className="mt-2">Contenu de la carte</p>
</div>
```

### Champs de saisie

```jsx
// Exemple d'utilisation
<input type="text" className="input" placeholder="Saisissez votre texte" />
```

## Espacement

L'espacement suit une échelle cohérente basée sur des multiples de 4px.

```jsx
// Exemples d'utilisation
<div className="p-4">Padding de 16px</div>
<div className="m-6">Margin de 24px</div>
<div className="gap-2">Gap de 8px</div>
```

| Classe | Valeur  | Pixels |
| ------ | ------- | ------ |
| p-0    | 0       | 0px    |
| p-1    | 0.25rem | 4px    |
| p-2    | 0.5rem  | 8px    |
| p-3    | 0.75rem | 12px   |
| p-4    | 1rem    | 16px   |
| p-5    | 1.25rem | 20px   |
| p-6    | 1.5rem  | 24px   |
| p-8    | 2rem    | 32px   |
| p-10   | 2.5rem  | 40px   |
| p-12   | 3rem    | 48px   |
| p-16   | 4rem    | 64px   |

## Bordures et arrondis

```jsx
// Exemples d'utilisation
<div className="rounded-md">Coins arrondis medium</div>
<div className="rounded-lg">Coins arrondis large</div>
<div className="rounded-full">Complètement arrondi</div>
```

| Classe       | Valeur   | Utilisation                   |
| ------------ | -------- | ----------------------------- |
| rounded-none | 0        | Pas d'arrondi                 |
| rounded-sm   | 0.125rem | Arrondi subtil                |
| rounded      | 0.25rem  | Arrondi par défaut            |
| rounded-md   | 0.375rem | Arrondi medium                |
| rounded-lg   | 0.5rem   | Arrondi large                 |
| rounded-xl   | 0.75rem  | Arrondi extra large           |
| rounded-2xl  | 1rem     | Arrondi double extra large    |
| rounded-3xl  | 1.5rem   | Arrondi triple extra large    |
| rounded-full | 9999px   | Complètement arrondi (cercle) |

## Ombres

```jsx
// Exemples d'utilisation
<div className="shadow">Ombre par défaut</div>
<div className="shadow-md">Ombre medium</div>
<div className="shadow-lg">Ombre large</div>
```

| Classe       | Utilisation              |
| ------------ | ------------------------ |
| shadow-sm    | Ombre subtile            |
| shadow       | Ombre par défaut         |
| shadow-md    | Ombre medium             |
| shadow-lg    | Ombre large              |
| shadow-xl    | Ombre extra large        |
| shadow-2xl   | Ombre double extra large |
| shadow-inner | Ombre intérieure         |
| shadow-none  | Pas d'ombre              |

## Mode sombre

Le thème prend en charge le mode sombre. Les classes `dark:` sont utilisées pour définir des styles spécifiques au mode sombre.

```jsx
// Exemple d'utilisation
<div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
  Ce contenu s'adapte au mode sombre
</div>
```

## Bonnes pratiques

1. **Cohérence** : Utilisez les classes définies dans ce guide plutôt que de créer des styles personnalisés.
2. **Accessibilité** : Assurez-vous que les contrastes de couleur sont suffisants pour tous les utilisateurs.
3. **Responsive** : Utilisez les classes responsive de Tailwind (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) pour adapter l'interface à différentes tailles d'écran.
4. **Composants** : Créez des composants réutilisables pour maintenir la cohérence de l'interface.

## Exemples d'utilisation

### Page type

```jsx
<div className="min-h-screen bg-white dark:bg-neutral-900">
  <header className="border-b border-neutral-200 dark:border-neutral-800">
    <div className="container py-4">
      <h1 className="text-2xl font-bold text-primary-600">PenPal AI</h1>
    </div>
  </header>

  <main className="container py-8">
    <h2 className="text-3xl font-bold mb-6">Titre de la page</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-2">Carte 1</h3>
        <p className="text-neutral-600 dark:text-neutral-400">Description de la carte</p>
        <button className="btn btn-primary btn-md mt-4">Action</button>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-2">Carte 2</h3>
        <p className="text-neutral-600 dark:text-neutral-400">Description de la carte</p>
        <button className="btn btn-outline btn-md mt-4">Action</button>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-2">Carte 3</h3>
        <p className="text-neutral-600 dark:text-neutral-400">Description de la carte</p>
        <button className="btn btn-secondary btn-md mt-4">Action</button>
      </div>
    </div>
  </main>

  <footer className="bg-neutral-100 dark:bg-neutral-800 py-6">
    <div className="container">
      <p className="text-neutral-600 dark:text-neutral-400">
        © 2023 PenPal AI. Tous droits réservés.
      </p>
    </div>
  </footer>
</div>
```

### Formulaire type

```jsx
<form className="card p-6 max-w-md mx-auto">
  <h2 className="text-2xl font-bold mb-6">Formulaire d'inscription</h2>

  <div className="space-y-4">
    <div>
      <label htmlFor="name" className="block text-sm font-medium mb-1">
        Nom
      </label>
      <input id="name" type="text" className="input" placeholder="Votre nom" />
    </div>

    <div>
      <label htmlFor="email" className="block text-sm font-medium mb-1">
        Email
      </label>
      <input id="email" type="email" className="input" placeholder="votre@email.com" />
    </div>

    <div>
      <label htmlFor="password" className="block text-sm font-medium mb-1">
        Mot de passe
      </label>
      <input id="password" type="password" className="input" placeholder="••••••••" />
    </div>

    <div className="pt-2">
      <button type="submit" className="btn btn-primary btn-md w-full">
        S'inscrire
      </button>
    </div>
  </div>
</form>
```
