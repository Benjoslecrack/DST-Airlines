import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import ThemeToggle from '../ThemeToggle'

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <span className="navbar-icon">✈️</span>
        <h1>DST Airlines</h1>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Burger Button */}
        <button
          className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>
      </div>

      {/* Navigation Links */}
      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" className={isActive('/')} onClick={closeMenu}>
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/prediction" className={isActive('/prediction')} onClick={closeMenu}>
            <span className="nav-icon">🔮</span>
            Prédiction
          </Link>
        </li>
        <li>
          <Link to="/live-flights" className={isActive('/live-flights')} onClick={closeMenu}>
            <span className="nav-icon">🗺️</span>
            Vols en direct
          </Link>
        </li>
        <li>
          <Link to="/analytics" className={isActive('/analytics')} onClick={closeMenu}>
            <span className="nav-icon">📈</span>
            Analytics
          </Link>
        </li>
        <li>
          <Link to="/creators" className={isActive('/creators')} onClick={closeMenu}>
            <span className="nav-icon">👥</span>
            Créateurs
          </Link>
        </li>
      </ul>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
    </nav>
  )
}

export default Navbar
