# DST Airlines - Suivi des vols en temps réel ✈️

Application web professionnelle et élégante pour le suivi des vols d'avion, développée avec React et Vite. L'application comprend 5 pages principales pour gérer, analyser et prédire les vols en temps réel, avec une **intégration complète à l'API DST Airlines**.

## 🌟 Fonctionnalités

### 📊 Dashboard
- **Vue d'ensemble complète** : Statistiques en temps réel des opérations aériennes
- **Données réelles** : Connexion à l'API DST Airlines pour des données de vols authentiques
- **Métriques enrichies** : Total des vols, vols en vol/au sol, compagnies actives, types d'appareils
- **Recherche avancée** : Filtrage par numéro de vol, ICAO24, compagnie, pays d'origine
- **Vols récents** : Liste des derniers vols avec leurs statuts actuels
- **Logos des compagnies** : Affichage visuel des compagnies aériennes

### 🔮 Prédiction
- **Formulaire intelligent** : Saisie des informations de vol (numéro, compagnie, aéroports, horaires)
- **Prédiction IA** : Estimation du retard potentiel basée sur plusieurs facteurs
- **Analyse détaillée** : Facteurs d'influence (météo, trafic aérien, historique)
- **Résultats visuels** : Graphiques et indicateurs pour comprendre les prédictions
- **API ready** : Prêt à se connecter à votre API de prédiction de machine learning

### 🗺️ Vols en direct
- **Carte interactive** : Visualisation en temps réel de tous les vols actifs
- **Données GPS réelles** : Positions authentiques des avions depuis l'API
- **Informations enrichies** : Noms des compagnies et modèles d'avions affichés
- **Filtrage en temps réel** : Filtrez par statut (en vol / au sol)
- **Détails complets** : Altitude, vitesse, cap, taux de montée/descente
- **Mise à jour automatique** : Rafraîchissement toutes les 10 secondes

### 📈 Analytics
- **Analyses détaillées** : Statistiques complètes sur le trafic aérien
- **Graphiques interactifs** : Visualisation des données par compagnie, pays, type d'appareil
- **Top 10** : Classement des compagnies et pays les plus actifs
- **Distribution des statuts** : Répartition des vols en vol vs au sol
- **Métriques moyennes** : Altitude et vitesse moyennes du trafic

### 👥 Creators
- **Présentation de l'équipe** : Découvrez les créateurs du projet
- **Profils détaillés** : Compétences, rôles et liens sociaux
- **Design animé** : Interface moderne avec animations fluides

## 🌐 Fonctionnalités supplémentaires

### 🌍 Internationalisation
- **Multilingue** : Support complet FR/EN avec i18next
- **Changement instantané** : Basculez entre les langues sans rechargement
- **Traductions complètes** : Toutes les pages et composants traduits

### 🎨 Système de thème
- **Mode clair/sombre** : Basculez entre les thèmes selon vos préférences
- **Persistance** : Votre choix est sauvegardé dans localStorage
- **Design adaptatif** : Interface optimisée pour chaque mode

## 🎨 Architecture de l'application

