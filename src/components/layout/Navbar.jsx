import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <span className="navbar-icon">✈️</span>
        <h1>DST Airlines</h1>
      </Link>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={isActive('/')}>
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/prediction" className={isActive('/prediction')}>
            <span className="nav-icon">🔮</span>
            Prédiction
          </Link>
        </li>
        <li>
          <Link to="/live-flights" className={isActive('/live-flights')}>
            <span className="nav-icon">🗺️</span>
            Vols en direct
          </Link>
        </li>
        <li>
          <Link to="/analytics" className={isActive('/analytics')}>
            <span className="nav-icon">📈</span>
            Analytics
          </Link>
        </li>
        <li>
          <Link to="/creators" className={isActive('/creators')}>
            <span className="nav-icon">👥</span>
            Créateurs
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
