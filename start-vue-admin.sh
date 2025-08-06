#!/bin/bash

# Script pour démarrer le frontend Vue.js Admin

echo "🚀 Démarrage du frontend Vue.js Admin..."

# Aller dans le répertoire du package Vue.js
cd packages/vue-admin

# Installer les dépendances si node_modules n'existe pas
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrer le serveur de développement
echo "🌐 Démarrage du serveur de développement..."
npm run serve 