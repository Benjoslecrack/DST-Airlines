import { statesService } from './statesService'
import { airlinesService } from './airlinesService'
import { aircraftsService } from './aircraftsService'

/**
 * Service to enrich flight data by cross-referencing with airlines and aircrafts data
 */
class EnrichmentService {
  constructor() {
    // Cache to avoid redundant API calls
    this.airlinesCache = null
    this.aircraftsCache = null
    this.cacheTimestamp = null
    this.CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid() {
    if (!this.cacheTimestamp) return false
    return Date.now() - this.cacheTimestamp < this.CACHE_DURATION
  }

  /**
   * Load airlines and aircrafts data into cache
   */
  async loadCache() {
    if (this.isCacheValid()) {
      return // Cache is still valid
    }

    try {
      console.log('Loading enrichment cache...')

      // Load all airlines (we'll fetch more if needed with pagination)
      const [airlines, aircrafts] = await Promise.all([
        airlinesService.getAirlines({}, 500, 0),
        aircraftsService.getAircrafts({}, 500, 0)
      ])

      this.airlinesCache = airlines
      this.aircraftsCache = aircrafts
      this.cacheTimestamp = Date.now()

      console.log(`Cache loaded: ${airlines.length} airlines, ${aircrafts.length} aircrafts`)
    } catch (error) {
      console.error('Failed to load enrichment cache:', error)
      // Continue without cache
    }
  }

  /**
   * Find airline by callsign or ICAO/IATA code
   */
  findAirline(callsign, originCountry) {
    if (!this.airlinesCache || !callsign) return null

    const trimmedCallsign = callsign.trim()

    // Try to match by callsign first
    let airline = this.airlinesCache.find(a =>
      a.callsign && a.callsign.toLowerCase() === trimmedCallsign.toLowerCase()
    )

    // If not found, try to extract ICAO code from callsign (first 3 letters)
    if (!airline && trimmedCallsign.length >= 3) {
      const icaoPrefix = trimmedCallsign.substring(0, 3).toUpperCase()
      airline = this.airlinesCache.find(a =>
        a.icao && a.icao.toUpperCase() === icaoPrefix
      )
    }

    // If still not found, try to match by country
    if (!airline && originCountry) {
      airline = this.airlinesCache.find(a =>
        a.country && a.country.toLowerCase() === originCountry.toLowerCase()
      )
    }

    return airline
  }

  /**
   * Find aircraft by ICAO24 code
   */
  findAircraft(icao24) {
    if (!this.aircraftsCache || !icao24) return null

    // The ICAO24 code is unique to each aircraft, but our aircrafts table
    // contains aircraft types, not individual aircraft
    // We need to extract the type code from ICAO24 (not straightforward)

    // For now, we'll try to match by ICAO code if available
    const aircraft = this.aircraftsCache.find(a =>
      a.icao_code && icao24.toLowerCase().startsWith(a.icao_code.toLowerCase())
    )

    return aircraft
  }

  /**
   * Enrich a single flight state with airline and aircraft data
   */
  enrichFlightData(state) {
    const baseData = statesService.transformToFlightFormat(state)

    // Find airline information
    const airline = this.findAirline(state.callsign, state.origin_country)

    // Find aircraft information
    const aircraft = this.findAircraft(state.icao24)

    // Enrich the flight data
    return {
      ...baseData,
      // Airline enrichment
      airlineInfo: airline ? {
        name: airline.airline,
        iata: airline.iata,
        icao: airline.icao,
        callsign: airline.callsign,
        country: airline.country,
        comments: airline.comments
      } : null,

      // Aircraft enrichment
      aircraftInfo: aircraft ? {
        model: aircraft.model,
        manufacturer: aircraft.manufacturer,
        type: aircraft.type,
        wingType: aircraft.wing_type,
        icaoCode: aircraft.icao_code,
        iataCode: aircraft.iata_code
      } : null,

      // Enhanced display fields
      airlineName: airline ? airline.airline : baseData.origin,
      aircraftModel: aircraft ? `${aircraft.manufacturer} ${aircraft.model}` : null,
      aircraftType: aircraft ? aircraft.type : null
    }
  }

  /**
   * Get enriched flights data
   */
  async getEnrichedFlights(limit = 100) {
    // Load cache if needed
    await this.loadCache()

    // Fetch flight states
    const states = await statesService.getAllFlights(limit)

    // Filter valid flights and enrich them
    const enrichedFlights = states
      .filter(state => state.latitude && state.longitude)
      .map(state => this.enrichFlightData(state))

    return enrichedFlights
  }

  /**
   * Clear the cache (useful for testing or manual refresh)
   */
  clearCache() {
    this.airlinesCache = null
    this.aircraftsCache = null
    this.cacheTimestamp = null
  }
}

// Export singleton instance
export const enrichmentService = new EnrichmentService()
