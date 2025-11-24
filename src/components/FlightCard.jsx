function FlightCard({ flight }) {
  const getStatusClass = (status) => {
    const statusMap = {
      'On Time': 'status-on-time',
      'Delayed': 'status-delayed',
      'Boarding': 'status-boarding',
      'Departed': 'status-departed',
      'Cancelled': 'status-cancelled',
    }
    return statusMap[status] || 'status-on-time'
  }

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flight-card">
      <div className="flight-number">
        <div className="flight-code">{flight.flightNumber}</div>
        <div className="flight-airline">{flight.airline}</div>
      </div>

      <div className="flight-route">
        <div className="flight-location">
          <div className="location-code">{flight.origin.code}</div>
          <div className="location-name">{flight.origin.city}</div>
        </div>

        <div className="flight-arrow">→</div>

        <div className="flight-location">
          <div className="location-code">{flight.destination.code}</div>
          <div className="location-name">{flight.destination.city}</div>
        </div>
      </div>

      <div className="flight-info">
        <div className="flight-time">
          {formatTime(flight.departureTime)}
        </div>
        <div className={`flight-status ${getStatusClass(flight.status)}`}>
          {flight.status}
        </div>
      </div>
    </div>
  )
}

export default FlightCard
