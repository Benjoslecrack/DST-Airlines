// Support runtime env variables (Docker) et build-time env variables (dev local)
const API_BASE_URL = window.ENV?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;
const API_KEY = window.ENV?.VITE_API_KEY || import.meta.env.VITE_API_KEY;

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      'Accept': 'application/json'
    };

    // Ajouter l'API Key seulement si elle est définie (pour dev local)
    // En production Docker, Nginx ajoute l'API Key via proxy_set_header
    if (API_KEY && API_KEY.trim() !== '') {
      this.headers['X-API-Key'] = API_KEY;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {})
    ).toString();

    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

export const apiClient = new ApiClient();

// ==================== PREDICTIONS API ====================

/**
 * Predict flight delay based on flight features
 * @param {Object} predictionData - Flight prediction request with all features
 * @returns {Promise} Prediction response with delay probability and classification
 */
export const predictDelay = async (predictionData) => {
  return apiClient.post('/predictions/delay', predictionData);
};
