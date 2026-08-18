# 🔗 QR ETERNAL

> Générateur de QR codes intemporel, illimité et gratuit à vie

## Fonctionnalités

- **Génération instantanée** : QR codes générés en temps réel
- **QR codes dynamiques** : le QR reste visuellement identique pour toujours, mais sa destination peut être modifiée après coup via un lien secret d'édition
- **Interface moderne** : Design élégant, responsive
- **Logo personnalisé** : upload d'une image centrale, convertie automatiquement en PNG
- **Export haute résolution** : téléchargement PNG 1000×1000px, prêt pour l'impression
- **Niveau H** : Correction d'erreur maximale pour une meilleure résistance
- **Aucune limite** : Génération illimitée, pas de tracking, pas de compte

## Technologies

- **React 19** + **TypeScript** - Interface utilisateur
- **Vite** - Build tool
- **Tailwind CSS** - Styling utilitaire
- **qr-code-styling** - Génération de QR codes stylisés
- **Vercel Serverless Functions** + **Redis** (intégration Marketplace Vercel, préfixe `KV`) - Stockage de la destination des QR codes dynamiques

## Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement (frontend uniquement)
npm run dev

# Build de production
npm run build
```

> `npm run dev` (Vite seul) ne sert que le frontend : la création/modification de QR codes dynamiques nécessite les fonctions serverless, donc `vercel dev` (voir plus bas) pour tester ce flux en local.

## QR codes dynamiques

1. Coller votre lien dans le champ de saisie — un aperçu du style s'affiche en temps réel
2. Cliquer sur **Créer mon QR code dynamique** : le QR encode désormais un lien court permanent (`/r/{id}`) et ne changera plus jamais visuellement
3. Un **lien secret de modification** est affiché une seule fois — à sauvegarder, il permet de changer la destination plus tard sans toucher au QR
4. Télécharger le PNG haute résolution

### Configuration du stockage (Redis)

1. Dashboard Vercel → projet → **Storage** → **Create Database** → intégration **Redis** (Marketplace), préfixe des variables réglé sur `KV` — connecter au projet (injecte automatiquement `KV_REDIS_URL`, une chaîne de connexion Redis standard)
2. Redéployer pour que les nouvelles variables d'environnement soient prises en compte
3. En local : `vercel link` puis `vercel env pull .env.local`, puis `vercel dev`

## Philosophie

**QR ETERNAL** suit une philosophie simple :
- **Intemporel** : le QR imprimé ne devient jamais obsolète
- **Illimité** : Aucune restriction d'usage
- **Gratuit** : Vraiment gratuit, pour toujours
- **Respect** : Aucun tracking, aucune donnée collectée en dehors de la destination du QR code lui-même
- **Sans compte** : la modification d'un QR dynamique repose sur un lien secret, pas sur un login
