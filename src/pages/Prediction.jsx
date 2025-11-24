import { useState } from 'react'

function Prediction() {
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
        <h1>Prédiction de retard</h1>
        <p>Prédisez le retard potentiel d'un vol avec notre modèle d'IA</p>
      </div>

      <div className="prediction-container">
        <div className="prediction-form-section">
          <h2>Informations du vol</h2>
          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="flightNumber">Numéro de vol</label>
                <input
                  type="text"
                  id="flightNumber"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  placeholder="Ex: AF1234"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="airline">Compagnie aérienne</label>
                <select
                  id="airline"
                  name="airline"
                  value={formData.airline}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez...</option>
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
                <label htmlFor="origin">Aéroport de départ</label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="Ex: CDG (Paris)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="destination">Aéroport d'arrivée</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Ex: JFK (New York)"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="departureTime">Heure de départ</label>
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
                <label htmlFor="distance">Distance (km)</label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder="Ex: 5837"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weatherConditions">Conditions météo</label>
                <select
                  id="weatherConditions"
                  name="weatherConditions"
                  value={formData.weatherConditions}
                  onChange={handleChange}
                  required
                >
                  <option value="clear">Dégagé</option>
                  <option value="cloudy">Nuageux</option>
                  <option value="rain">Pluie</option>
                  <option value="storm">Orage</option>
                  <option value="snow">Neige</option>
                  <option value="fog">Brouillard</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dayOfWeek">Jour de la semaine</label>
                <select
                  id="dayOfWeek"
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez...</option>
                  <option value="monday">Lundi</option>
                  <option value="tuesday">Mardi</option>
                  <option value="wednesday">Mercredi</option>
                  <option value="thursday">Jeudi</option>
                  <option value="friday">Vendredi</option>
                  <option value="saturday">Samedi</option>
                  <option value="sunday">Dimanche</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Analyse en cours...' : 'Prédire le retard'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Réinitialiser
              </button>
            </div>
          </form>
        </div>

        {prediction && (
          <div className="prediction-results">
            <h2>Résultats de la prédiction</h2>

            <div className="result-card main-result">
              <div className="result-header">
                <h3>Prédiction</h3>
                <span className={`result-badge ${prediction.willBeDelayed ? 'delayed' : 'on-time'}`}>
                  {prediction.willBeDelayed ? 'Retard probable' : 'À l\'heure'}
                </span>
              </div>

              <div className="result-metrics">
                <div className="metric">
                  <span className="metric-label">Probabilité de retard</span>
                  <span className="metric-value">{prediction.delayProbability}%</span>
                  <div className="metric-bar">
                    <div
                      className="metric-bar-fill"
                      style={{ width: `${prediction.delayProbability}%` }}
                    ></div>
                  </div>
                </div>

                <div className="metric">
                  <span className="metric-label">Retard estimé</span>
                  <span className="metric-value">{prediction.estimatedDelay} min</span>
                </div>

                <div className="metric">
                  <span className="metric-label">Confiance du modèle</span>
                  <span className="metric-value">{prediction.confidence}%</span>
                </div>
              </div>
            </div>

            <div className="result-card factors-card">
              <h3>Facteurs d'influence</h3>
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
