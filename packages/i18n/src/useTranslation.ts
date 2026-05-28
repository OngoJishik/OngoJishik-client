import { useTranslation as useReactTranslation } from 'react-i18next';

export function useTranslation() {
  const { t, i18n } = useReactTranslation();
  
  const changeLanguage = async (lng: 'ko' | 'en' | 'ja' | 'zh') => {
    await i18n.changeLanguage(lng);
  };
  
  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language as 'ko' | 'en' | 'ja' | 'zh',
  };
}
