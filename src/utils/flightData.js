// Sample airports data
const airports = [
  { code: 'CDG', city: 'Paris' },
  { code: 'LHR', city: 'London' },
  { code: 'JFK', city: 'New York' },
  { code: 'DXB', city: 'Dubai' },
  { code: 'NRT', city: 'Tokyo' },
  { code: 'SIN', city: 'Singapore' },
  { code: 'LAX', city: 'Los Angeles' },
  { code: 'FRA', city: 'Frankfurt' },
  { code: 'AMS', city: 'Amsterdam' },
  { code: 'MAD', city: 'Madrid' },
  { code: 'BCN', city: 'Barcelona' },
  { code: 'FCO', city: 'Rome' },
  { code: 'SYD', city: 'Sydney' },
  { code: 'HKG', city: 'Hong Kong' },
  { code: 'ICN', city: 'Seoul' },
]

const airlines = [
  'DST Airlines',
  'Air France',
  'British Airways',
  'Emirates',
  'Lufthansa',
  'Singapore Airlines',
  'Qatar Airways',
]

const statuses = ['On Time', 'Delayed', 'Boarding', 'Departed']

// Generate a random flight
function generateFlight(id) {
  const origin = airports[Math.floor(Math.random() * airports.length)]
  let destination = airports[Math.floor(Math.random() * airports.length)]

  // Ensure origin and destination are different
  while (destination.code === origin.code) {
    destination = airports[Math.floor(Math.random() * airports.length)]
  }

  const airline = airlines[Math.floor(Math.random() * airlines.length)]
  const flightNumber = `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000 + 1000)}`

  // Generate a departure time within the next 12 hours
  const now = new Date()
  const departureTime = new Date(now.getTime() + Math.random() * 12 * 60 * 60 * 1000)

  const status = statuses[Math.floor(Math.random() * statuses.length)]

  return {
    id,
    flightNumber,
    airline,
    origin,
    destination,
    departureTime: departureTime.toISOString(),
    status,
  }
}

// Generate multiple flights
export function generateFlights(count) {
  const flights = []
  for (let i = 0; i < count; i++) {
    flights.push(generateFlight(i + 1))
  }
  // Sort by departure time
  return flights.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime))
}

// Randomly update flight statuses to simulate real-time changes
export function updateFlightStatuses(flights) {
  return flights.map(flight => {
    // 20% chance to update status
    if (Math.random() < 0.2) {
      const currentStatusIndex = statuses.indexOf(flight.status)

      // Status progression logic
      if (flight.status === 'On Time' || flight.status === 'Delayed') {
        // Can move to Boarding
        if (Math.random() < 0.5) {
          return { ...flight, status: 'Boarding' }
        }
      } else if (flight.status === 'Boarding') {
        // Can move to Departed
        if (Math.random() < 0.7) {
          return { ...flight, status: 'Departed' }
        }
      }

      // Random status change
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
      return { ...flight, status: newStatus }
    }
    return flight
  })
}
