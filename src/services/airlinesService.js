import { apiClient } from './api';

export const airlinesService = {
  /**
   * Get airlines with optional filters
   * @param {Object} filters - Optional filters (iata, icao, airline, callsign, country)
   * @param {number} limit - Maximum number of results (default: 50, max: 500)
   * @param {number} offset - Pagination offset (default: 0)
   * @returns {Promise<Array>} List of airlines
   */
  async getAirlines(filters = {}, limit = 50, offset = 0) {
    const params = {
      ...filters,
      limit,
      offset
    };

    return await apiClient.get('/airlines/', params);
  },

  /**
   * Get a specific airline by IATA code
   * @param {string} iataCode - IATA code of the airline
   * @returns {Promise<Array>} List of matching airlines
   */
  async getByIataCode(iataCode) {
    return await this.getAirlines({ iata: iataCode });
  },

  /**
   * Get airlines by country
   * @param {string} country - Country name
   * @returns {Promise<Array>} List of airlines in the country
   */
  async getByCountry(country) {
    return await this.getAirlines({ country });
  },

  /**
   * Search airlines by name
   * @param {string} name - Airline name
   * @returns {Promise<Array>} List of matching airlines
   */
  async searchByName(name) {
    return await this.getAirlines({ airline: name });
  }
};
