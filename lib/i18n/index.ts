import en from "./locales/en.json";
import de from "./locales/de.json";
import ko from "./locales/ko.json";

export const locales = ["en", "de", "ko"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  ko: "한국어",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  ko: "🇰🇷",
};

const translations: Record<Locale, typeof en> = {
  en,
  de,
  ko,
};

export function getTranslations(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
}

export function getNestedTranslation(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) || path;
}
