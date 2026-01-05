"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Locale,
  defaultLocale,
  getTranslations,
  getNestedTranslation,
  locales,
} from "@/lib/i18n";

type TranslationsType = ReturnType<typeof getTranslations>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationsType;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = "maralgoo-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<TranslationsType>(
    getTranslations(defaultLocale)
  );

  // Load saved language preference on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
      setTranslations(getTranslations(savedLocale));
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0] as Locale;
      if (locales.includes(browserLang)) {
        setLocaleState(browserLang);
        setTranslations(getTranslations(browserLang));
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setTranslations(getTranslations(newLocale));
    localStorage.setItem(STORAGE_KEY, newLocale);
    // Update HTML lang attribute
    document.documentElement.lang = newLocale;
  };

  const translate = (key: string): string => {
    return getNestedTranslation(translations, key);
  };

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t: translations, translate }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Hook for simple translations
export function useTranslation() {
  const { t, translate, locale } = useLanguage();
  return { t, translate, locale };
}
