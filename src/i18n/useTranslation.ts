"use client";
import { useApp } from "@/context/AppProviders";
import { translations } from "./translations";
import { Language } from "@/types";

export function useTranslation() {
  const { language } = useApp();

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[i18n] Missing translation key: "${key}"`);
      }
      return key;
    }
    return entry[language] || entry.en || key;
  };

  return { t, language, isRTL: language === "ar" };
}
