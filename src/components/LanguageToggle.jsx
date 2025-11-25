import { useLanguage } from '../context/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === 'fr' ? 'English' : 'French'}`}
      title={language === 'fr' ? 'Switch to English' : 'Passer au français'}
    >
      <span className="language-flag">
        {language === 'fr' ? '🇬🇧' : '🇫🇷'}
      </span>
      <span className="language-code">
        {language === 'fr' ? 'EN' : 'FR'}
      </span>
    </button>
  );
};

export default LanguageToggle;
