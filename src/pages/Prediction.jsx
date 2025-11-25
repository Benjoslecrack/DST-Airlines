import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Remplacer par l'appel réel à votre API de prédiction
      // const response = await fetch('YOUR_API_ENDPOINT/predict', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // const data = await response.json()

      // Simulation de prédiction
      setTimeout(() => {
        const delayProbability = Math.random()
        const estimatedDelay = Math.floor(Math.random() * 120)

        setPrediction({
          willBeDelayed: delayProbability > 0.5,
          delayProbability: (delayProbability * 100).toFixed(1),
          estimatedDelay: estimatedDelay,
          confidence: (85 + Math.random() * 15).toFixed(1),
          factors: [
            { name: 'Météo', impact: 'Faible', score: 15 },
            { name: 'Trafic aérien', impact: 'Moyen', score: 45 },
            { name: 'Historique de la route', impact: 'Élevé', score: 72 },
            { name: 'Performance de la compagnie', impact: 'Moyen', score: 58 },
          ]
        })
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error('Erreur lors de la prédiction:', error)
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
