# Installation du Frontend Vue.js

## Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## Installation

1. **Aller dans le répertoire du package Vue.js**
   ```bash
   cd frontend-echopub/packages/vue-admin
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Créer le fichier .env**
   ```bash
   cp .env.example .env
   ```
   
   Puis éditer le fichier `.env` :
   ```
   VUE_APP_API_URL=http://localhost:3000/api
   VUE_APP_TITLE=WhatsApp Ads Platform - Admin
   ```

4. **Démarrer le serveur de développement**
   ```bash
   npm run serve
   ```

5. **Accéder à l'application**
   Ouvrir http://localhost:8081 dans votre navigateur

## Scripts disponibles

- `npm run serve` - Démarrer le serveur de développement
- `npm run build` - Build pour production
- `npm run lint` - Linter le code

## Structure des dossiers

```
vue-admin/
├── public/              # Fichiers statiques
├── src/
│   ├── components/      # Composants réutilisables
│   ├── layouts/         # Layouts (Admin, Advertiser)
│   ├── router/          # Configuration des routes
│   ├── stores/          # Store Pinia
│   ├── styles/          # Styles SCSS
│   ├── views/           # Pages
│   └── main.js          # Point d'entrée
├── package.json         # Dépendances
└── vue.config.js        # Configuration Vue CLI
```

## Configuration

### Proxy API
Le frontend est configuré pour proxy les appels API vers le backend sur `http://localhost:3000`.

### Thème
Le thème utilise les couleurs de l'application mobile :
- Primary Blue: #4D869C
- Light Blue: #7AB2B2
- White: #EEF7FF

## Développement

### Ajouter une nouvelle page
1. Créer le fichier dans `src/views/`
2. Ajouter la route dans `src/router/index.js`
3. Ajouter le lien dans le menu approprié

### Ajouter un composant
1. Créer le fichier dans `src/components/`
2. Importer et utiliser dans les pages

### Styles
- Utiliser les variables SCSS dans `src/styles/variables.scss`
- Respecter le design system existant
- Tester la responsivité

## Déploiement

```bash
# Build de production
npm run build

# Les fichiers seront dans dist/
```

## Support

Pour toute question ou problème :
1. Vérifier que le backend est démarré sur le port 3000
2. Vérifier les logs dans la console du navigateur
3. Vérifier que toutes les dépendances sont installées 