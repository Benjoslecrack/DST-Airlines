import { useState, useRef, useEffect } from 'react';
import { useColorblind } from '../context/ColorblindContext';
import { useTranslation } from 'react-i18next';
import './ColorblindToggle.css';

const ColorblindToggle = () => {
  const { colorblindMode, setMode } = useColorblind();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const modes = [
    { id: 'normal', label: t('colorblind.normal') },
    { id: 'protanopia', label: t('colorblind.protanopia') },
    { id: 'deuteranopia', label: t('colorblind.deuteranopia') },
    { id: 'tritanopia', label: t('colorblind.tritanopia') },
  ];

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleModeChange = (mode) => {
    setMode(mode);
    setIsOpen(false);
  };

  const getCurrentModeLabel = () => {
    const currentMode = modes.find(m => m.id === colorblindMode);
    return currentMode ? currentMode.label : modes[0].label;
  };

  return (
    <div className="colorblind-toggle" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="colorblind-button"
        aria-label={t('colorblind.ariaLabel')}
        title={t('colorblind.title')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span className="colorblind-current-mode">{getCurrentModeLabel()}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="colorblind-dropdown">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`colorblind-option ${colorblindMode === mode.id ? 'active' : ''}`}
            >
              {mode.label}
              {colorblindMode === mode.id && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorblindToggle;
