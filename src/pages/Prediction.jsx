import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { predictDelay } from '../services/api'

function Prediction() {
  const { t } = useTranslation()
  const [flightNumber, setFlightNumber] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Appel à l'API de prédiction avec uniquement le callsign
      const response = await predictDelay({ flight_iata: flightNumber })

      // Adapter la réponse de l'API pour l'affichage
      setPrediction({
        willBeDelayed: response.is_delayed,
        delayProbability: (response.delay_probability * 100).toFixed(1),
        estimatedDelay: response.is_delayed ? Math.floor(response.delay_probability * 90) : 0,
        confidence: (response.confidence * 100).toFixed(1),
        modelVersion: response.model_version
      })
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la prédiction:', error)
      alert(t('prediction.errorMessage', 'Une erreur est survenue lors de la prédiction. Veuillez réessayer.'))
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFlightNumber('')
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
            <div className="form-group">
              <label htmlFor="flightNumber">{t('prediction.flightNumber')}</label>
              <input
                type="text"
                id="flightNumber"
                name="flightNumber"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder={t('prediction.flightNumberPlaceholder')}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading || !flightNumber}>
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

                {prediction.estimatedDelay > 0 && (
                  <div className="metric">
                    <span className="metric-label">{t('prediction.estimatedDelay')}</span>
                    <span className="metric-value">{prediction.estimatedDelay} {t('prediction.minutes')}</span>
                  </div>
                )}

                <div className="metric">
                  <span className="metric-label">{t('prediction.modelConfidence', 'Confiance du modèle')}</span>
                  <span className="metric-value">{prediction.confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Prediction
