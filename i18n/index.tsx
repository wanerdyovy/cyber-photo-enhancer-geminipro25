import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// The translations object will be populated dynamically.
const translations: Record<string, any> = {};

type I18nContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const getNestedTranslation = (obj: any, key: string) => {
  return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [en, ko, ja, zhCN, zhTW] = await Promise.all([
          fetch('/i18n/locales/en.json').then(res => res.json()),
          fetch('/i18n/locales/ko.json').then(res => res.json()),
          fetch('/i18n/locales/ja.json').then(res => res.json()),
          fetch('/i18n/locales/zh-CN.json').then(res => res.json()),
          fetch('/i18n/locales/zh-TW.json').then(res => res.json()),
        ]);
        
        translations.en = en;
        translations.ko = ko;
        translations.ja = ja;
        translations['zh-CN'] = zhCN;
        translations['zh-TW'] = zhTW;
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load translation files:', error);
      }
    };

    fetchTranslations();
  }, []);

  const getInitialLocale = () => {
    const browserLang = navigator.language;
    if (browserLang.startsWith('ko')) return 'ko';
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang === 'zh-CN') return 'zh-CN';
    if (browserLang.startsWith('zh')) return 'zh-TW';
    return 'en';
  };
  
  const [locale, setLocale] = useState(getInitialLocale());

  const t = useCallback((key: string): string => {
    const translation = getNestedTranslation(translations[locale], key);
    if (translation) {
      return translation;
    }
    // Fallback to English if translation is missing
    const fallback = getNestedTranslation(translations['en'], key);
    return fallback || key;
  }, [locale]);
  
  // Render nothing until translations are loaded to prevent errors.
  if (!isLoaded) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
