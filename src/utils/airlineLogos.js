/**
 * Utility functions for airline logos
 */

/**
 * Get airline logo URL from IATA code
 * Uses multiple fallback sources for better coverage
 * @param {string} iataCode - Airline IATA code (e.g., "AF", "BA", "LH")
 * @param {string} icaoCode - Airline ICAO code (e.g., "AFR", "BAW", "DLH")
 * @returns {string} URL to airline logo
 */
export const getAirlineLogo = (iataCode, icaoCode) => {
  if (!iataCode && !icaoCode) {
    return getDefaultAirlineLogo()
  }

  const code = iataCode || icaoCode

  // Primary source: Aviation-related CDNs
  // These are common sources for airline logos
  return `https://images.kiwi.com/airlines/64/${code}.png`
}

/**
 * Get airline logo with fallback handling
 * Returns a component-friendly object with URL and error handling
 * @param {Object} airlineInfo - Airline information from enrichment
 * @returns {Object} { url, alt, onError }
 */
export const getAirlineLogoWithFallback = (airlineInfo) => {
  if (!airlineInfo) {
    return {
      url: getDefaultAirlineLogo(),
      alt: 'Airline',
      iata: null
    }
  }

  const primaryUrl = getAirlineLogo(airlineInfo.iata, airlineInfo.icao)

  return {
    url: primaryUrl,
    alt: airlineInfo.name || 'Airline',
    iata: airlineInfo.iata,
    // Fallback sources to try if primary fails
    fallbacks: [
      `https://pics.avs.io/200/200/${airlineInfo.iata}.png`,
      `https://content.airhex.com/content/logos/airlines_${airlineInfo.iata}_200_200_s.png`,
      getDefaultAirlineLogo()
    ]
  }
}

/**
 * Get default/placeholder airline logo
 * @returns {string} Data URI for a simple plane icon
 */
export const getDefaultAirlineLogo = () => {
  // SVG placeholder with a simple plane icon
  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <circle cx="32" cy="32" r="30" fill="#3b82f6" opacity="0.1"/>
      <path d="M45 30l-8-8-5 5v-10c0-1.1-.9-2-2-2s-2 .9-2 2v10l-5-5-8 8 13 5v9l-4 2v3l6-2 6 2v-3l-4-2v-9l13-5z" fill="#3b82f6"/>
    </svg>
  `)}`
}

/**
 * Get country flag emoji from country name
 * @param {string} country - Country name
 * @returns {string} Flag emoji or empty string
 */
export const getCountryFlag = (country) => {
  const countryFlags = {
    'France': '🇫🇷',
    'United Kingdom': '🇬🇧',
    'Germany': '🇩🇪',
    'United States': '🇺🇸',
    'Canada': '🇨🇦',
    'Spain': '🇪🇸',
    'Italy': '🇮🇹',
    'Netherlands': '🇳🇱',
    'Belgium': '🇧🇪',
    'Switzerland': '🇨🇭',
    'Austria': '🇦🇹',
    'Portugal': '🇵🇹',
    'Japan': '🇯🇵',
    'China': '🇨🇳',
    'South Korea': '🇰🇷',
    'Australia': '🇦🇺',
    'Brazil': '🇧🇷',
    'Mexico': '🇲🇽',
    'India': '🇮🇳',
    'Turkey': '🇹🇷',
    'United Arab Emirates': '🇦🇪',
    'Qatar': '🇶🇦',
    'Saudi Arabia': '🇸🇦',
    'Singapore': '🇸🇬',
    'Thailand': '🇹🇭',
    'Malaysia': '🇲🇾',
    'Indonesia': '🇮🇩',
    'Russia': '🇷🇺',
    'Poland': '🇵🇱',
    'Sweden': '🇸🇪',
    'Norway': '🇳🇴',
    'Denmark': '🇩🇰',
    'Finland': '🇫🇮',
    'Ireland': '🇮🇪',
    'Greece': '🇬🇷',
    'Czech Republic': '🇨🇿',
    'Hungary': '🇭🇺',
    'Romania': '🇷🇴',
    'Bulgaria': '🇧🇬',
    'Croatia': '🇭🇷',
    'Israel': '🇮🇱',
    'Egypt': '🇪🇬',
    'South Africa': '🇿🇦',
    'New Zealand': '🇳🇿',
    'Argentina': '🇦🇷',
    'Chile': '🇨🇱',
    'Colombia': '🇨🇴',
    'Peru': '🇵🇪'
  }

  return countryFlags[country] || '🌍'
}
