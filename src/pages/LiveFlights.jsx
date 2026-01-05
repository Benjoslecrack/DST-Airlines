import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { enrichmentService, statesService } from '../services'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Function to create a rotated plane icon with color based on flight status
const createPlaneIcon = (rotation = 0, isOnGround = false) => {
  const color = isOnGround ? '#FF9800' : '#4CAF50' // Orange for grounded, green for flying
  return new L.DivIcon({
    html: `
      <div style="transform: rotate(${rotation}deg); width: 32px; height: 32px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <path d="M17.8 11.2 16 7l3.5-3.5c1.5-1.5 2-3.5 1.5-4.5-1-.5-3 0-4.5 1.5L13 4 4.8 2.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 8l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" fill="${color}" transform="translate(0, 2)"/>
        </svg>
      </div>
    `,
    className: 'plane-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

// Airport icon
const airportIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
      <circle cx="12" cy="12" r="10" fill="#FF5722" opacity="0.8"/>
      <path d="M12 4L14 10L20 12L14 14L12 20L10 14L4 12L10 10Z" fill="white"/>
    </svg>
  `),
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
})

function LiveFlights() {
  const { t } = useTranslation()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [flightTrack, setFlightTrack] = useState([])
  const [loadingTrack, setLoadingTrack] = useState(false)
  const [airports, setAirports] = useState({ departure: null, arrival: null })
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState(null)

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

  const fetchFlightTrack = async (callsign) => {
    setLoadingTrack(true)
    try {
      // Clean the callsign (trim whitespace)
      const cleanCallsign = callsign?.trim()

      if (!cleanCallsign || cleanCallsign.length < 3) {
        console.warn('Callsign too short or empty:', callsign)
        setFlightTrack([])
        setAirports({ departure: null, arrival: null })
        setLoadingTrack(false)
        return
      }

      console.log('Fetching flight track for callsign:', cleanCallsign)
      const trackData = await statesService.getFlightTrack(cleanCallsign)
      console.log('Flight track data received:', trackData)

      if (trackData && trackData.length > 0) {
        setFlightTrack(trackData)

        // Extract airport information from the first and last point
        const firstPoint = trackData[0]
        const lastPoint = trackData[trackData.length - 1]

        console.log('Departure airport:', firstPoint.dep_name)
        console.log('Arrival airport:', lastPoint.arr_name)

        setAirports({
          departure: firstPoint.dep_name ? {
            name: firstPoint.dep_name,
            position: [firstPoint.latitude, firstPoint.longitude]
          } : null,
          arrival: lastPoint.arr_name ? {
            name: lastPoint.arr_name,
            position: [lastPoint.latitude, lastPoint.longitude]
          } : null
        })
      } else {
        console.warn('No track data received for callsign:', cleanCallsign)
        setFlightTrack([])
        setAirports({ departure: null, arrival: null })
      }
    } catch (err) {
      console.error('Error fetching flight track for callsign:', callsign, err)
      setFlightTrack([])
      setAirports({ departure: null, arrival: null })
    } finally {
      setLoadingTrack(false)
    }
  }

  const handleFlightClick = (flight) => {
    setSelectedFlight(flight)
    console.log('Flight clicked:', flight.flightNumber, 'callsign:', flight.callsign)

    // Reset previous track
    setFlightTrack([])
    setAirports({ departure: null, arrival: null })

    if (flight.callsign?.trim()) {
      fetchFlightTrack(flight.callsign.trim())
    } else {
      console.warn('No valid callsign for flight:', flight.flightNumber)
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
          <button onClick={fetchFlights} className="retry-btn">{t('common.retry')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container live-flights-page">
      <div className="page-header">
        <h1>{t('liveFlights.title')}</h1>
        <p>{t('liveFlights.subtitle')}</p>
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
        </div>

        <div className="map-legend">
          <span className="legend-item">
            <span className="legend-dot status-on-time"></span> {t('liveFlights.inFlight')}
          </span>
          <span className="legend-item">
            <span className="legend-dot status-delayed"></span> {t('liveFlights.onGround')}
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

          {/* Flight markers with rotation */}
          {filteredFlights.map(flight => {
            const currentPosition = [flight.latitude, flight.longitude]
            const rotation = flight.heading || 0
            const isOnGround = flight.onGround || flight.status === 'On Ground'

            return (
              <Marker
                key={flight.id}
                position={currentPosition}
                icon={createPlaneIcon(rotation, isOnGround)}
                eventHandlers={{
                  click: () => handleFlightClick(flight)
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
                    <p><strong>{t('liveFlights.altitude')}:</strong> {flight.altitude ? `${Math.round(flight.altitude)} m` : t('common.notAvailable')}</p>
                    <p><strong>{t('liveFlights.speed')}:</strong> {flight.velocity ? `${Math.round(flight.velocity)} m/s` : t('common.notAvailable')}</p>
                    <p><strong>{t('liveFlights.heading')}:</strong> {flight.heading ? `${Math.round(flight.heading)}°` : t('common.notAvailable')}</p>
                    <p className={`status-${flight.status.toLowerCase().replace(' ', '-')}`}>
                      <strong>{t('liveFlights.status')}:</strong> {flight.status}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {/* Airport markers */}
          {airports.departure && (
            <Marker
              position={airports.departure.position}
              icon={airportIcon}
            >
              <Popup>
                <div className="airport-popup">
                  <h3>🛫 {t('liveFlights.departure')}</h3>
                  <p><strong>{airports.departure.name}</strong></p>
                </div>
              </Popup>
            </Marker>
          )}

          {airports.arrival && (
            <Marker
              position={airports.arrival.position}
              icon={airportIcon}
            >
              <Popup>
                <div className="airport-popup">
                  <h3>🛬 {t('liveFlights.arrival')}</h3>
                  <p><strong>{airports.arrival.name}</strong></p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Flight track polyline */}
          {flightTrack.length > 0 && (
            <Polyline
              positions={flightTrack.map(point => [point.latitude, point.longitude])}
              color="#FF5722"
              weight={3}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>

      {/* Détails du vol sélectionné */}
      {selectedFlight && (
        <div className="flight-details-card">
          <div className="flight-details-header">
            <h3>Détails du vol {selectedFlight.flightNumber}</h3>
            <button
              className="close-btn"
              onClick={() => {
                setSelectedFlight(null)
                setFlightTrack([])
                setAirports({ departure: null, arrival: null })
              }}
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

            {/* Flight track info */}
            <div className="detail-row" style={{ marginTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '16px' }}>
              <span className="detail-label">Trajectoire:</span>
              <span className="detail-value">
                {loadingTrack && '🔄 Chargement...'}
                {!loadingTrack && flightTrack.length > 0 && `✅ ${flightTrack.length} points`}
                {!loadingTrack && flightTrack.length === 0 && !selectedFlight.callsign && '❌ Pas d\'indicatif'}
                {!loadingTrack && flightTrack.length === 0 && selectedFlight.callsign && '⚠️ Aucune donnée'}
              </span>
            </div>

            {/* Airport info */}
            {(airports.departure || airports.arrival) && (
              <>
                {airports.departure && (
                  <div className="detail-row">
                    <span className="detail-label">🛫 Départ:</span>
                    <span className="detail-value">{airports.departure.name}</span>
                  </div>
                )}
                {airports.arrival && (
                  <div className="detail-row">
                    <span className="detail-label">🛬 Arrivée:</span>
                    <span className="detail-value">{airports.arrival.name}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Liste compacte des vols avec pagination */}
      <div className="flights-list-compact">
        <h2>{t('liveFlights.activeFlightsList')} ({filteredFlights.length})</h2>

        {/* Grid des vols */}
        <div className="flights-compact-grid">
          {filteredFlights
            .slice((currentPage - 1) * flightsPerPage, currentPage * flightsPerPage)
            .map(flight => (
              <div
                key={flight.id}
                className="flight-compact-card"
                onClick={() => handleFlightClick(flight)}
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