```
DST Airlines
├── Dashboard (/)              - Vue d'ensemble et statistiques
├── Prédiction (/prediction)   - Prédiction de retards
├── Vols en direct (/live-flights) - Carte interactive
├── Analytics (/analytics)     - Analyses détaillées
└── Creators (/creators)       - Présentation de l'équipe
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
│   ├── plane-icon.svg          # Icône de l'application
│   └── images/                 # Images et assets
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx      # Barre de navigation avec thème et langue
│   │   │   └── Layout.jsx      # Layout principal
│   │   ├── FlightCard.jsx      # Composant carte de vol
│   │   ├── StatsCard.jsx       # Composant carte de statistique
│   │   ├── AirlineLogo.jsx     # Affichage des logos de compagnies
│   │   ├── LanguageToggle.jsx  # Sélecteur de langue
│   │   └── ThemeToggle.jsx     # Bouton de changement de thème
│   ├── context/
│   │   ├── LanguageContext.jsx # Contexte pour l'internationalisation
│   │   └── ThemeContext.jsx    # Contexte pour le thème clair/sombre
│   ├── i18n/
│   │   ├── config.js           # Configuration i18next
│   │   └── locales/
│   │       ├── fr.json         # Traductions françaises
│   │       └── en.json         # Traductions anglaises
│   ├── services/
│   │   ├── api.js              # Client API principal
│   │   ├── statesService.js    # Service des états de vols
│   │   ├── airlinesService.js  # Service des compagnies aériennes
│   │   ├── aircraftsService.js # Service des appareils
│   │   ├── countriesService.js # Service des pays
│   │   ├── enrichmentService.js # Enrichissement des données
│   │   └── index.js            # Export centralisé
│   ├── pages/
│   │   ├── Dashboard.jsx       # Page tableau de bord
│   │   ├── Prediction.jsx      # Page de prédiction
│   │   ├── LiveFlights.jsx     # Page carte interactive
│   │   ├── Analytics.jsx       # Page d'analyses détaillées
│   │   └── Creators.jsx        # Page de présentation de l'équipe
│   ├── styles/
│   │   └── index.css           # Styles globaux avec thèmes
│   ├── utils/
│   │   ├── flightData.js       # Générateur de données de vols
│   │   ├── mapData.js          # Données géographiques des aéroports
│   │   └── airlineLogos.js     # Gestion des logos de compagnies
│   ├── App.jsx                 # Composant principal avec routing
│   └── main.jsx                # Point d'entrée
├── .env.example                # Template des variables d'environnement
├── index.html                  # Page HTML principale
├── package.json                # Dépendances et scripts
├── vite.config.js             # Configuration Vite
├── API_INTEGRATION.md          # Documentation de l'intégration API
└── README.md                   # Documentation
```

## 🛠️ Technologies utilisées

- **React 18** : Bibliothèque UI pour la construction de l'interface
- **Vite** : Build tool ultra-rapide pour le développement
- **React Router DOM** : Navigation entre les pages
- **React Leaflet** : Carte interactive pour les vols en direct
- **Leaflet** : Bibliothèque de cartographie
- **i18next** : Framework d'internationalisation
- **react-i18next** : Intégration React pour i18next
- **CSS moderne** : Animations, Grid, Flexbox, Variables CSS, Thèmes dynamiques
- **JavaScript ES6+** : Code moderne et optimisé
- **API REST** : Intégration avec l'API DST Airlines

## 🔌 Intégration API

L'application est **entièrement connectée à l'API DST Airlines** pour afficher des données de vols réelles.

### Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
VITE_API_BASE_URL=http://94.238.244.170:8000
VITE_API_KEY=your_api_key_here
```

### Services disponibles

#### 1. **enrichmentService** - Service principal recommandé
Croise automatiquement les données de plusieurs endpoints pour fournir des informations complètes :

```javascript
import { enrichmentService } from './services'

// Récupère les vols avec compagnies et appareils enrichis
const flights = await enrichmentService.getEnrichedFlights(100)
```

**Données enrichies incluses** :
- Position GPS, altitude, vitesse, cap
- Informations complètes de la compagnie (nom, IATA, ICAO)
- Détails de l'appareil (modèle, fabricant)
- Statut (In Flight / On Ground)
- Cache intelligent de 5 minutes pour optimiser les performances

#### 2. **statesService** - États des vols
```javascript
import { statesService } from './services'

// Récupère tous les vols actifs
const flights = await statesService.getAllFlights(100)
```

#### 3. **airlinesService** - Compagnies aériennes
```javascript
import { airlinesService } from './services'

// Récupère toutes les compagnies
const airlines = await airlinesService.getAllAirlines()

// Recherche par ICAO
const airline = await airlinesService.getByIcao('AFR')
```

#### 4. **aircraftsService** - Appareils
```javascript
import { aircraftsService } from './services'

// Récupère tous les types d'appareils
const aircrafts = await aircraftsService.getAllAircrafts()
```

#### 5. **countriesService** - Pays
```javascript
import { countriesService } from './services'

