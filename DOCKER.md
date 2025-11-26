# 🐳 Guide Docker - DST Airlines

## 📋 Prérequis

- Docker installé sur votre machine
- Variables d'environnement API configurées

## 🚀 Démarrage rapide

### 1. Configurer les variables d'environnement

Copiez le fichier `.env.docker.example` et remplissez avec vos vraies valeurs :

```bash
cp .env.docker.example .env.docker
# Éditez .env.docker avec vos vraies valeurs
```

### 2. Builder l'image Docker

```bash
docker build -t dst-airlines .
```

### 3. Lancer le container

**Option A : Avec un fichier .env**

```bash
docker run -p 8080:80 --env-file .env.docker dst-airlines
```

**Option B : Avec des variables inline**

```bash
docker run -p 8080:80 \
  -e VITE_API_BASE_URL=https://api.example.com \
  -e VITE_API_KEY=your-api-key \
  dst-airlines
```

### 4. Accéder à l'application

Ouvrez votre navigateur sur : http://localhost:8080

## 🔧 Variables d'environnement requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL de base de l'API | `https://api.example.com` |
| `VITE_API_KEY` | Clé d'API pour l'authentification | `your-api-key-here` |

## 🐛 Dépannage

### Problème : L'API ne répond pas

Vérifiez que les variables d'environnement sont bien passées au container :

```bash
docker exec -it <container-id> cat /usr/share/nginx/html/env-config.js
```

Vous devriez voir :
```javascript
window.ENV = {
  VITE_API_BASE_URL: "https://api.example.com",
  VITE_API_KEY: "your-api-key"
};
```

### Problème : Changement de variables

Si vous modifiez les variables d'environnement, **redémarrez le container** (pas besoin de rebuilder l'image) :

```bash
docker restart <container-id>
```

## 📦 Déploiement sur Docker Hub

L'image est automatiquement construite et poussée sur Docker Hub via Bitbucket Pipelines.

Pour déployer manuellement :

```bash
docker tag dst-airlines benjoslecrack/dst-airlines:latest
docker push benjoslecrack/dst-airlines:latest
```

## 🌐 Utiliser l'image depuis Docker Hub

```bash
docker pull benjoslecrack/dst-airlines:latest

docker run -p 8080:80 \
  -e VITE_API_BASE_URL=https://api.example.com \
  -e VITE_API_KEY=your-api-key \
  benjoslecrack/dst-airlines:latest
```
