import { useLanguage } from '../contexts/LanguageContext.js';
import { translations } from '../translations/index.js';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key) => {
    const translation = translations[currentLanguage];
    if (!translation) {
      console.warn(`Translation not found for language: ${currentLanguage}`);
      return key;
    }
    
    const value = translation[key];
    if (!value) {
      console.warn(`Translation key not found: ${key} for language: ${currentLanguage}`);
      return key;
    }
    
    return value;
  };
  
  return {
    t,
    currentLanguage,
    translations: translations[currentLanguage] || {}
  };
};
