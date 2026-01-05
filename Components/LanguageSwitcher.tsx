"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { locales, localeNames, localeFlags, Locale } from "@/lib/i18n";
import { ChevronDown, Globe } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "minimal";
  isScrolled?: boolean;
}

export default function LanguageSwitcher({
  variant = "default",
  isScrolled = false,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-1">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`px-2 py-1 text-sm font-medium rounded transition-all ${
              locale === loc
                ? "bg-gold-500 text-forest-900"
                : isScrolled
                ? "text-stone hover:text-gold-500"
                : "text-ivory/80 hover:text-ivory"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
            isScrolled
              ? "text-forest-700 hover:bg-sand"
              : "text-ivory hover:bg-ivory/10"
          }`}
        >
          <span className="text-lg">{localeFlags[locale]}</span>
          <ChevronDown
            size={14}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 py-1 w-32 bg-white rounded-lg shadow-xl border border-sand z-50">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-sand transition-colors ${
                  locale === loc
                    ? "bg-gold-500/10 text-gold-700"
                    : "text-charcoal"
                }`}
              >
                <span className="text-lg">{localeFlags[loc]}</span>
                <span>{localeNames[loc]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          isScrolled
            ? "bg-sand text-forest-700 hover:bg-gold-500/10"
            : "bg-ivory/10 text-ivory hover:bg-ivory/20"
        }`}
      >
        <Globe size={16} />
        <span className="text-lg">{localeFlags[locale]}</span>
        <span className="text-sm font-medium">{localeNames[locale]}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-44 bg-white rounded-xl shadow-2xl border border-sand z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-sand">
            <p className="text-xs font-medium text-stone uppercase tracking-wide">
              Select Language
            </p>
          </div>
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`w-full px-3 py-3 text-left flex items-center gap-3 hover:bg-sand transition-colors ${
                locale === loc ? "bg-gold-500/10" : ""
              }`}
            >
              <span className="text-2xl">{localeFlags[loc]}</span>
              <div>
                <p
                  className={`text-sm font-medium ${
                    locale === loc ? "text-gold-700" : "text-charcoal"
                  }`}
                >
                  {localeNames[loc]}
                </p>
                <p className="text-xs text-stone">
                  {loc === "en" ? "English" : loc === "de" ? "German" : loc}
                </p>
              </div>
              {locale === loc && (
                <div className="ml-auto w-2 h-2 bg-gold-500 rounded-full" />
              )}
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
