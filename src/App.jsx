import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Prediction from './pages/Prediction'
import LiveFlights from './pages/LiveFlights'
import Analytics from './pages/Analytics'
import Creators from './pages/Creators'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="prediction" element={<Prediction />} />
            <Route path="live-flights" element={<LiveFlights />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="creators" element={<Creators />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
