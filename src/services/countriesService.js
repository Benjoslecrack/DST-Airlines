import { apiClient } from './api';

export const countriesService = {
  /**
   * Get countries with optional filters
   * @param {Object} filters - Optional filters (name, continent)
   * @param {number} limit - Maximum number of results (default: 50, max: 500)
   * @param {number} offset - Pagination offset (default: 0)
   * @returns {Promise<Array>} List of countries
   */
  async getCountries(filters = {}, limit = 50, offset = 0) {
    const params = {
      ...filters,
      limit,
      offset
    };

    return await apiClient.get('/countries/', params);
  },

  /**
   * Search countries by name
   * @param {string} name - Country name
   * @returns {Promise<Array>} List of matching countries
   */
  async searchByName(name) {
    return await this.getCountries({ name });
  },

  /**
   * Get countries by continent
   * @param {string} continent - Continent code (2 letters)
   * @returns {Promise<Array>} List of countries in the continent
   */
  async getByContinent(continent) {
    return await this.getCountries({ continent });
  }
};
