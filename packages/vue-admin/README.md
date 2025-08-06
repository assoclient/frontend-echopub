# Frontend Vue.js - WhatsApp Ads Platform

Interface d'administration et d'annonceur pour la plateforme WhatsApp Ads.

## 🎨 Thème

Le frontend utilise le thème de l'application mobile avec les couleurs suivantes :
- **Primary Blue**: #4D869C
- **Light Blue**: #7AB2B2
- **White**: #EEF7FF
- **Soft Green**: #CDE8E5
- **Dark Grey**: #444444

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run serve

# Build pour production
npm run build
```

## 📁 Structure

```
src/
├── components/          # Composants réutilisables
├── layouts/            # Layouts (Admin, Advertiser)
├── router/             # Configuration des routes
├── stores/             # Store Pinia (auth)
├── styles/             # Styles SCSS et variables
├── views/              # Pages
│   ├── admin/          # Pages administrateur
│   ├── advertiser/     # Pages annonceur
│   └── auth/           # Pages d'authentification
└── main.js             # Point d'entrée
```

## 🔐 Authentification

Le système d'authentification utilise :
- **JWT** pour les tokens
- **Pinia** pour la gestion d'état
- **Vue Router** pour la protection des routes

### Rôles supportés :
- **Admin** : Accès complet à la plateforme
- **Advertiser** : Gestion des campagnes et profil

## 🎯 Fonctionnalités

### Admin
- ✅ Dashboard avec statistiques
- ✅ Gestion des utilisateurs
- ✅ Surveillance des campagnes
- ✅ Historique des transactions
- ✅ Paramètres de la plateforme

### Annonceur
- ✅ Dashboard personnel
- ✅ Création de campagnes
- ✅ Gestion des campagnes
- ✅ Profil et transactions
- ✅ Dépôt de fonds

## 🎨 Design System

### Couleurs
```scss
$primary-blue: #4D869C;
$light-blue: #7AB2B2;
$white: #EEF7FF;
$soft-green: #CDE8E5;
$dark-grey: #444444;
$light-grey: #E0E0E0;
$alert-red: #FF5B5B;
$success: #43A047;
```

### Composants
- **Cards** : Conteneurs avec ombre et border-radius
- **Buttons** : Styles primaires et secondaires
- **Forms** : Inputs avec validation
- **Tables** : Affichage des données
- **Charts** : Graphiques avec Chart.js

## 🔧 Configuration

### Variables d'environnement
Créer un fichier `.env` :
```
VUE_APP_API_URL=http://localhost:3000/api
```

### Proxy de développement
Le frontend est configuré pour proxy les appels API vers le backend :
```javascript
// vue.config.js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

## 📱 Responsive

L'interface est entièrement responsive avec :
- **Desktop** : Layout complet avec sidebar
- **Tablet** : Adaptation des grilles
- **Mobile** : Navigation adaptée

## 🚀 Déploiement

```bash
# Build de production
npm run build

# Les fichiers seront dans dist/
```

## 🔗 Intégration API

Le frontend communique avec le backend via :
- **Axios** pour les requêtes HTTP
- **JWT** pour l'authentification
- **Endpoints REST** pour les données

### Endpoints principaux :
- `POST /api/auth/login` - Connexion
- `GET /api/campaigns` - Campagnes
- `POST /api/campaigns` - Créer campagne
- `GET /api/users` - Utilisateurs (admin)
- `POST /api/transactions` - Transactions

## 🎯 Prochaines étapes

- [ ] Intégration complète avec l'API backend
- [ ] Gestion des erreurs avancée
- [ ] Tests unitaires
- [ ] Optimisation des performances
- [ ] PWA (Progressive Web App) 