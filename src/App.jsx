import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Prediction from './pages/Prediction'
import LiveFlights from './pages/LiveFlights'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="live-flights" element={<LiveFlights />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
