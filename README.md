# DST Airlines - Suivi des vols en temps réel ✈️

Application web professionnelle et élégante pour le suivi des vols d'avion, développée avec React et Vite. L'application comprend 3 pages principales pour gérer et prédire les vols en temps réel.

## 🌟 Fonctionnalités

### 📊 Dashboard
- **Vue d'ensemble complète** : Statistiques en temps réel des opérations aériennes
- **Métriques clés** : Total des vols, vols à l'heure, retardés, retard moyen
- **Données API** : Intégration prête pour votre API de données de vols
- **Vols récents** : Liste des derniers vols avec leurs statuts actuels

### 🔮 Prédiction
- **Formulaire intelligent** : Saisie des informations de vol (numéro, compagnie, aéroports, horaires)
- **Prédiction IA** : Estimation du retard potentiel basée sur plusieurs facteurs
- **Analyse détaillée** : Facteurs d'influence (météo, trafic aérien, historique)
- **Résultats visuels** : Graphiques et indicateurs pour comprendre les prédictions
- **API ready** : Prêt à se connecter à votre API de prédiction de machine learning

### 🗺️ Vols en direct
- **Carte interactive** : Visualisation en temps réel de tous les vols actifs
- **Trajectoires animées** : Affichage des routes de vol sur une carte mondiale
- **Filtrage avancé** : Filtrez par statut (à l'heure, retardé, embarquement)
- **Détails des vols** : Cliquez sur un avion pour voir toutes les informations
- **Liste compacte** : Vue liste pour navigation rapide entre les vols

## 🎨 Architecture de l'application

```
DST Airlines
├── Dashboard (/)          - Vue d'ensemble et statistiques
├── Prédiction (/prediction) - Prédiction de retards
└── Vols en direct (/live-flights) - Carte interactive
```

## 🚀 Installation et démarrage

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation des dépendances

```bash
npm install
```

### Lancement du serveur de développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Build pour la production

```bash
npm run build
```

### Prévisualisation du build de production

```bash
npm run preview
```

## 📁 Structure du projet

```
DST-Airlines/
├── public/
│   └── plane-icon.svg          # Icône de l'application
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx      # Barre de navigation
│   │   │   └── Layout.jsx      # Layout principal
│   │   ├── FlightCard.jsx      # Composant carte de vol
│   │   └── StatsCard.jsx       # Composant carte de statistique
│   ├── pages/
│   │   ├── Dashboard.jsx       # Page tableau de bord
│   │   ├── Prediction.jsx      # Page de prédiction
│   │   └── LiveFlights.jsx     # Page carte interactive
│   ├── styles/
│   │   └── index.css           # Styles globaux
│   ├── utils/
│   │   ├── flightData.js       # Générateur de données de vols
│   │   └── mapData.js          # Données géographiques des aéroports
│   ├── App.jsx                 # Composant principal avec routing
│   └── main.jsx                # Point d'entrée
├── index.html                  # Page HTML principale
├── package.json                # Dépendances et scripts
├── vite.config.js             # Configuration Vite
└── README.md                   # Documentation
```

## 🛠️ Technologies utilisées

- **React 18** : Bibliothèque UI pour la construction de l'interface
- **Vite** : Build tool ultra-rapide pour le développement
- **React Router DOM** : Navigation entre les pages
- **React Leaflet** : Carte interactive pour les vols en direct
- **Leaflet** : Bibliothèque de cartographie
- **CSS moderne** : Animations, Grid, Flexbox, Variables CSS
- **JavaScript ES6+** : Code moderne et optimisé

## 🔌 Intégration API

L'application est prête à se connecter à vos API. Voici les points d'intégration :

### Dashboard API
```javascript
// src/pages/Dashboard.jsx - ligne ~17
const response = await fetch('YOUR_API_ENDPOINT/dashboard')
const data = await response.json()
```

### Prédiction API
```javascript
// src/pages/Prediction.jsx - ligne ~38
const response = await fetch('YOUR_API_ENDPOINT/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
```

### Vols en direct API
```javascript
// src/pages/LiveFlights.jsx - à adapter selon vos besoins
// Remplacez generateFlights() par votre appel API
```

## 🎯 Fonctionnement

### Dashboard
- Affiche les statistiques globales récupérées de l'API
- Met à jour les données toutes les 15 secondes
- Affiche les 5 derniers vols avec leurs détails

### Prédiction
- Formulaire complet pour saisir les informations de vol
- Soumet les données à l'API de prédiction
- Affiche les résultats avec probabilité de retard et facteurs d'influence
- Visualisation graphique des métriques de confiance

### Vols en direct
- Carte interactive mondiale avec OpenStreetMap
- Affichage de 20 vols simultanés avec leurs trajectoires
- Position simulée des avions en vol (15% à 85% du trajet)
- Popup détaillé au clic sur un avion
- Filtrage par statut en temps réel
- Mise à jour automatique toutes les 8 secondes

## 🌐 Aéroports disponibles

L'application simule des vols entre les principaux aéroports internationaux :
- CDG (Paris) - LHR (London) - JFK (New York)
- DXB (Dubai) - NRT (Tokyo) - SIN (Singapore)
- LAX (Los Angeles) - FRA (Frankfurt) - AMS (Amsterdam)
- MAD (Madrid) - BCN (Barcelona) - FCO (Rome)
- SYD (Sydney) - HKG (Hong Kong) - ICN (Seoul)

## 🎨 Personnalisation

Les couleurs et le thème peuvent être facilement personnalisés dans `src/styles/index.css` :

```css
:root {
  --primary-color: #1e40af;
  --secondary-color: #3b82f6;
  --accent-color: #60a5fa;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  /* ... */
}
```

## 📱 Responsive Design

L'interface s'adapte automatiquement à toutes les tailles d'écran :
- **Desktop** : Layout complet avec navigation latérale et grilles
- **Tablet** : Layout adapté avec navigation responsive
- **Mobile** : Vue verticale optimisée avec menu compact

## 🚀 Améliorations futures possibles

- ✅ Intégration d'une API de vols réelle (FlightAware, Aviation Stack)
- ✅ Modèle ML pour prédiction des retards
- ⬜ Carte 3D avec trajectoires de vol animées
- ⬜ Notifications push pour changements de statut
- ⬜ Recherche et filtres avancés
- ⬜ Historique des vols et analytics
- ⬜ Mode sombre/clair
- ⬜ Multi-langue (i18n)
- ⬜ Export de données (CSV, PDF)
- ⬜ Dashboard admin avec gestion des vols

## 📄 Licence

Ce projet est un projet de démonstration pour DST Airlines.

## 👨‍💻 Développement

Développé avec React, Vite, React Router et React Leaflet pour une expérience utilisateur optimale.

### Navigation

L'application utilise React Router pour la navigation :
- `/` - Dashboard
- `/prediction` - Prédiction de retard
- `/live-flights` - Vols en direct sur carte

### État et données

- Simulation de données en temps réel
- Mise à jour périodique des statuts de vol
- Génération aléatoire de vols pour la démonstration
- Prêt pour intégration API réelle

---

**DST Airlines** - Votre compagnon de voyage dans les airs ✈️
