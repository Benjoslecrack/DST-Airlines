import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { enrichmentService } from '../services'
import AirlineLogo from '../components/AirlineLogo'

function Analytics() {
  const { t } = useTranslation()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrichedFlights = await enrichmentService.getEnrichedFlights(500)
        setFlights(enrichedFlights)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">{t('analytics.loading')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>{t('analytics.error')}</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // Calculate analytics data
  const statusDistribution = flights.reduce((acc, flight) => {
    acc[flight.status] = (acc[flight.status] || 0) + 1
    return acc
  }, {})

  const countryDistribution = flights.reduce((acc, flight) => {
    acc[flight.origin] = (acc[flight.origin] || 0) + 1
    return acc
  }, {})

  const airlineDistribution = flights
    .filter(f => f.airlineInfo)
    .reduce((acc, flight) => {
      const name = flight.airlineInfo.name
      if (!acc[name]) {
        acc[name] = { count: 0, info: flight.airlineInfo }
      }
      acc[name].count++
      return acc
    }, {})

  const aircraftTypeDistribution = flights
    .filter(f => f.aircraftInfo)
    .reduce((acc, flight) => {
      const type = `${flight.aircraftInfo.manufacturer} ${flight.aircraftInfo.model}`
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

  // Sort and get top items
  const topCountries = Object.entries(countryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const topAirlines = Object.entries(airlineDistribution)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)

  const topAircraftTypes = Object.entries(aircraftTypeDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const maxCountryCount = Math.max(...topCountries.map(([, count]) => count))
  const maxAirlineCount = Math.max(...topAirlines.map(([, data]) => data.count))
  const maxAircraftCount = Math.max(...topAircraftTypes.map(([, count]) => count))

  // Average metrics
  const avgAltitude = flights
    .filter(f => f.altitude)
    .reduce((sum, f) => sum + f.altitude, 0) / flights.filter(f => f.altitude).length

  const avgVelocity = flights
    .filter(f => f.velocity)
    .reduce((sum, f) => sum + f.velocity, 0) / flights.filter(f => f.velocity).length

  return (
    <div className="page-container analytics-page">
      <div className="page-header">
        <h1>{t('analytics.title')}</h1>
        <p>{t('analytics.subtitle')}</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="analytics-metrics">
        <div className="metric-card">
          <div className="metric-icon">✈️</div>
          <div className="metric-content">
            <div className="metric-value">{flights.length}</div>
            <div className="metric-label">{t('analytics.totalFlights')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌍</div>
          <div className="metric-content">
            <div className="metric-value">{Object.keys(countryDistribution).length}</div>
            <div className="metric-label">{t('analytics.countries')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏢</div>
          <div className="metric-content">
            <div className="metric-value">{Object.keys(airlineDistribution).length}</div>
            <div className="metric-label">{t('analytics.airlines')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🛩️</div>
          <div className="metric-content">
            <div className="metric-value">{Object.keys(aircraftTypeDistribution).length}</div>
            <div className="metric-label">{t('analytics.aircraftTypes')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📏</div>
          <div className="metric-content">
            <div className="metric-value">{Math.round(avgAltitude).toLocaleString()} m</div>
            <div className="metric-label">{t('analytics.averageAltitude')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">{Math.round(avgVelocity * 3.6)} km/h</div>
            <div className="metric-label">{t('analytics.averageSpeed')}</div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="analytics-section">
        <h2>{t('analytics.statusDistribution')}</h2>
        <div className="chart-container">
          <div className="pie-chart-grid">
            {Object.entries(statusDistribution).map(([status, count]) => {
              const percentage = ((count / flights.length) * 100).toFixed(1)
              return (
                <div key={status} className="pie-slice-item">
                  <div className="slice-visual">
                    <div
                      className="slice-bar"
                      style={{
                        width: `${percentage}%`,
                        background: status === 'In Flight' ? 'var(--success-color)' : 'var(--warning-color)'
                      }}
                    />
                  </div>
                  <div className="slice-info">
                    <span className="slice-label">{status}</span>
                    <span className="slice-value">{count} ({percentage}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Airlines */}
      <div className="analytics-section">
        <h2>{t('analytics.topAirlines')}</h2>
        <div className="chart-container">
          <div className="bar-chart">
            {topAirlines.map(([airline, data], index) => {
              const percentage = (data.count / maxAirlineCount) * 100
              return (
                <div key={airline} className="bar-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bar-label-with-logo">
                    <AirlineLogo airlineInfo={data.info} size="small" />
                    <span className="bar-label">{airline}</span>
                  </div>
                  <div className="bar-visual">
                    <div
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="bar-value">{data.count}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <div className="analytics-section">
        <h2>{t('analytics.topCountries')}</h2>
        <div className="chart-container">
          <div className="bar-chart">
            {topCountries.map(([country, count], index) => {
              const percentage = (count / maxCountryCount) * 100
              return (
                <div key={country} className="bar-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bar-label-container">
                    <span className="bar-label">{country}</span>
                  </div>
                  <div className="bar-visual">
                    <div
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="bar-value">{count}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Aircraft Types */}
      <div className="analytics-section">
        <h2>{t('analytics.topAircraftTypes')}</h2>
        <div className="chart-container">
          <div className="bar-chart horizontal-compact">
            {topAircraftTypes.map(([type, count], index) => {
              const percentage = (count / maxAircraftCount) * 100
              return (
                <div key={type} className="bar-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bar-label-container">
                    <span className="bar-label">{type}</span>
                  </div>
                  <div className="bar-visual">
                    <div
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="bar-value">{count}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
