import { apiClient } from './api';

export const healthService = {
  /**
   * Health check endpoint
   * @returns {Promise<string>} Health status message
   */
  async checkHealth() {
    return await apiClient.get('/health/');
  }
};
