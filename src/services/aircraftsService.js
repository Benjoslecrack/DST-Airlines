import { apiClient } from './api';

export const aircraftsService = {
  /**
   * Get aircrafts with optional filters
   * @param {Object} filters - Optional filters (model, manufacturer, wing_type, aircraft_type, icao_code, iata_code)
   * @param {number} limit - Maximum number of results (default: 50, max: 500)
   * @param {number} offset - Pagination offset (default: 0)
   * @returns {Promise<Array>} List of aircrafts
   */
  async getAircrafts(filters = {}, limit = 50, offset = 0) {
    const params = {
      ...filters,
      limit,
      offset
    };

    return await apiClient.get('/aircrafts/', params);
  },

  /**
   * Get a specific aircraft by ICAO code
   * @param {string} icaoCode - ICAO code of the aircraft
   * @returns {Promise<Array>} List of matching aircrafts
   */
  async getByIcaoCode(icaoCode) {
    return await this.getAircrafts({ icao_code: icaoCode });
  },

  /**
   * Get aircrafts by manufacturer
   * @param {string} manufacturer - Manufacturer name
   * @returns {Promise<Array>} List of matching aircrafts
   */
  async getByManufacturer(manufacturer) {
    return await this.getAircrafts({ manufacturer });
  }
};
