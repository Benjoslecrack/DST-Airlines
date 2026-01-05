import AirlineLogo from './AirlineLogo'
import { useTranslation } from 'react-i18next'

function FlightCard({ flight }) {
  const { t } = useTranslation()
  const getStatusClass = (status) => {
    const statusMap = {
      'On Time': 'status-on-time',
      'Delayed': 'status-delayed',
      'Boarding': 'status-boarding',
      'Departed': 'status-departed',
      'Cancelled': 'status-cancelled',
      'In Flight': 'status-on-time',
      'On Ground': 'status-delayed',
    }
    return statusMap[status] || 'status-on-time'
  }

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Support both old format and new API format
  const isOldFormat = flight.origin && typeof flight.origin === 'object'

  return (
    <div className="flight-card">
      <div className="flight-header">
        {flight.airlineInfo && (
          <AirlineLogo airlineInfo={flight.airlineInfo} size="small" />
        )}
        <div className="flight-number">
          <div className="flight-code">{flight.flightNumber}</div>
          <div className="flight-airline">
            {flight.airlineName || (isOldFormat ? flight.airline : flight.icao24)}
          </div>
        </div>
      </div>

      <div className="flight-route">
        <div className="flight-location">
          <div className="location-code">
            {isOldFormat ? flight.origin.code : flight.origin}
          </div>
          {/* <div className="location-name">
            {isOldFormat ? flight.origin.city : (flight.aircraftModel || t('common.notAvailable'))}
          </div> */}
        </div>
      </div>

      <div className="flight-info">
        <div className="flight-time">
          {flight.departureTime
            ? formatTime(flight.departureTime)
            : (flight.lastContact
                ? formatTime(new Date(flight.lastContact * 1000))
                : t('common.notAvailable'))}
        </div>
        <div className={`flight-status ${getStatusClass(flight.status)}`}>
          {flight.status}
        </div>
      </div>
    </div>
  )
}

export default FlightCard
