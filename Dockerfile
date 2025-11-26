# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Installer les dépendances de build pour rollup
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Installer les dépendances avec npm install (résout le bug avec rollup sur Alpine)
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les scripts d'environnement
COPY env.sh /env.sh
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Rendre les scripts exécutables
RUN chmod +x /env.sh /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
