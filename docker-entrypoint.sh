#!/bin/sh

echo "🚀 Démarrage du container DST Airlines..."

# Génère le fichier env-config.js avec les variables d'environnement
/env.sh

# Démarre Nginx
echo "🌐 Démarrage de Nginx..."
exec nginx -g "daemon off;"
