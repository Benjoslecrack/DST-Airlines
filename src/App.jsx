import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Prediction from './pages/Prediction'
import LiveFlights from './pages/LiveFlights'
import Creators from './pages/Creators'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="live-flights" element={<LiveFlights />} />
          <Route path="creators" element={<Creators />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
