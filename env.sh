#!/bin/sh

# Génère un fichier env-config.js avec les variables d'environnement au runtime
cat <<EOF > /usr/share/nginx/html/env-config.js
window.ENV = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}",
  VITE_API_KEY: "${VITE_API_KEY}"
};
EOF

echo "✅ Variables d'environnement injectées:"
echo "   VITE_API_BASE_URL = ${VITE_API_BASE_URL}"
echo "   VITE_API_KEY = ${VITE_API_KEY:0:10}***"
