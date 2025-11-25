import { useState, useEffect } from 'react'
import StatsCard from '../components/StatsCard'
import FlightCard from '../components/FlightCard'
import { enrichmentService } from '../services'

function Dashboard() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState(null)
  const [error, setError] = useState(null)

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

      {/* Liste des vols récents */}
      <div className="dashboard-section">
        <h2>Vols récents</h2>
        <div className="flights-grid">
          {flights.slice(0, 5).map(flight => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
