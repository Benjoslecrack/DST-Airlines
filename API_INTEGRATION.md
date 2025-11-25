# Intégration de l'API DST Airlines

## Vue d'ensemble

L'application DST Airlines est maintenant connectée à l'API DST Airlines pour afficher des données de vols en temps réel.

## Configuration

### Variables d'environnement

Le fichier `.env` contient la configuration de l'API :

```env
VITE_API_BASE_URL=http://94.238.244.170:8000
VITE_API_KEY=fjFonsXHGSE7QcY4UVb1oV78xNhPjyQl7CR5DrNRcty3dtn06z
```

## Architecture

### Services API

Tous les services API sont situés dans `/src/services/` :

#### 1. `api.js` - Client API principal
- Configure les requêtes avec l'URL de base et les headers d'authentification
- Gère les erreurs HTTP
- Méthodes : `get()`, `post()`, `request()`

#### 2. `statesService.js` - États des vols
- **Endpoint** : `GET /states/`
- **Fonction principale** : `getAllFlights(limit)` - Récupère tous les vols actifs
- **Filtres disponibles** : icao24, origin_country, callsign, airline
- **Transformation** : `transformToFlightFormat()` convertit les données API au format interne
- **Données retournées** :
  - Position GPS (latitude, longitude)
  - Altitude, vitesse, cap
  - Statut (In Flight / On Ground)
  - ICAO24, callsign, pays d'origine

#### 3. `aircraftsService.js` - Avions
- **Endpoint** : `GET /aircrafts/`
- **Filtres** : model, manufacturer, wing_type, aircraft_type, icao_code, iata_code

#### 4. `airlinesService.js` - Compagnies aériennes
- **Endpoint** : `GET /airlines/`
- **Filtres** : iata, icao, airline, callsign, country

#### 5. `countriesService.js` - Pays
- **Endpoint** : `GET /countries/`
- **Filtres** : name, continent

#### 6. `enrichmentService.js` - ⭐ Enrichissement des données
- **Fonction** : Croise les données de plusieurs endpoints pour enrichir les informations de vols
- **Méthode principale** : `getEnrichedFlights(limit)` - Récupère et enrichit les vols
- **Fonctionnalités** :
  - **Cache intelligent** : Met en cache les données airlines/aircrafts pendant 5 minutes
  - **Croisement automatique** : Associe chaque vol à sa compagnie et son type d'avion
  - **Matching intelligent** :
    - Compagnies : Par callsign, ICAO code, ou pays d'origine
    - Avions : Par code ICAO24
  - **Données enrichies** :
    - `airlineInfo` : Nom complet, IATA/ICAO, pays, callsign
    - `aircraftInfo` : Modèle, fabricant, type, wingType
    - `airlineName` : Nom affiché de la compagnie
    - `aircraftModel` : Modèle complet (ex: "Boeing 737")

**Exemple de données enrichies** :
```javascript
{
  // Données de base
  id: 123,
  icao24: "abc123",
  flightNumber: "AF1234",
  latitude: 48.8566,
  longitude: 2.3522,

  // Enrichissement compagnie
  airlineInfo: {
    name: "Air France",
    iata: "AF",
    icao: "AFR",
    country: "France",
    callsign: "AIRFRANS"
  },
  airlineName: "Air France",

  // Enrichissement avion
  aircraftInfo: {
    manufacturer: "Airbus",
    model: "A320",
    type: "airplane",
    wingType: "fixed_wing"
  },
  aircraftModel: "Airbus A320"
}
```

**Avantages** :
- ✅ Une seule requête pour obtenir des données complètes
- ✅ Cache pour optimiser les performances
- ✅ Fallback gracieux si les données ne sont pas trouvées
- ✅ Pas de requêtes multiples côté client

## Intégrations

### Page LiveFlights (`/live-flights`)

**Fichier** : `/src/pages/LiveFlights.jsx`

**Fonctionnalités** :
- Affiche les vols en temps réel sur une carte Leaflet
- Utilise les positions GPS réelles de l'API
- **✨ Données enrichies** : Nom des compagnies et types d'avions affichés
- Mise à jour automatique toutes les 10 secondes
- Filtres : Tous / En vol / Au sol
- Détails complets au clic sur un marqueur

**Code clé** :
```javascript
import { enrichmentService } from '../services'

const fetchFlights = async () => {
  // Récupère les vols avec données enrichies (compagnies + avions)
  const enrichedFlights = await enrichmentService.getEnrichedFlights(100)
  setFlights(enrichedFlights)
}
```

**Données affichées** :
- Position réelle sur la carte
- **✨ Nom complet de la compagnie aérienne** (ex: "Air France")
- **✨ Modèle de l'avion** (ex: "Airbus A320")
- ICAO24, indicatif (callsign)
- Pays d'origine
- Altitude, vitesse, cap
- Taux de montée/descente
- Statut (en vol / au sol)
- **✨ Codes IATA/ICAO de la compagnie**
- **✨ Fabricant et type d'appareil**

### Page Dashboard (`/`)

**Fichier** : `/src/pages/Dashboard.jsx`

