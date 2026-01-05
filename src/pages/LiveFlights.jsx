import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { enrichmentService } from '../services'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Function to create a rotated plane icon based on heading
const createPlaneIcon = (heading, status) => {
  const color = status === 'In Flight' ? '#22c55e' : '#f59e0b';
  const rotation = heading || 0;

  return new L.DivIcon({
    html: `
      <div style="transform: rotate(${rotation}deg); width: 32px; height: 32px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <path d="M12 2l-1 8-8 1 8 2 2 8 2-8 8-2-8-1z" fill="${color}" stroke="white" stroke-width="1"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: 'plane-icon'
  });
};

// Airport icon
const airportIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">✈</text>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
})

// Major world airports data
const majorAirports = [
  { name: "Paris Charles de Gaulle", iata: "CDG", lat: 49.0097, lon: 2.5479, country: "France" },
  { name: "London Heathrow", iata: "LHR", lat: 51.4700, lon: -0.4543, country: "United Kingdom" },
  { name: "Frankfurt Airport", iata: "FRA", lat: 50.0379, lon: 8.5622, country: "Germany" },
  { name: "Amsterdam Schiphol", iata: "AMS", lat: 52.3105, lon: 4.7683, country: "Netherlands" },
  { name: "Madrid Barajas", iata: "MAD", lat: 40.4839, lon: -3.5680, country: "Spain" },
  { name: "Rome Fiumicino", iata: "FCO", lat: 41.8003, lon: 12.2389, country: "Italy" },
  { name: "New York JFK", iata: "JFK", lat: 40.6413, lon: -73.7781, country: "United States" },
  { name: "Los Angeles LAX", iata: "LAX", lat: 33.9416, lon: -118.4085, country: "United States" },
  { name: "Tokyo Haneda", iata: "HND", lat: 35.5494, lon: 139.7798, country: "Japan" },
  { name: "Dubai International", iata: "DXB", lat: 25.2532, lon: 55.3657, country: "United Arab Emirates" },
  { name: "Singapore Changi", iata: "SIN", lat: 1.3644, lon: 103.9915, country: "Singapore" },
  { name: "Hong Kong Int'l", iata: "HKG", lat: 22.3080, lon: 113.9185, country: "Hong Kong" },
  { name: "Sydney Kingsford", iata: "SYD", lat: -33.9399, lon: 151.1753, country: "Australia" },
  { name: "Toronto Pearson", iata: "YYZ", lat: 43.6777, lon: -79.6248, country: "Canada" },
  { name: "São Paulo GRU", iata: "GRU", lat: -23.4356, lon: -46.4731, country: "Brazil" },
  { name: "Istanbul Airport", iata: "IST", lat: 41.2753, lon: 28.7519, country: "Turkey" },
  { name: "Beijing Capital", iata: "PEK", lat: 40.0799, lon: 116.6031, country: "China" },
  { name: "Shanghai Pudong", iata: "PVG", lat: 31.1443, lon: 121.8083, country: "China" },
  { name: "Mumbai Int'l", iata: "BOM", lat: 19.0897, lon: 72.8681, country: "India" },
  { name: "Seoul Incheon", iata: "ICN", lat: 37.4602, lon: 126.4407, country: "South Korea" },
]

function LiveFlights() {
  const { t } = useTranslation()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState(null)
  const [showAirports, setShowAirports] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const flightsPerPage = 12

  const fetchFlights = async () => {
    try {
      setError(null)

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
    fetchFlights()

    const interval = setInterval(fetchFlights, 120000)

    return () => clearInterval(interval)
  }, [])

  const filteredFlights = filter === 'all'
    ? flights
    : flights.filter(flight => flight.status.toLowerCase() === filter.toLowerCase())

  const getPageNumbers = () => {
    const totalPages = Math.ceil(filteredFlights.length / flightsPerPage)
    const pages = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">{t('liveFlights.loading')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>{t('liveFlights.error')}</h2>
          <p>{error}</p>
          <button onClick={fetchFlights} className="retry-btn">{t('common.retry', 'Réessayer')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container live-flights-page">
      <div className="page-header">
        <h1>{t('liveFlights.title')}</h1>
        <p>{t('liveFlights.subtitle', 'Carte interactive des vols en temps réel')}</p>
      </div>

      <div className="map-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('liveFlights.all')} ({flights.length})
          </button>
          <button
            className={`filter-btn ${filter === 'In Flight' ? 'active' : ''}`}
            onClick={() => setFilter('In Flight')}
          >
            {t('liveFlights.inFlight')} ({flights.filter(f => f.status === 'In Flight').length})
          </button>
          <button
            className={`filter-btn ${filter === 'On Ground' ? 'active' : ''}`}
            onClick={() => setFilter('On Ground')}
          >
            {t('liveFlights.onGround')} ({flights.filter(f => f.status === 'On Ground').length})
          </button>
          <button
            className={`filter-btn ${showAirports ? 'active' : ''}`}
            onClick={() => setShowAirports(!showAirports)}
          >
            🛬 {showAirports ? t('liveFlights.hideAirports', 'Masquer aéroports') : t('liveFlights.showAirports', 'Afficher aéroports')}
          </button>
        </div>

        <div className="map-legend">
          <span className="legend-item">
            <span className="legend-dot status-on-time"></span> {t('liveFlights.inFlight')}
          </span>
          <span className="legend-item">
            <span className="legend-dot status-delayed"></span> {t('liveFlights.onGround')}
          </span>
          {showAirports && (
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#3b82f6' }}></span> Aéroports
            </span>
          )}
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

          {/* Flight markers with directional icons */}
          {filteredFlights.map(flight => {
            const currentPosition = [flight.latitude, flight.longitude]
            const planeIcon = createPlaneIcon(flight.heading, flight.status)

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
                      <p><strong>{t('liveFlights.airline')}:</strong> {flight.airlineInfo.name} ({flight.airlineInfo.country})</p>
                    )}
                    {flight.aircraftInfo && (
                      <p><strong>{t('liveFlights.aircraft')}:</strong> {flight.aircraftInfo.manufacturer} {flight.aircraftInfo.model}</p>
                    )}
                    <p><strong>ICAO24:</strong> {flight.icao24}</p>
                    <p><strong>{t('liveFlights.origin')}:</strong> {flight.origin}</p>
                    <p><strong>{t('liveFlights.altitude')}:</strong> {flight.altitude ? `${Math.round(flight.altitude)} m` : 'N/A'}</p>
                    <p><strong>{t('liveFlights.speed')}:</strong> {flight.velocity ? `${Math.round(flight.velocity)} m/s` : 'N/A'}</p>
                    <p><strong>{t('liveFlights.heading', 'Cap')}:</strong> {flight.heading ? `${Math.round(flight.heading)}°` : 'N/A'}</p>
                    <p className={`status-${flight.status.toLowerCase().replace(' ', '-')}`}>
                      <strong>{t('liveFlights.status')}:</strong> {flight.status}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {/* Airport markers */}
          {showAirports && majorAirports.map(airport => (
            <Marker
              key={airport.iata}
              position={[airport.lat, airport.lon]}
              icon={airportIcon}
            >
              <Popup>
                <div className="airport-popup">
                  <h3>🛬 {airport.name}</h3>
                  <p><strong>Code IATA:</strong> {airport.iata}</p>
                  <p><strong>Pays:</strong> {airport.country}</p>
                  <p><strong>Position:</strong> {airport.lat.toFixed(4)}°, {airport.lon.toFixed(4)}°</p>
                </div>
              </Popup>
            </Marker>
          ))}
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

      {/* Liste compacte des vols avec pagination */}
      <div className="flights-list-compact">
        <h2>{t('liveFlights.activeFlightsList', 'Liste des vols actifs')} ({filteredFlights.length})</h2>

        {/* Grid des vols */}
        <div className="flights-compact-grid">
          {filteredFlights
            .slice((currentPage - 1) * flightsPerPage, currentPage * flightsPerPage)
            .map(flight => (
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

        {/* Pagination */}
        {filteredFlights.length > flightsPerPage && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ← {t('liveFlights.previous')}
            </button>

            <div className="pagination-pages">
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                      ...
                    </span>
                  )
                }
                return (
                  <button
                    key={page}
                    className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              })}
            </div>

            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(filteredFlights.length / flightsPerPage),
                    currentPage + 1
                  )
                )
              }
              disabled={currentPage >= Math.ceil(filteredFlights.length / flightsPerPage)}
            >
              {t('liveFlights.next')} →
            </button>
          </div>
        )}

        {/* Info pagination */}
        {filteredFlights.length > flightsPerPage && (
          <div className="pagination-info">
            {t('liveFlights.showing', {
              start: (currentPage - 1) * flightsPerPage + 1,
              end: Math.min(currentPage * flightsPerPage, filteredFlights.length),
              total: filteredFlights.length
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveFlights
