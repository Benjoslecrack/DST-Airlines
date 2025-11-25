import { useState, useEffect } from 'react'
import StatsCard from '../components/StatsCard'
import FlightCard from '../components/FlightCard'
import { enrichmentService } from '../services'

function Dashboard() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState(null)
  const [error, setError] = useState(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAirline, setSelectedAirline] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')

  const fetchDashboardData = async () => {
    try {
      setError(null)

      // Fetch enriched flights data
      const enrichedFlights = await enrichmentService.getEnrichedFlights(500)

      setFlights(enrichedFlights)

      // Calculate statistics from enriched data
      const inFlightCount = enrichedFlights.filter(f => f.status === 'In Flight').length
      const onGroundCount = enrichedFlights.filter(f => f.status === 'On Ground').length

      // Count unique airlines (enriched data)
      const uniqueAirlines = new Set(
        enrichedFlights
          .filter(f => f.airlineInfo)
          .map(f => f.airlineInfo.name)
      ).size

      // Count unique aircraft types
      const uniqueAircraftTypes = new Set(
        enrichedFlights
          .filter(f => f.aircraftInfo)
          .map(f => `${f.aircraftInfo.manufacturer} ${f.aircraftInfo.model}`)
      ).size

      // Count unique countries
      const uniqueCountries = new Set(enrichedFlights.map(f => f.origin)).size

      setApiData({
        totalFlights: enrichedFlights.length,
        onTime: inFlightCount,
        onGround: onGroundCount,
        airports: uniqueCountries,
        airlines: uniqueAirlines || uniqueCountries, // Fallback to countries
        aircraftTypes: uniqueAircraftTypes,
      })

      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error)
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchDashboardData, 120000)

    return () => clearInterval(interval)
  }, [])

  // Get unique airlines for filter dropdown
  const uniqueAirlines = Array.from(
    new Set(flights.filter(f => f.airlineInfo).map(f => f.airlineInfo.name))
  ).sort()

  // Get unique countries for filter dropdown
  const uniqueCountries = Array.from(
    new Set(flights.map(f => f.origin))
  ).sort()

  // Get unique statuses
  const uniqueStatuses = Array.from(
    new Set(flights.map(f => f.status))
  ).sort()

  // Filter flights based on search and filters
  const filteredFlights = flights.filter(flight => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        flight.flightNumber?.toLowerCase().includes(searchLower) ||
        flight.icao24?.toLowerCase().includes(searchLower) ||
        flight.callsign?.toLowerCase().includes(searchLower) ||
        flight.airlineName?.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false
    }

    // Airline filter
    if (selectedAirline && flight.airlineInfo?.name !== selectedAirline) {
      return false
    }

    // Status filter
    if (selectedStatus && flight.status !== selectedStatus) {
      return false
    }

    // Country filter
    if (selectedCountry && flight.origin !== selectedCountry) {
      return false
    }

    return true
  })

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedAirline('')
    setSelectedStatus('')
    setSelectedCountry('')
  }

  // Check if any filter is active
  const hasActiveFilters = searchTerm || selectedAirline || selectedStatus || selectedCountry

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Chargement du tableau de bord...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Erreur de connexion à l'API</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">Réessayer</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble des opérations aériennes en temps réel</p>
      </div>

      {/* Statistiques principales */}
      <div className="stats-container">
        <StatsCard
          label="Total des vols"
          value={apiData?.totalFlights || 0}
        />
        <StatsCard
          label="En vol"
          value={apiData?.onTime || 0}
          color="success"
        />
        <StatsCard
          label="Au sol"
          value={apiData?.onGround || 0}
          color="warning"
        />
        <StatsCard
          label="Compagnies actives"
          value={apiData?.airlines || 0}
          color="info"
        />
      </div>

      {/* Statistiques secondaires */}
      <div className="stats-container secondary">
        <StatsCard
          label="Pays d'origine"
          value={apiData?.airports || 0}
        />
        <StatsCard
          label="Types d'appareils"
          value={apiData?.aircraftTypes || 0}
        />
        <StatsCard
          label="Dernière mise à jour"
          value={new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        />
      </div>

      {/* Filtres */}
      <div className="dashboard-filters">
        <div className="filters-header">
          <h3>🔍 Filtres</h3>
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Effacer les filtres
            </button>
          )}
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Recherche</label>
            <div className="search-wrapper">
              <span className="search-icon">🔎</span>
              <input
                type="text"
                className="search-input"
                placeholder="Numéro de vol, ICAO24, compagnie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Compagnie</label>
            <select
              className="filter-select"
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
            >
              <option value="">Toutes les compagnies</option>
              {uniqueAirlines.map(airline => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Statut</label>
            <select
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Pays d'origine</label>
            <select
              className="filter-select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Tous les pays</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="active-filters">
            {searchTerm && (
              <div className="filter-tag">
                Recherche: "{searchTerm}"
                <button
                  className="filter-tag-remove"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              </div>
            )}
            {selectedAirline && (
              <div className="filter-tag">
                Compagnie: {selectedAirline}
                <button
                  className="filter-tag-remove"
                  onClick={() => setSelectedAirline('')}
                >
                  ×
                </button>
              </div>
            )}
            {selectedStatus && (
              <div className="filter-tag">
                Statut: {selectedStatus}
                <button
                  className="filter-tag-remove"
                  onClick={() => setSelectedStatus('')}
                >
                  ×
                </button>
              </div>
            )}
            {selectedCountry && (
              <div className="filter-tag">
                Pays: {selectedCountry}
                <button
                  className="filter-tag-remove"
                  onClick={() => setSelectedCountry('')}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Liste des vols filtrés */}
      <div className="dashboard-section">
        <h2>
          Vols {hasActiveFilters && `(${filteredFlights.length}/${flights.length})`}
        </h2>
        <div className="flights-grid">
          {filteredFlights.length > 0 ? (
            filteredFlights.slice(0, 10).map(flight => (
              <FlightCard key={flight.id} flight={flight} />
            ))
          ) : (
            <div className="no-results">
              <p>Aucun vol trouvé avec ces filtres</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
