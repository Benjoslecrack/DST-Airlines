import { useState } from 'react'
import { getAirlineLogoWithFallback } from '../utils/airlineLogos'

function AirlineLogo({ airlineInfo, size = 'medium', showName = false }) {
  const logoData = getAirlineLogoWithFallback(airlineInfo)
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    small: 'airline-logo-small',
    medium: 'airline-logo-medium',
    large: 'airline-logo-large'
  }

  const handleImageError = () => {
    // Try next fallback URL
    if (logoData.fallbacks && currentUrlIndex < logoData.fallbacks.length) {
      setCurrentUrlIndex(currentUrlIndex + 1)
      setImageError(false)
    } else {
      setImageError(true)
    }
  }

  const getCurrentUrl = () => {
    if (currentUrlIndex === 0) {
      return logoData.url
    }
    return logoData.fallbacks[currentUrlIndex - 1]
  }

  return (
    <div className={`airline-logo-container ${sizeClasses[size]}`}>
      <div className="airline-logo-wrapper">
        <img
          src={getCurrentUrl()}
          alt={logoData.alt}
          className="airline-logo-img"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      {showName && airlineInfo && (
        <div className="airline-logo-name">
          <span className="airline-name">{airlineInfo.name}</span>
          {airlineInfo.iata && (
            <span className="airline-code">{airlineInfo.iata}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default AirlineLogo
