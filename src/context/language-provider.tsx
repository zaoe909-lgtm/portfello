'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dictionaries, Dictionary } from '@/lib/locales';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  dictionary: Dictionary;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [dictionary, setDictionary] = useState<Dictionary>(dictionaries.en);

  useEffect(() => {
    const newDirection = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    setDictionary(dictionaries[language]);
    document.documentElement.dir = newDirection;
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, direction, dictionary, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
