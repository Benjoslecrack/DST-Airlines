import { createContext, useContext, useState, useEffect } from 'react';

const ColorblindContext = createContext();

export const useColorblind = () => {
  const context = useContext(ColorblindContext);
  if (!context) {
    throw new Error('useColorblind must be used within a ColorblindProvider');
  }
  return context;
};

export const ColorblindProvider = ({ children }) => {
  const [colorblindMode, setColorblindMode] = useState(() => {
    // Récupérer le mode depuis localStorage ou utiliser 'normal' par défaut
    const savedMode = localStorage.getItem('dst-airlines-colorblind-mode');
    return savedMode || 'normal';
  });

  useEffect(() => {
    // Appliquer le mode daltonien au body
    document.body.setAttribute('data-colorblind', colorblindMode);
    // Sauvegarder dans localStorage
    localStorage.setItem('dst-airlines-colorblind-mode', colorblindMode);
  }, [colorblindMode]);

  const setMode = (mode) => {
    setColorblindMode(mode);
  };

  const value = {
    colorblindMode,
    setMode,
    isNormal: colorblindMode === 'normal',
    isProtanopia: colorblindMode === 'protanopia',
    isDeuteranopia: colorblindMode === 'deuteranopia',
    isTritanopia: colorblindMode === 'tritanopia',
  };

  return (
    <ColorblindContext.Provider value={value}>
      {children}
    </ColorblindContext.Provider>
  );
};
