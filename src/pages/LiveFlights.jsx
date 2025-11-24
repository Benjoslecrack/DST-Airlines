import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { generateFlights, updateFlightStatuses } from '../utils/flightData'
import { getAirportCoordinates } from '../utils/mapData'

// Fix pour les icônes Leaflet avec Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Icône personnalisée pour les avions
const planeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="12" fill="#3b82f6"/>
      <path d="M17.8 11.2 16 7l3.5-3.5c1.5-1.5 2-3.5 1.5-4.5-1-.5-3 0-4.5 1.5L13 4 4.8 2.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 8l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" fill="white" transform="translate(0, 2)"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

function LiveFlights() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Charger les vols en direct
    setTimeout(() => {
      setFlights(generateFlights(20))
      setLoading(false)
    }, 1000)

    // Mise à jour en temps réel
    const interval = setInterval(() => {
      setFlights(prevFlights => updateFlightStatuses(prevFlights))
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const filteredFlights = filter === 'all'
    ? flights
    : flights.filter(flight => flight.status.toLowerCase() === filter)

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Chargement de la carte des vols...</div>
      </div>
    )
  }

  return (
    <div className="page-container live-flights-page">
      <div className="page-header">
        <h1>Vols en direct</h1>
        <p>Carte interactive des vols en temps réel</p>
      </div>

      <div className="map-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous ({flights.length})
          </button>
          <button
            className={`filter-btn ${filter === 'on time' ? 'active' : ''}`}
            onClick={() => setFilter('on time')}
          >
            À l'heure ({flights.filter(f => f.status === 'On Time').length})
          </button>
          <button
            className={`filter-btn ${filter === 'delayed' ? 'active' : ''}`}
            onClick={() => setFilter('delayed')}
          >
            Retardés ({flights.filter(f => f.status === 'Delayed').length})
          </button>
          <button
            className={`filter-btn ${filter === 'boarding' ? 'active' : ''}`}
            onClick={() => setFilter('boarding')}
          >
            Embarquement ({flights.filter(f => f.status === 'Boarding').length})
          </button>
        </div>

        <div className="map-legend">
          <span className="legend-item">
            <span className="legend-dot status-on-time"></span> À l'heure
          </span>
          <span className="legend-item">
            <span className="legend-dot status-delayed"></span> Retardé
          </span>
          <span className="legend-item">
            <span className="legend-dot status-boarding"></span> Embarquement
          </span>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={3}
          style={{ height: '600px', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredFlights.map(flight => {
            const originCoords = getAirportCoordinates(flight.origin.code)
            const destCoords = getAirportCoordinates(flight.destination.code)

            // Position actuelle de l'avion (simulation)
            const progress = Math.random() * 0.7 + 0.15 // Entre 15% et 85% du trajet
            const currentPosition = [
              originCoords[0] + (destCoords[0] - originCoords[0]) * progress,
              originCoords[1] + (destCoords[1] - originCoords[1]) * progress,
            ]

            const pathColor = flight.status === 'Delayed' ? '#f59e0b' :
                             flight.status === 'On Time' ? '#10b981' : '#3b82f6'

            return (
              <div key={flight.id}>
                {/* Trajectoire du vol */}
                <Polyline
                  positions={[originCoords, destCoords]}
                  pathOptions={{
                    color: pathColor,
                    weight: 2,
                    opacity: 0.4,
                    dashArray: '5, 10'
                  }}
                />

                {/* Position actuelle de l'avion */}
                <Marker
                  position={currentPosition}
                  icon={planeIcon}
                  eventHandlers={{
                    click: () => setSelectedFlight(flight)
                  }}
                >
                  <Popup>
                    <div className="flight-popup">
                      <h3>{flight.flightNumber}</h3>
                      <p><strong>{flight.airline}</strong></p>
                      <p>
                        {flight.origin.code} ({flight.origin.city}) →{' '}
                        {flight.destination.code} ({flight.destination.city})
                      </p>
                      <p>
                        Départ: {new Date(flight.departureTime).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className={`status-${flight.status.toLowerCase().replace(' ', '-')}`}>
                        Statut: {flight.status}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </div>
            )
          })}
        </MapContainer>
      </div>

      {/* Détails du vol sélectionné */}
      {selectedFlight && (
        <div className="flight-details-card">
          <div className="flight-details-header">
            <h3>Détails du vol {selectedFlight.flightNumber}</h3>
            <button
              className="close-btn"
              onClick={() => setSelectedFlight(null)}
            >
              ✕
            </button>
          </div>
          <div className="flight-details-content">
            <div className="detail-row">
              <span className="detail-label">Compagnie:</span>
              <span className="detail-value">{selectedFlight.airline}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Départ:</span>
              <span className="detail-value">
                {selectedFlight.origin.code} - {selectedFlight.origin.city}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Destination:</span>
              <span className="detail-value">
                {selectedFlight.destination.code} - {selectedFlight.destination.city}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Heure de départ:</span>
              <span className="detail-value">
                {new Date(selectedFlight.departureTime).toLocaleString('fr-FR')}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Statut:</span>
              <span className={`flight-status status-${selectedFlight.status.toLowerCase().replace(' ', '-')}`}>
                {selectedFlight.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Liste compacte des vols */}
      <div className="flights-list-compact">
        <h2>Liste des vols actifs</h2>
        <div className="flights-compact-grid">
          {filteredFlights.map(flight => (
            <div
              key={flight.id}
              className="flight-compact-card"
              onClick={() => setSelectedFlight(flight)}
            >
              <div className="compact-flight-number">{flight.flightNumber}</div>
              <div className="compact-route">
                {flight.origin.code} → {flight.destination.code}
              </div>
              <div className={`compact-status status-${flight.status.toLowerCase().replace(' ', '-')}`}>
                {flight.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LiveFlights
