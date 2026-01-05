import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '../ThemeToggle'
import LanguageToggle from '../LanguageToggle'
import ColorblindToggle from '../ColorblindToggle'

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()

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

      <div className="navbar-actions">
        {/* Language Toggle */}
        <LanguageToggle />

        {/* Colorblind Mode Toggle */}
        <ColorblindToggle />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Burger Button */}
        <button
          className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label={t('common.menu')}
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
            {t('nav.dashboard')}
          </Link>
        </li>
        <li>
          <Link to="/prediction" className={isActive('/prediction')} onClick={closeMenu}>
            <span className="nav-icon">🔮</span>
            {t('nav.prediction')}
          </Link>
        </li>
        <li>
          <Link to="/live-flights" className={isActive('/live-flights')} onClick={closeMenu}>
            <span className="nav-icon">🗺️</span>
            {t('nav.liveFlights')}
          </Link>
        </li>
        <li>
          <Link to="/analytics" className={isActive('/analytics')} onClick={closeMenu}>
            <span className="nav-icon">📈</span>
            {t('nav.analytics')}
          </Link>
        </li>
        <li>
          <Link to="/creators" className={isActive('/creators')} onClick={closeMenu}>
            <span className="nav-icon">👥</span>
            {t('nav.creators')}
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
