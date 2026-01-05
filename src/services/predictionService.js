// Service pour l'API de prédictions de retard
// En développement, utilise le proxy Vite configuré dans vite.config.js
// En production, l'URL sera gérée par la configuration Docker/Nginx
const PREDICTION_API_BASE_URL = '/api/predictions';

class PredictionApiClient {
  constructor() {
    this.baseURL = PREDICTION_API_BASE_URL;
    this.headers = {
      'Accept': 'application/json'
      // La clé API est ajoutée automatiquement par le proxy Vite en dev
      // et par Nginx en production
    };
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
      console.error(`Prediction API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async post(endpoint, params = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {})
    ).toString();

    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(fullEndpoint, {
      method: 'POST',
      body: ''
    });
  }
}

const predictionApiClient = new PredictionApiClient();

/**
 * Prédit le retard d'un vol par son callsign
 * @param {string} callsign - Le callsign/ICAO du vol (ex: "AFR1234")
 * @returns {Promise<Object>} Réponse de prédiction avec probabilité et classification
 */
export const predictDelay = async (callsign) => {
  try {
    const response = await predictionApiClient.post('/predictions/delay', { callsign });
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  predictDelay
};