// Récupère tous les pays
const countries = await countriesService.getAllCountries()
```

### Pages utilisant l'API

- **Dashboard** (`/`) : Utilise `enrichmentService` pour afficher les statistiques enrichies
- **Live Flights** (`/live-flights`) : Utilise `enrichmentService` pour la carte avec données complètes
- **Analytics** (`/analytics`) : Utilise `enrichmentService` pour les analyses détaillées
- **Prediction** (`/prediction`) : Prêt pour connexion à une API de ML

Pour plus de détails sur l'intégration API, consultez [API_INTEGRATION.md](./API_INTEGRATION.md).

## 🎯 Fonctionnement

### Dashboard
- Affiche les statistiques en temps réel depuis l'API DST Airlines
- Recherche et filtrage avancés (numéro de vol, compagnie, pays)
- Met à jour les données automatiquement toutes les 15 secondes
- Affiche les vols avec logos des compagnies et détails complets
- Support multilingue et thème clair/sombre

### Prédiction
- Formulaire complet pour saisir les informations de vol
- Prêt à se connecter à une API de prédiction ML
- Affiche les résultats avec probabilité de retard et facteurs d'influence
- Visualisation graphique des métriques de confiance
- Interface traduite en FR/EN

### Vols en direct
- Carte interactive mondiale avec OpenStreetMap et positions GPS réelles
- Affichage des vols actifs depuis l'API avec leurs trajectoires
- Informations enrichies : compagnies, modèles d'avions, statuts
- Popup détaillé au clic sur un marqueur (altitude, vitesse, cap)
- Filtrage par statut (tous / en vol / au sol)
- Pagination pour navigation facile
- Mise à jour automatique toutes les 10 secondes

### Analytics
- Statistiques détaillées sur le trafic aérien mondial
- Top 10 des compagnies aériennes les plus actives
- Top 10 des pays d'origine
- Top 8 des types d'appareils
- Distribution des statuts (en vol vs au sol)
- Graphiques à barres interactifs avec animations
- Métriques moyennes (altitude, vitesse)

### Creators
- Présentation animée de l'équipe de développement
- Profils détaillés avec compétences et liens sociaux
- Design moderne avec particules flottantes
- Information sur le projet DST Airlines

## 🌐 Données en temps réel

L'application affiche des données de vols réels provenant de l'API DST Airlines, incluant :
- Vols du monde entier avec positions GPS précises
- Compagnies aériennes internationales
- Types d'appareils variés (Airbus, Boeing, etc.)
- Pays d'origine diversifiés

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

## 🚀 Fonctionnalités implémentées et futures

### ✅ Implémenté
- ✅ Intégration d'une API de vols réelle (API DST Airlines)
- ✅ Enrichissement automatique des données (compagnies + appareils)
- ✅ Page Analytics avec graphiques et statistiques détaillées
- ✅ Recherche et filtres avancés (numéro de vol, compagnie, pays)
- ✅ Mode sombre/clair avec persistance
- ✅ Multi-langue (Français/Anglais avec i18next)
- ✅ Cache intelligent pour optimiser les performances
- ✅ Logos des compagnies aériennes
- ✅ Page Creators pour présenter l'équipe

### 🔄 En cours / Futures améliorations
- ⬜ Modèle ML pour prédiction des retards
- ⬜ Carte 3D avec trajectoires de vol animées
- ⬜ Notifications push pour changements de statut
- ⬜ Historique des trajectoires de vols
- ⬜ Export de données (CSV, PDF)
- ⬜ Dashboard admin avec gestion des vols
- ⬜ Websockets pour mises à jour en temps réel
- ⬜ Informations sur les aéroports de départ/arrivée

## 📄 Licence

Ce projet est un projet de démonstration pour DST Airlines.

## 👨‍💻 Développement

Développé avec React, Vite, React Router et React Leaflet pour une expérience utilisateur optimale.

### Navigation

L'application utilise React Router pour la navigation :
- `/` - Dashboard (statistiques et liste des vols)
- `/prediction` - Prédiction de retard
- `/live-flights` - Vols en direct sur carte interactive
- `/analytics` - Analyses détaillées et graphiques
- `/creators` - Présentation de l'équipe

### État et données

- **Données réelles** depuis l'API DST Airlines
- **Enrichissement automatique** via le service enrichmentService
- **Cache intelligent** pour optimiser les performances (5 minutes)
- **Mise à jour automatique** périodique des données
- **Gestion des contextes** pour le thème et la langue
- **Persistance locale** des préférences utilisateur

---

**DST Airlines** - Votre compagnon de voyage dans les airs ✈️
