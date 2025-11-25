import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { enrichmentService } from '../services'

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
  const [error, setError] = useState(null)

  const fetchFlights = async () => {
    try {
      setError(null)

      // Fetch enriched flights data (includes airline and aircraft info)
      const enrichedFlights = await enrichmentService.getEnrichedFlights(500)

      setFlights(enrichedFlights)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching flights:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    fetchFlights()

    // Auto-refresh every 2 minutes for real-time updates
    const interval = setInterval(fetchFlights, 120000)

    return () => clearInterval(interval)
  }, [])

  const filteredFlights = filter === 'all'
    ? flights
    : flights.filter(flight => flight.status.toLowerCase() === filter.toLowerCase())

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Chargement de la carte des vols...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Erreur de connexion à l'API</h2>
          <p>{error}</p>
          <button onClick={fetchFlights} className="retry-btn">Réessayer</button>
        </div>
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
            className={`filter-btn ${filter === 'In Flight' ? 'active' : ''}`}
            onClick={() => setFilter('In Flight')}
          >
            En vol ({flights.filter(f => f.status === 'In Flight').length})
          </button>
          <button
            className={`filter-btn ${filter === 'On Ground' ? 'active' : ''}`}
            onClick={() => setFilter('On Ground')}
          >
            Au sol ({flights.filter(f => f.status === 'On Ground').length})
          </button>
        </div>

        <div className="map-legend">
          <span className="legend-item">
            <span className="legend-dot status-on-time"></span> En vol
          </span>
          <span className="legend-item">
            <span className="legend-dot status-delayed"></span> Au sol
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
            // Use real position from API
            const currentPosition = [flight.latitude, flight.longitude]

            return (
              <Marker
                key={flight.id}
                position={currentPosition}
                icon={planeIcon}
                eventHandlers={{
                  click: () => setSelectedFlight(flight)
                }}
              >
                <Popup>
                  <div className="flight-popup">
                    <h3>{flight.flightNumber}</h3>
                    {flight.airlineInfo && (
                      <p><strong>Compagnie:</strong> {flight.airlineInfo.name} ({flight.airlineInfo.country})</p>
                    )}
                    {flight.aircraftInfo && (
                      <p><strong>Appareil:</strong> {flight.aircraftInfo.manufacturer} {flight.aircraftInfo.model}</p>
                    )}
                    <p><strong>ICAO24:</strong> {flight.icao24}</p>
                    <p><strong>Origine:</strong> {flight.origin}</p>
                    <p><strong>Altitude:</strong> {flight.altitude ? `${Math.round(flight.altitude)} m` : 'N/A'}</p>
                    <p><strong>Vitesse:</strong> {flight.velocity ? `${Math.round(flight.velocity)} m/s` : 'N/A'}</p>
                    <p><strong>Cap:</strong> {flight.heading ? `${Math.round(flight.heading)}°` : 'N/A'}</p>
                    <p className={`status-${flight.status.toLowerCase().replace(' ', '-')}`}>
                      <strong>Statut:</strong> {flight.status}
                    </p>
                  </div>
                </Popup>
              </Marker>
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
            {selectedFlight.airlineInfo && (
              <>
                <div className="detail-row">
                  <span className="detail-label">Compagnie aérienne:</span>
                  <span className="detail-value">{selectedFlight.airlineInfo.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Code IATA/ICAO:</span>
                  <span className="detail-value">
                    {selectedFlight.airlineInfo.iata || 'N/A'} / {selectedFlight.airlineInfo.icao || 'N/A'}
                  </span>
                </div>
              </>
            )}

            {selectedFlight.aircraftInfo && (
              <>
                <div className="detail-row">
                  <span className="detail-label">Type d'appareil:</span>
                  <span className="detail-value">
                    {selectedFlight.aircraftInfo.manufacturer} {selectedFlight.aircraftInfo.model}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Catégorie:</span>
                  <span className="detail-value">
                    {selectedFlight.aircraftInfo.type} ({selectedFlight.aircraftInfo.wingType})
                  </span>
                </div>
              </>
            )}

            <div className="detail-row">
              <span className="detail-label">ICAO24:</span>
              <span className="detail-value">{selectedFlight.icao24}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Indicatif:</span>
              <span className="detail-value">{selectedFlight.callsign || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Pays d'origine:</span>
              <span className="detail-value">{selectedFlight.origin}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Position:</span>
              <span className="detail-value">
                {selectedFlight.latitude?.toFixed(4)}°, {selectedFlight.longitude?.toFixed(4)}°
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Altitude:</span>
              <span className="detail-value">
                {selectedFlight.altitude ? `${Math.round(selectedFlight.altitude)} m` : 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Vitesse:</span>
              <span className="detail-value">
                {selectedFlight.velocity ? `${Math.round(selectedFlight.velocity)} m/s (~${Math.round(selectedFlight.velocity * 3.6)} km/h)` : 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Cap:</span>
              <span className="detail-value">
                {selectedFlight.heading ? `${Math.round(selectedFlight.heading)}°` : 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Taux vertical:</span>
              <span className="detail-value">
                {selectedFlight.verticalRate ? `${selectedFlight.verticalRate > 0 ? '+' : ''}${selectedFlight.verticalRate.toFixed(1)} m/s` : 'N/A'}
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
        <h2>Liste des vols actifs ({filteredFlights.length})</h2>
        <div className="flights-compact-grid">
          {filteredFlights.map(flight => (
            <div
              key={flight.id}
              className="flight-compact-card"
              onClick={() => setSelectedFlight(flight)}
            >
              <div className="compact-flight-number">{flight.flightNumber}</div>
              <div className="compact-route">
                {flight.airlineName || flight.origin}
                {flight.aircraftModel && ` • ${flight.aircraftModel}`}
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
