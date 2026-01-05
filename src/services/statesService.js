import { apiClient } from './api';

export const statesService = {
  /**
   * Get flight states with optional filters
   * @param {Object} filters - Optional filters (icao24, origin_country, callsign, airline)
   * @param {number} limit - Maximum number of results (default: 50, max: 500)
   * @param {number} offset - Pagination offset (default: 0)
   * @returns {Promise<Array>} List of flight states
   */
  async getStates(filters = {}, limit = 50, offset = 0) {
    const params = {
      ...filters,
      limit,
      offset
    };

    return await apiClient.get('/states/', params);
  },

  /**
   * Get all active flights
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} List of active flight states
   */
  async getAllFlights(limit = 500) {
    return await this.getStates({}, limit, 0);
  },

  /**
   * Get flight by ICAO24 transponder address
   * @param {string} icao24 - ICAO24 transponder address (6 characters)
   * @returns {Promise<Array>} List of matching flight states
   */
  async getByIcao24(icao24) {
    return await this.getStates({ icao24 });
  },

  /**
   * Get flights by origin country
   * @param {string} country - Origin country name
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} List of flight states from the country
   */
  async getByCountry(country, limit = 50) {
    return await this.getStates({ origin_country: country }, limit);
  },

  /**
   * Get flights by airline
   * @param {string} airline - Airline name
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} List of flight states for the airline
   */
  async getByAirline(airline, limit = 50) {
    return await this.getStates({ airline }, limit);
  },

  /**
   * Get flight by callsign
   * @param {string} callsign - Flight callsign
   * @returns {Promise<Array>} List of matching flight states
   */
  async getByCallsign(callsign) {
    return await this.getStates({ callsign });
  },

  /**
   * Get flight track of an aircraft based on its callsign
   * @param {string} callsign - Flight callsign (3-10 characters)
   * @returns {Promise<Array>} Flight track data with airport information
   */
  async getFlightTrack(callsign) {
    if (!callsign || callsign.length < 3 || callsign.length > 10) {
      throw new Error('Callsign must be between 3 and 10 characters');
    }
    return await apiClient.get('/states/track/', { callsign });
  },

  /**
   * Transform API state data to internal flight format
   * @param {Object} state - Raw state data from API
   * @returns {Object} Transformed flight data
   */
  transformToFlightFormat(state) {
    // Map status based on on_ground and velocity
    let status = 'In Flight';
    if (state.on_ground === 1) {
      status = 'On Ground';
    } else if (state.velocity > 0) {
      status = 'In Flight';
    }

    return {
      id: state.id,
      icao24: state.icao24,
      flightNumber: state.callsign?.trim() || 'N/A',
      callsign: state.callsign,
      airline: state.origin_country, // Using origin_country as airline proxy
      origin: state.origin_country,
      destination: 'N/A', // Not provided by API
      latitude: state.latitude,
      longitude: state.longitude,
      altitude: state.baro_altitude || state.geo_altitude,
      velocity: state.velocity,
      heading: state.true_track,
      verticalRate: state.vertical_rate,
      status: status,
      onGround: state.on_ground === 1,
      lastContact: state.last_contact,
      timePosition: state.time_position,
      squawk: state.squawk,
      category: state.category
    };
  }
};
