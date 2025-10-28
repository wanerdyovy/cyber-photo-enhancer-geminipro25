
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n';
import LanguageIcon from './icons/LanguageIcon';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
  { code: 'ja', name: '日本語' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
];

const LanguageSelector: React.FC = () => {
  const { locale, setLocale, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (langCode: string) => {
    setLocale(langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguageName = t(`languages.${locale}`) || LANGUAGES.find(l => l.code === locale)?.name;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-sm text-gray-300 hover:bg-gray-700/70 hover:border-purple-500 transition-colors"
      >
        <LanguageIcon className="w-5 h-5" />
        <span className="hidden sm:inline">{currentLanguageName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-purple-500 rounded-md shadow-lg z-10 animate-fade-in-up">
          <ul className="py-1">
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLanguageChange(lang.code);
                  }}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    locale === lang.code
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {t(`languages.${lang.code}`) || lang.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
