import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { predictionService } from '../services'

function Prediction() {
  const { t } = useTranslation()
  const [callsign, setCallsign] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const data = await predictionService.predictDelay(callsign.trim().toUpperCase())
      setPrediction(data)
    } catch (err) {
      console.error('Erreur lors de la prédiction:', err)
      setError(err.message || t('prediction.error'))
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCallsign('')
    setPrediction(null)
    setError(null)
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
              <label htmlFor="callsign">{t('prediction.callsign', 'Callsign / Indicatif du vol')}</label>
              <input
                type="text"
                id="callsign"
                name="callsign"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                placeholder={t('prediction.callsignPlaceholder', 'Ex: AFR1234, N7653N')}
                required
                disabled={loading}
              />
              <small className="form-help">
                {t('prediction.callsignHelp', 'Entrez l\'indicatif ICAO du vol (ex: AFR1234 pour Air France)')}
              </small>
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span className="alert-message">{error}</span>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? t('prediction.analyzing', 'Analyse en cours...') : t('prediction.predict')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
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
                <div>
                  <h3>{t('prediction.predictionTitle', 'Prédiction')}</h3>
                  <div className="flight-info">
                    <span className="flight-code">{prediction.flight_icao}</span>
                    {prediction.flight_iata && prediction.flight_iata !== prediction.flight_icao && (
                      <span className="flight-code-secondary">({prediction.flight_iata})</span>
                    )}
                  </div>
                </div>
                <span className={`result-badge ${prediction.is_delayed ? 'delayed' : 'on-time'}`}>
                  {prediction.is_delayed
                    ? t('prediction.likelyDelay', 'Retard probable')
                    : t('prediction.onTime', 'À l\'heure')}
                </span>
              </div>

              <div className="result-metrics">
                <div className="metric">
                  <span className="metric-label">{t('prediction.delayProbability')}</span>
                  <span className="metric-value">{(prediction.delay_probability * 100).toFixed(1)}%</span>
                  <div className="metric-bar">
                    <div
                      className="metric-bar-fill"
                      style={{
                        width: `${prediction.delay_probability * 100}%`,
                        backgroundColor: prediction.is_delayed ? '#ef4444' : '#10b981'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="metric">
                  <span className="metric-label">{t('prediction.modelConfidence', 'Confiance du modèle')}</span>
                  <span className="metric-value">{(prediction.confidence * 100).toFixed(1)}%</span>
                  <div className="metric-bar">
                    <div
                      className="metric-bar-fill"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="model-info">
                <span className="model-version">
                  {t('prediction.modelVersion', 'Version du modèle')}: <strong>{prediction.model_version}</strong>
                </span>
              </div>
            </div>

            <div className="result-card info-card">
              <h3>{t('prediction.predictionInfo', 'Informations sur la prédiction')}</h3>
              <ul className="info-list">
                <li>
                  <strong>{t('prediction.whatIsThis', 'Qu\'est-ce que c\'est ?')}</strong>
                  <p>{t('prediction.whatIsThisDesc', 'Cette prédiction utilise un modèle de machine learning entraîné sur des données historiques de vols, météo, trafic aérien et caractéristiques des aéroports.')}</p>
                </li>
                <li>
                  <strong>{t('prediction.howItWorks', 'Comment ça marche ?')}</strong>
                  <p>{t('prediction.howItWorksDesc', 'Le modèle analyse automatiquement les informations du vol, les prévisions météo, l\'historique de retards sur 7 jours et les caractéristiques des aéroports de départ et d\'arrivée.')}</p>
                </li>
                <li>
                  <strong>{t('prediction.dataSource', 'Source des données')}</strong>
                  <p>{t('prediction.dataSourceDesc', 'Les données sont récupérées en temps réel depuis notre base de données incluant les vols planifiés dans les prochaines 24 heures.')}</p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Prediction
