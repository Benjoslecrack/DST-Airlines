// Coordonnées des aéroports principaux [latitude, longitude]
const airportCoordinates = {
  'CDG': [49.0097, 2.5479],    // Paris Charles de Gaulle
  'LHR': [51.4700, -0.4543],   // London Heathrow
  'JFK': [40.6413, -73.7781],  // New York JFK
  'DXB': [25.2532, 55.3657],   // Dubai
  'NRT': [35.7720, 140.3929],  // Tokyo Narita
  'SIN': [1.3644, 103.9915],   // Singapore Changi
  'LAX': [33.9416, -118.4085], // Los Angeles
  'FRA': [50.0379, 8.5622],    // Frankfurt
  'AMS': [52.3105, 4.7683],    // Amsterdam Schiphol
  'MAD': [40.4983, -3.5676],   // Madrid Barajas
  'BCN': [41.2974, 2.0833],    // Barcelona
  'FCO': [41.8003, 12.2389],   // Rome Fiumicino
  'SYD': [-33.9399, 151.1753], // Sydney
  'HKG': [22.3080, 113.9185],  // Hong Kong
  'ICN': [37.4602, 126.4407],  // Seoul Incheon
}

export function getAirportCoordinates(airportCode) {
  return airportCoordinates[airportCode] || [48.8566, 2.3522] // Default: Paris
}

export function calculateMidpoint(coord1, coord2) {
  return [
    (coord1[0] + coord2[0]) / 2,
    (coord1[1] + coord2[1]) / 2
  ]
}

export function calculateDistance(coord1, coord2) {
  const R = 6371 // Rayon de la Terre en km
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
