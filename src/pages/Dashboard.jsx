import { useState, useEffect } from 'react'
import StatsCard from '../components/StatsCard'
import FlightCard from '../components/FlightCard'
import { statesService, countriesService } from '../services'

function Dashboard() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState(null)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setError(null)

      // Fetch flights data from API
      const states = await statesService.getAllFlights(100)

      // Filter valid flights
      const validFlights = states
        .filter(state => state.latitude && state.longitude)
        .map(state => statesService.transformToFlightFormat(state))

      setFlights(validFlights)

      // Calculate statistics from real data
      const inFlightCount = validFlights.filter(f => f.status === 'In Flight').length
      const onGroundCount = validFlights.filter(f => f.status === 'On Ground').length

      // Count unique countries (as proxy for airports)
      const uniqueCountries = new Set(validFlights.map(f => f.origin)).size

      setApiData({
        totalFlights: validFlights.length,
        onTime: inFlightCount,
        delayed: 0, // API doesn't provide delay info
        cancelled: 0, // API doesn't provide cancelled info
        avgDelay: 0, // API doesn't provide delay times
        airports: uniqueCountries,
        airlines: uniqueCountries, // Using countries as proxy for airlines
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

    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchDashboardData, 15000)

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
          label="Pays d'origine"
          value={apiData?.airports || 0}
          color="info"
        />
        <StatsCard
          label="Dernière mise à jour"
          value={new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          color="info"
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
