import { useState, useEffect } from 'react'
import FlightCard from './components/FlightCard'
import StatsCard from './components/StatsCard'
import { generateFlights, updateFlightStatuses } from './utils/flightData'

function App() {
  const [flights, setFlights] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial flight data generation
    setTimeout(() => {
      setFlights(generateFlights(15))
      setLoading(false)
    }, 1000)

    // Update flight statuses every 10 seconds
    const interval = setInterval(() => {
      setFlights(prevFlights => updateFlightStatuses(prevFlights))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const filteredFlights = filter === 'all'
    ? flights
    : flights.filter(flight => flight.status.toLowerCase() === filter)

  const stats = {
    total: flights.length,
    onTime: flights.filter(f => f.status === 'On Time').length,
    delayed: flights.filter(f => f.status === 'Delayed').length,
    boarding: flights.filter(f => f.status === 'Boarding').length,
  }

  return (
    <div className="app">
      <header className="header">
        <h1>DST Airlines</h1>
        <p>Suivi des vols en temps réel</p>
      </header>

      <div className="stats-container">
        <StatsCard label="Total des vols" value={stats.total} />
        <StatsCard label="À l'heure" value={stats.onTime} color="success" />
        <StatsCard label="Retardés" value={stats.delayed} color="warning" />
        <StatsCard label="Embarquement" value={stats.boarding} color="info" />
      </div>

      <div className="flights-container">
        <div className="flights-header">
          <h2>Vols en direct</h2>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous
            </button>
            <button
              className={`filter-btn ${filter === 'on time' ? 'active' : ''}`}
              onClick={() => setFilter('on time')}
            >
              À l'heure
            </button>
            <button
              className={`filter-btn ${filter === 'delayed' ? 'active' : ''}`}
              onClick={() => setFilter('delayed')}
            >
              Retardés
            </button>
            <button
              className={`filter-btn ${filter === 'boarding' ? 'active' : ''}`}
              onClick={() => setFilter('boarding')}
            >
              Embarquement
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Chargement des vols...</div>
        ) : filteredFlights.length === 0 ? (
          <div className="no-flights">Aucun vol trouvé pour ce filtre</div>
        ) : (
          <div className="flights-grid">
            {filteredFlights.map(flight => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
