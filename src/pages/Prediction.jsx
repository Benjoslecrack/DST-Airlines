import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { predictDelay } from '../services/api'

function Prediction() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: '',
    origin: '',
    destination: '',
    departureTime: '',
    distance: '',
    weatherConditions: 'clear',
    dayOfWeek: '',
  })

  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Mapper les données du formulaire vers le format de l'API
  const mapFormDataToApiRequest = (formData) => {
    // L'API nécessite uniquement le callsign (flight_iata)
    return {
      flight_iata: formData.flightNumber
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mapper les données du formulaire vers le format de l'API
      const apiRequest = mapFormDataToApiRequest(formData)

      // Appel à l'API de prédiction
      const response = await predictDelay(apiRequest)

      // Adapter la réponse de l'API pour l'affichage
      setPrediction({
        willBeDelayed: response.is_delayed,
        delayProbability: (response.delay_probability * 100).toFixed(1),
        estimatedDelay: response.is_delayed ? Math.floor(response.delay_probability * 90) : 0, // Estimation
        confidence: (response.confidence * 100).toFixed(1),
        modelVersion: response.model_version,
        factors: [
          {
            name: t('prediction.factorWeather', 'Météo'),
            impact: formData.weatherConditions === 'clear' ? t('prediction.impactLow', 'Faible') : t('prediction.impactHigh', 'Élevé'),
            score: formData.weatherConditions === 'clear' ? 15 : 75
          },
          {
            name: t('prediction.factorTraffic', 'Trafic aérien'),
            impact: t('prediction.impactMedium', 'Moyen'),
            score: 45
          },
          {
            name: t('prediction.factorRoute', 'Historique de la route'),
            impact: t('prediction.impactHigh', 'Élevé'),
            score: Math.floor(response.delay_probability * 100)
          },
          {
            name: t('prediction.factorAirline', 'Performance de la compagnie'),
            impact: t('prediction.impactMedium', 'Moyen'),
            score: 58
          },
        ]
      })
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la prédiction:', error)
      alert(t('prediction.errorMessage', 'Une erreur est survenue lors de la prédiction. Veuillez réessayer.'))
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      flightNumber: '',
      airline: '',
      origin: '',
      destination: '',
      departureTime: '',
      distance: '',
      weatherConditions: 'clear',
      dayOfWeek: '',
    })
    setPrediction(null)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('prediction.title')}</h1>
        <p>{t('prediction.subtitle')}</p>
      </div>

      <div className="prediction-container">
        <div className="prediction-form-section">
          <h2>{t('prediction.flightInfo', 'Informations du vol')}</h2>
          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="flightNumber">{t('prediction.flightNumber')}</label>
                <input
                  type="text"
                  id="flightNumber"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  placeholder={t('prediction.flightNumberPlaceholder')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="airline">{t('prediction.airline')}</label>
                <select
                  id="airline"
                  name="airline"
                  value={formData.airline}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('prediction.select', 'Sélectionnez...')}</option>
                  <option value="air-france">Air France</option>
                  <option value="emirates">Emirates</option>
                  <option value="lufthansa">Lufthansa</option>
                  <option value="british-airways">British Airways</option>
                  <option value="qatar-airways">Qatar Airways</option>
                  <option value="singapore-airlines">Singapore Airlines</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="origin">{t('prediction.departureAirport')}</label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder={t('prediction.departureAirportPlaceholder')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="destination">{t('prediction.arrivalAirport')}</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder={t('prediction.arrivalAirportPlaceholder')}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="departureTime">{t('prediction.departureTime')}</label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="distance">{t('prediction.distance', 'Distance (km)')}</label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder={t('prediction.distancePlaceholder', 'Ex: 5837')}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weatherConditions">{t('prediction.weather')}</label>
                <select
                  id="weatherConditions"
                  name="weatherConditions"
                  value={formData.weatherConditions}
                  onChange={handleChange}
                  required
                >
                  <option value="clear">{t('prediction.weatherClear')}</option>
                  <option value="cloudy">{t('prediction.weatherCloudy')}</option>
                  <option value="rain">{t('prediction.weatherRain')}</option>
                  <option value="storm">{t('prediction.weatherStorm')}</option>
                  <option value="snow">{t('prediction.weatherSnow')}</option>
                  <option value="fog">{t('prediction.weatherFog')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dayOfWeek">{t('prediction.dayOfWeek')}</label>
                <select
                  id="dayOfWeek"
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('prediction.select', 'Sélectionnez...')}</option>
                  <option value="monday">{t('prediction.monday')}</option>
                  <option value="tuesday">{t('prediction.tuesday')}</option>
                  <option value="wednesday">{t('prediction.wednesday')}</option>
                  <option value="thursday">{t('prediction.thursday')}</option>
                  <option value="friday">{t('prediction.friday')}</option>
                  <option value="saturday">{t('prediction.saturday')}</option>
                  <option value="sunday">{t('prediction.sunday')}</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? t('prediction.analyzing', 'Analyse en cours...') : t('prediction.predict')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                {t('prediction.reset')}
              </button>
            </div>
          </form>
        </div>

        {prediction && (
          <div className="prediction-results">
            <h2>{t('prediction.results')}</h2>

            <div className="result-card main-result">
              <div className="result-header">
                <h3>{t('prediction.predictionTitle', 'Prédiction')}</h3>
                <span className={`result-badge ${prediction.willBeDelayed ? 'delayed' : 'on-time'}`}>
                  {prediction.willBeDelayed ? t('prediction.likelyDelay', 'Retard probable') : t('prediction.onTime', 'À l\'heure')}
                </span>
              </div>
              {prediction.modelVersion && (
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  {t('prediction.modelVersion', 'Version du modèle')}: {prediction.modelVersion}
                </div>
              )}

              <div className="result-metrics">
                <div className="metric">
                  <span className="metric-label">{t('prediction.delayProbability')}</span>
                  <span className="metric-value">{prediction.delayProbability}%</span>
                  <div className="metric-bar">
                    <div
                      className="metric-bar-fill"
                      style={{ width: `${prediction.delayProbability}%` }}
                    ></div>
                  </div>
                </div>

                <div className="metric">
                  <span className="metric-label">{t('prediction.estimatedDelay')}</span>
                  <span className="metric-value">{prediction.estimatedDelay} {t('prediction.minutes')}</span>
                </div>

                <div className="metric">
                  <span className="metric-label">{t('prediction.modelConfidence', 'Confiance du modèle')}</span>
                  <span className="metric-value">{prediction.confidence}%</span>
                </div>
              </div>
            </div>

            <div className="result-card factors-card">
              <h3>{t('prediction.influenceFactors', 'Facteurs d\'influence')}</h3>
              <div className="factors-list">
                {prediction.factors.map((factor, index) => (
                  <div key={index} className="factor-item">
                    <div className="factor-info">
                      <span className="factor-name">{factor.name}</span>
                      <span className={`factor-impact impact-${factor.impact.toLowerCase()}`}>
                        {factor.impact}
                      </span>
                    </div>
                    <div className="factor-score">
                      <div className="factor-bar">
                        <div
                          className="factor-bar-fill"
                          style={{ width: `${factor.score}%` }}
                        ></div>
                      </div>
                      <span className="factor-value">{factor.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Prediction
