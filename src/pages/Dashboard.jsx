import { useState, useEffect } from 'react'
import StatsCard from '../components/StatsCard'
import FlightCard from '../components/FlightCard'
import { generateFlights, updateFlightStatuses } from '../utils/flightData'

function Dashboard() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    // Simuler un appel API pour récupérer les données du dashboard
    const fetchDashboardData = async () => {
      try {
        // TODO: Remplacer par l'appel réel à votre API
        // const response = await fetch('YOUR_API_ENDPOINT/dashboard')
        // const data = await response.json()

        // Simulation de données API
        setTimeout(() => {
          const flightData = generateFlights(10)
          setFlights(flightData)

          setApiData({
            totalFlights: flightData.length,
            onTime: flightData.filter(f => f.status === 'On Time').length,
            delayed: flightData.filter(f => f.status === 'Delayed').length,
            cancelled: 0,
            avgDelay: 12, // minutes
            airports: 15,
            airlines: 7,
          })

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Mise à jour périodique des données
    const interval = setInterval(() => {
      setFlights(prevFlights => updateFlightStatuses(prevFlights))
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Chargement du tableau de bord...</div>
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
          label="À l'heure"
          value={apiData?.onTime || 0}
          color="success"
        />
        <StatsCard
          label="Retardés"
          value={apiData?.delayed || 0}
          color="warning"
        />
        <StatsCard
          label="Retard moyen"
          value={`${apiData?.avgDelay || 0} min`}
          color="info"
        />
      </div>

      {/* Statistiques secondaires */}
      <div className="stats-container secondary">
        <StatsCard
          label="Aéroports desservis"
          value={apiData?.airports || 0}
        />
        <StatsCard
          label="Compagnies actives"
          value={apiData?.airlines || 0}
        />
        <StatsCard
          label="Annulés"
          value={apiData?.cancelled || 0}
          color="danger"
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