**Fonctionnalités** :
- Statistiques en temps réel enrichies
- Liste des vols récents avec noms de compagnies
- Mise à jour automatique toutes les 15 secondes
- **✨ Compte précis des compagnies et types d'avions**

**Statistiques affichées** :
- Total des vols actifs
- Nombre de vols en vol
- Nombre de vols au sol
- **✨ Nombre de compagnies aériennes actives** (données enrichies)
- **✨ Nombre de types d'appareils différents** (données enrichies)
- Nombre de pays d'origine différents
- Heure de dernière mise à jour

**Code clé** :
```javascript
import { enrichmentService } from '../services'

const fetchDashboardData = async () => {
  // Récupère les vols enrichis
  const enrichedFlights = await enrichmentService.getEnrichedFlights(100)

  // Calcul des statistiques enrichies
  const inFlightCount = enrichedFlights.filter(f => f.status === 'In Flight').length

  // Compte les compagnies uniques grâce à l'enrichissement
  const uniqueAirlines = new Set(
    enrichedFlights
      .filter(f => f.airlineInfo)
      .map(f => f.airlineInfo.name)
  ).size

  // Compte les types d'avions uniques
  const uniqueAircraftTypes = new Set(
    enrichedFlights
      .filter(f => f.aircraftInfo)
      .map(f => `${f.aircraftInfo.manufacturer} ${f.aircraftInfo.model}`)
  ).size
}
```

### Composant FlightCard

**Fichier** : `/src/components/FlightCard.jsx`

Le composant a été adapté pour supporter deux formats de données :
- **Format ancien** (données mockées) : pour la compatibilité
- **Format API** (données réelles) : avec icao24, origine, statut In Flight/On Ground

## Gestion des erreurs

Toutes les pages incluent :
- Indicateur de chargement pendant les requêtes
- Message d'erreur en cas d'échec de connexion
- Bouton "Réessayer" pour retenter la connexion

Exemple :
```javascript
if (error) {
  return (
    <div className="error-message">
      <h2>Erreur de connexion à l'API</h2>
      <p>{error}</p>
      <button onClick={fetchFlights}>Réessayer</button>
    </div>
  )
}
```

## Authentification

Toutes les requêtes incluent automatiquement le header d'authentification :
```
X-API-Key: fjFonsXHGSE7QcY4UVb1oV78xNhPjyQl7CR5DrNRcty3dtn06z
```

## Pagination

Les services supportent la pagination avec les paramètres :
- `limit` : Nombre de résultats (max 500, défaut 50)
- `offset` : Décalage pour la pagination (défaut 0)

## Limites actuelles de l'API

L'API `/states/` fournit :
- ✅ Positions GPS en temps réel
- ✅ Données de vol (altitude, vitesse, cap)
- ✅ Statut (en vol / au sol)
- ✅ **NOUVEAU** : Enrichissement avec `/airlines/` et `/aircrafts/`
- ❌ Informations sur les aéroports de départ/arrivée
- ❌ Heures de départ/arrivée prévues
- ❌ Informations sur les retards

## ✨ Améliorations récentes

### Enrichissement automatique des données (v2.0)

**Problème résolu** : L'API `/states/` ne fournissait pas les noms des compagnies ni les types d'avions.

**Solution implémentée** :
- Nouveau service `enrichmentService.js` qui croise automatiquement les données
- Cache intelligent de 5 minutes pour optimiser les performances
- Matching automatique des compagnies par callsign/ICAO
- Matching des avions par code ICAO24

**Résultats** :
- ✅ Noms complets des compagnies aériennes affichés partout
- ✅ Modèles d'avions affichés (ex: "Airbus A320")
- ✅ Statistiques précises (nombre de compagnies actives)
- ✅ Pas d'impact sur les performances (grâce au cache)

## Prochaines étapes possibles

1. ~~**Enrichissement des données**~~ ✅ **FAIT**
   - ✅ Utiliser `/airlines/` pour obtenir les noms complets des compagnies
   - ✅ Utiliser `/aircrafts/` pour obtenir les détails des avions

2. **Fonctionnalités avancées** :
   - Recherche de vols par callsign
   - Filtre par pays d'origine
   - Historique des trajectoires
   - Notifications de changement de statut

3. **Optimisations** :
   - Cache des données
   - Websocket pour les mises à jour en temps réel
   - Lazy loading de la carte

## Test de l'intégration

Pour tester l'intégration :

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

3. Ouvrir `http://localhost:3000` dans un navigateur

4. Vérifier :
   - Les vols s'affichent sur la carte `/live-flights`
   - Les statistiques sont à jour sur le dashboard `/`
   - Les mises à jour automatiques fonctionnent

## Dépannage

### Erreur "Failed to fetch"
- Vérifier que l'API est accessible : `http://94.238.244.170:8000`
- Vérifier la clé API dans le fichier `.env`
- Vérifier les CORS si l'erreur persiste

### Pas de vols affichés
- Vérifier la console du navigateur pour les erreurs
- Vérifier que l'API retourne bien des données avec latitude/longitude valides

### Erreurs de build
- Supprimer `node_modules` et réinstaller : `rm -rf node_modules && npm install`
- Vérifier la version de Node.js (recommandé : v18+)
