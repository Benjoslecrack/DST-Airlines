import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <button
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={t('language.ariaLabel')}
      title={language === 'fr' ? t('language.switchToEnglish') : t('language.switchToFrench')}
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
