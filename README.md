# 🔗QR ETERNAL# React + TypeScript + Vite



> Générateur de QR codes intemporel, illimité et gratuit à vieThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



##  FonctionnalitésCurrently, two official plugins are available:



-  **Génération instantanée** : QR codes générés en temps réel- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

-  **Interface moderne** : Design élégant avec gradient cyan/purple sur fond noir- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

-  **Responsive** : Fonctionne parfaitement sur mobile et desktop

-  **Export multiple** : Téléchargement en PNG et SVG haute qualité## React Compiler

-  **Niveau H** : Correction d'erreur maximale pour une meilleure résistance

-  **Client-side** : Aucun serveur, fonctionne entièrement côté clientThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

-  **Aucune limite** : Génération illimitée, pas de tracking, pas de compte

## Expanding the ESLint configuration

##  Technologies

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- **React 19** + **TypeScript** - Interface utilisateur moderne

- **Vite** - Build tool ultra-rapide```js

- **Tailwind CSS** - Styling utilitaireexport default defineConfig([

- **qr-code-styling** - Génération de QR codes stylisés  globalIgnores(['dist']),

- **100% client-side** - Aucune dépendance serveur  {

    files: ['**/*.{ts,tsx}'],

##  Démarrage rapide    extends: [

      // Other configs...

```bash

# Installation des dépendances      // Remove tseslint.configs.recommended and replace with this

npm install      tseslint.configs.recommendedTypeChecked,

      // Alternatively, use this for stricter rules

# Lancement du serveur de développement      tseslint.configs.strictTypeChecked,

npm run dev      // Optionally, add this for stylistic rules

      tseslint.configs.stylisticTypeChecked,

# Build de production

npm run build      // Other configs...

```    ],

    languageOptions: {

## 📸 Aperçu      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

L'application présente :        tsconfigRootDir: import.meta.dirname,

- Un champ de saisie pour votre URL      },

- Génération automatique du QR code      // other options...

- Boutons de téléchargement PNG/SVG    },

- Compteur de caractères en temps réel  },

- Design dark mode par défaut])

```

##  Caractéristiques techniques

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

- **Niveau de correction H** : 30% du code peut être endommagé

- **Limite théorique** : 2953 caractères alphanumériques```js

- **Points arrondis** : Design moderne et esthétique// eslint.config.js

- **Marge optimisée** : Lecture facilitée par tous les scannersimport reactX from 'eslint-plugin-react-x'

- **Performance** : Génération instantanée sans latenceimport reactDom from 'eslint-plugin-react-dom'



##  Utilisationexport default defineConfig([

  globalIgnores(['dist']),

1. Coller votre lien dans le champ de saisie  {

2. Le QR code se génère automatiquement    files: ['**/*.{ts,tsx}'],

3. Cliquer sur PNG ou SVG pour télécharger    extends: [

4. C'est tout !       // Other configs...

      // Enable lint rules for React

##  Philosophie      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM

**QR ETERNAL** suit une philosophie simple :      reactDom.configs.recommended,

- **Intemporel** : Pas de mode, pas d'obsolescence    ],

- **Illimité** : Aucune restriction d'usage    languageOptions: {

- **Gratuit** : Vraiment gratuit, pour toujours      parserOptions: {

- **Respect** : Aucun tracking, aucune donnée collectée        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

---      },

      // other options...

Fait avec  par un développeur qui en avait marre des générateurs limités.    },
  },
])
```
