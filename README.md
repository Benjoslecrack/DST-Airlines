# DST Airlines - Suivi des vols en temps réel ✈️

Interface web professionnelle et élégante pour le suivi des vols d'avion en direct, développée avec React et Vite.

## 🌟 Fonctionnalités

- **Affichage en temps réel** : Visualisation de tous les vols en cours avec mise à jour automatique des statuts
- **Interface moderne** : Design professionnel avec un thème sombre élégant
- **Statistiques en direct** : Tableau de bord avec métriques clés (total des vols, vols à l'heure, retards, embarquements)
- **Filtrage intelligent** : Filtrez les vols par statut (Tous, À l'heure, Retardés, Embarquement)
- **Animations fluides** : Transitions et animations pour une expérience utilisateur agréable
- **Design responsive** : Interface adaptée aux ordinateurs, tablettes et mobiles

## 🎨 Aperçu des statuts

L'application affiche différents statuts de vol avec des codes couleur :
- 🟢 **On Time** : Vol à l'heure
- 🟡 **Delayed** : Vol retardé
- 🔵 **Boarding** : Embarquement en cours
- 🟣 **Departed** : Vol décollé
- 🔴 **Cancelled** : Vol annulé

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
│   │   ├── FlightCard.jsx      # Composant carte de vol
│   │   └── StatsCard.jsx       # Composant carte de statistique
│   ├── styles/
│   │   └── index.css           # Styles globaux
│   ├── utils/
│   │   └── flightData.js       # Générateur de données de vols
│   ├── App.jsx                 # Composant principal
│   └── main.jsx                # Point d'entrée
├── index.html                  # Page HTML principale
├── package.json                # Dépendances et scripts
├── vite.config.js             # Configuration Vite
└── README.md                   # Documentation
```

## 🛠️ Technologies utilisées

- **React 18** : Bibliothèque UI pour la construction de l'interface
- **Vite** : Build tool ultra-rapide pour le développement
- **CSS moderne** : Animations, Grid, Flexbox, Variables CSS
- **JavaScript ES6+** : Code moderne et optimisé

## 🎯 Fonctionnement

L'application simule un système de suivi de vols en temps réel :

1. **Génération des vols** : Au chargement, 15 vols sont générés aléatoirement avec des destinations mondiales
2. **Mise à jour automatique** : Toutes les 10 secondes, les statuts des vols sont mis à jour pour simuler l'évolution en temps réel
3. **Données réalistes** : Vols avec compagnies aériennes réelles, codes IATA d'aéroports internationaux, heures de départ dynamiques

## 🌐 Aéroports disponibles

L'application simule des vols entre les principaux aéroports internationaux :
- CDG (Paris)
- LHR (London)
- JFK (New York)
- DXB (Dubai)
- NRT (Tokyo)
- SIN (Singapore)
- LAX (Los Angeles)
- FRA (Frankfurt)
- AMS (Amsterdam)
- MAD (Madrid)
- Et plus encore...

## 🎨 Personnalisation

Les couleurs et le thème peuvent être facilement personnalisés en modifiant les variables CSS dans `src/styles/index.css` :

```css
:root {
  --primary-color: #1e40af;
  --secondary-color: #3b82f6;
  --accent-color: #60a5fa;
  /* ... */
}
```

## 📱 Responsive Design

L'interface s'adapte automatiquement à toutes les tailles d'écran :
- Desktop : Grille complète avec toutes les informations
- Tablet : Layout adapté
- Mobile : Vue verticale optimisée

## 🚀 Améliorations futures possibles

- Intégration d'une API de vols réelle (FlightAware, Aviation Stack, etc.)
- Carte interactive avec visualisation des trajectoires de vol
- Notifications push pour les changements de statut
- Recherche et filtres avancés
- Historique des vols
- Mode sombre/clair
- Multi-langue

## 📄 Licence

Ce projet est un projet de démonstration pour DST Airlines.

## 👨‍💻 Développement

Développé avec ❤️ en utilisant React et Vite pour une expérience de développement optimale.

---

**DST Airlines** - Votre compagnon de voyage dans les airs
