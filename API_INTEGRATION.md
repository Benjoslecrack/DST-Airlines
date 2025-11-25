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

## Intégrations

### Page LiveFlights (`/live-flights`)

**Fichier** : `/src/pages/LiveFlights.jsx`

**Fonctionnalités** :
- Affiche les vols en temps réel sur une carte Leaflet
- Utilise les positions GPS réelles de l'API
- Mise à jour automatique toutes les 10 secondes
- Filtres : Tous / En vol / Au sol
- Détails complets au clic sur un marqueur

**Code clé** :
```javascript
import { statesService } from '../services'

const fetchFlights = async () => {
  const states = await statesService.getAllFlights(100)
  const validFlights = states
    .filter(state => state.latitude && state.longitude)
    .map(state => statesService.transformToFlightFormat(state))
  setFlights(validFlights)
}
```

**Données affichées** :
- Position réelle sur la carte
- ICAO24, indicatif (callsign)
- Pays d'origine
- Altitude, vitesse, cap
- Taux de montée/descente
- Statut (en vol / au sol)

### Page Dashboard (`/`)

**Fichier** : `/src/pages/Dashboard.jsx`

**Fonctionnalités** :
- Statistiques en temps réel
- Liste des vols récents
- Mise à jour automatique toutes les 15 secondes

**Statistiques affichées** :
- Total des vols actifs
- Nombre de vols en vol
- Nombre de pays d'origine différents
- Heure de dernière mise à jour

**Code clé** :
```javascript
import { statesService } from '../services'

const fetchDashboardData = async () => {
  const states = await statesService.getAllFlights(100)
  const validFlights = states
    .filter(state => state.latitude && state.longitude)
    .map(state => statesService.transformToFlightFormat(state))

  // Calcul des statistiques
  const inFlightCount = validFlights.filter(f => f.status === 'In Flight').length
  const uniqueCountries = new Set(validFlights.map(f => f.origin)).size
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
- ❌ Informations sur les aéroports de départ/arrivée
- ❌ Heures de départ/arrivée prévues
- ❌ Informations sur les retards

## Prochaines étapes possibles

1. **Enrichissement des données** :
   - Utiliser `/airlines/` pour obtenir les noms complets des compagnies
   - Utiliser `/aircrafts/` pour obtenir les détails des avions

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
