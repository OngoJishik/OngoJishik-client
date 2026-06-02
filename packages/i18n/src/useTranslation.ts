import { useCallback } from 'react';
import { useTranslation as useReactTranslation } from 'react-i18next';

export function useTranslation() {
  const { t, i18n } = useReactTranslation();
  
  const changeLanguage = useCallback(async (lng: 'ko' | 'en' | 'ja' | 'zh') => {
    if (i18n.language !== lng) {
      await i18n.changeLanguage(lng);
    }
  }, [i18n]);
  
  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language as 'ko' | 'en' | 'ja' | 'zh',
  };
}

