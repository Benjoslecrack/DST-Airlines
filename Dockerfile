# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Créer le script env.sh directement dans l'image (évite les problèmes CRLF Windows)
RUN echo '#!/bin/sh' > /env.sh && \
    echo 'cat <<EOF > /usr/share/nginx/html/env-config.js' >> /env.sh && \
    echo 'window.ENV = {' >> /env.sh && \
    echo '  VITE_API_BASE_URL: "/api",' >> /env.sh && \
    echo '  VITE_API_KEY: ""' >> /env.sh && \
    echo '};' >> /env.sh && \
    echo 'EOF' >> /env.sh && \
    echo 'echo "✅ Variables d'\''environnement injectées:"' >> /env.sh && \
    echo 'echo "   API Proxy activé: /api -> ${VITE_API_BASE_URL}"' >> /env.sh && \
    echo 'echo "   API Key configurée dans Nginx"' >> /env.sh && \
    chmod +x /env.sh

# Créer le script d'entrypoint directement dans l'image (évite les problèmes CRLF Windows)
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'echo "🚀 Démarrage du container DST Airlines..."' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Configurer le proxy Nginx avec les variables d'\''environnement' >> /docker-entrypoint.sh && \
    echo 'sed -i "s|API_BACKEND_URL_PLACEHOLDER|${VITE_API_BASE_URL}|g" /etc/nginx/nginx.conf' >> /docker-entrypoint.sh && \
    echo 'sed -i "s|API_KEY_PLACEHOLDER|${VITE_API_KEY}|g" /etc/nginx/nginx.conf' >> /docker-entrypoint.sh && \
    echo 'echo "✅ Nginx configuré avec le proxy API"' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Générer env-config.js' >> /docker-entrypoint.sh && \
    echo '/env.sh' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo 'echo "🌐 Démarrage de Nginx..."' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
