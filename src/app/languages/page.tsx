"use client";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppProviders";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Language } from "@/types";
import { HiOutlineGlobe } from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

const languages: { code: Language; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "fr", label: "French", native: "Français", flag: "🇫🇷" },
];

export default function LanguagesPage() {
  const { t } = useTranslation();
  usePageTitle(t("languages.title"));
  const { language, setLanguage } = useApp();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <HiOutlineGlobe className="w-6 h-6 text-emerald dark:text-emerald-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white">
              {t("languages.title")}
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 ml-9">
            {t("languages.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {languages.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                language === lang.code
                  ? "border-emerald bg-emerald/5 dark:bg-emerald/10"
                  : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600"
              }`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <div className="flex-1">
                <p className="font-medium text-dark dark:text-white">{lang.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{lang.native}</p>
              </div>
              {language === lang.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-emerald rounded-full flex items-center justify-center"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8"
        >
          {t("languages.note")}
        </motion.p>
      </div>
    </div>
  );
}
