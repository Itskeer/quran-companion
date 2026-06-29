"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppProviders";
import { useTranslation } from "@/i18n/useTranslation";
import GlobalSearch from "./GlobalSearch";
import {
  HiOutlineHome,
  HiOutlineHeart,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineInformationCircle,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineSearch,
  HiOutlineCollection,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineCash,
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineDotsHorizontal,
  HiOutlineAcademicCap,
  HiOutlineGlobe,
  HiOutlineMoon as HiOutlineSleep,
  HiOutlineSparkles,
  HiOutlinePencil,
  HiOutlineColorSwatch,
  HiOutlineDownload,
  HiOutlineLightBulb,
} from "react-icons/hi";

const primaryLinks = [
  { href: "/", icon: HiOutlineHome, labelKey: "nav.home" },
  { href: "/quran", icon: HiOutlineBookOpen, labelKey: "nav.quran" },
  { href: "/duas", icon: HiOutlineHeart, labelKey: "nav.duas" },
  { href: "/dhikr", icon: HiOutlineChartBar, labelKey: "nav.dhikr" },
  { href: "/prayer-times", icon: HiOutlineClock, labelKey: "nav.prayer" },
];

const moreLinks = [
  { href: "/mood", icon: HiOutlineHeart, labelKey: "nav.mood" },
  { href: "/qibla", icon: HiOutlineLocationMarker, labelKey: "nav.qibla" },
  { href: "/zakat", icon: HiOutlineCash, labelKey: "nav.zakat" },
  { href: "/news", icon: HiOutlineDocumentText, labelKey: "nav.news" },
  { href: "/99-names", icon: HiOutlineCollection, labelKey: "nav.names" },
  { href: "/seerah", icon: HiOutlineCalendar, labelKey: "nav.seerah" },
  { href: "/prophets", icon: HiOutlineBookOpen, labelKey: "nav.prophets" },
  { href: "/hadith", icon: HiOutlineDocumentText, labelKey: "nav.hadith" },
  { href: "/ramadan", icon: HiOutlineCalendar, labelKey: "nav.ramadan" },
  { href: "/reading-modes", icon: HiOutlineSun, labelKey: "nav.reading" },
  { href: "/gratitude", icon: HiOutlineHeart, labelKey: "nav.gratitude" },
  { href: "/goals", icon: HiOutlineChartBar, labelKey: "nav.goals" },
  { href: "/good-deeds", icon: HiOutlineStar, labelKey: "nav.goodDeeds" },
  { href: "/stories", icon: HiOutlineBookOpen, labelKey: "nav.stories" },
  { href: "/glossary", icon: HiOutlineDocumentText, labelKey: "nav.glossary" },
  { href: "/tafsir", icon: HiOutlineBookOpen, labelKey: "nav.tafsir" },
  { href: "/word-learning", icon: HiOutlineAcademicCap, labelKey: "nav.wordLearning" },
  { href: "/memorization", icon: HiOutlineBookOpen, labelKey: "nav.memorization" },
  { href: "/tajweed", icon: HiOutlineDocumentText, labelKey: "nav.tajweed" },
  { href: "/reading-plan", icon: HiOutlineCalendar, labelKey: "nav.readingPlan" },
  { href: "/adhkar", icon: HiOutlineHeart, labelKey: "nav.adhkar" },
  { href: "/istighfar", icon: HiOutlineHeart, labelKey: "nav.istighfar" },
  { href: "/sadaqah", icon: HiOutlineHeart, labelKey: "nav.sadaqah" },
  { href: "/arabic-learning", icon: HiOutlineAcademicCap, labelKey: "nav.arabicLearning" },
  { href: "/quiz", icon: HiOutlineAcademicCap, labelKey: "nav.quiz" },
  { href: "/word-of-day", icon: HiOutlineSparkles, labelKey: "nav.wordOfDay" },
  { href: "/fiqh", icon: HiOutlineBookOpen, labelKey: "nav.fiqh" },
  { href: "/dua-requests", icon: HiOutlineHeart, labelKey: "nav.duaRequests" },
  { href: "/calendar-events", icon: HiOutlineCalendar, labelKey: "nav.calendarEvents" },
  { href: "/sleep-mode", icon: HiOutlineSleep, labelKey: "nav.sleepMode" },
  { href: "/anxiety-duas", icon: HiOutlineHeart, labelKey: "nav.anxietyDuas" },
  { href: "/salah-focus", icon: HiOutlineGlobe, labelKey: "nav.salahFocus" },
  { href: "/weekly-reflection", icon: HiOutlinePencil, labelKey: "nav.weeklyReflection" },
  { href: "/adhan-settings", icon: HiOutlineBell, labelKey: "nav.adhanSettings" },
  { href: "/export-data", icon: HiOutlineDownload, labelKey: "nav.exportData" },
  { href: "/custom-themes", icon: HiOutlineColorSwatch, labelKey: "nav.customThemes" },
  { href: "/stats", icon: HiOutlineChartBar, labelKey: "nav.stats" },
  { href: "/favorites", icon: HiOutlineHeart, labelKey: "nav.favorites" },
  { href: "/collections", icon: HiOutlineCollection, labelKey: "nav.collections" },
  { href: "/notifications", icon: HiOutlineBell, labelKey: "nav.reminders" },
  { href: "/checkin", icon: HiOutlineCalendar, labelKey: "nav.checkin" },
  { href: "/settings", icon: HiOutlineCog, labelKey: "nav.settings" },
  { href: "/about", icon: HiOutlineInformationCircle, labelKey: "nav.about" },
];

const mobileLinks = [
  { href: "/", icon: HiOutlineHome, labelKey: "nav.home" },
  { href: "/mood", icon: HiOutlineHeart, labelKey: "nav.mood" },
  { href: "/quran", icon: HiOutlineBookOpen, labelKey: "nav.quran" },
  { href: "/quran-reader", icon: HiOutlineBookOpen, labelKey: "nav.quran" },
  { href: "/duas", icon: HiOutlineHeart, labelKey: "nav.duas" },
  { href: "/dhikr", icon: HiOutlineChartBar, labelKey: "nav.dhikr" },
  { href: "/prayer-times", icon: HiOutlineClock, labelKey: "nav.prayer" },
  { href: "/qibla", icon: HiOutlineLocationMarker, labelKey: "nav.qibla" },
  { href: "/zakat", icon: HiOutlineCash, labelKey: "nav.zakat" },
  { href: "/news", icon: HiOutlineDocumentText, labelKey: "nav.news" },
  { href: "/99-names", icon: HiOutlineCollection, labelKey: "nav.names" },
  { href: "/seerah", icon: HiOutlineCalendar, labelKey: "nav.seerah" },
  { href: "/prophets", icon: HiOutlineBookOpen, labelKey: "nav.prophets" },
  { href: "/hadith", icon: HiOutlineDocumentText, labelKey: "nav.hadith" },
  { href: "/ramadan", icon: HiOutlineCalendar, labelKey: "nav.ramadan" },
  { href: "/reading-modes", icon: HiOutlineSun, labelKey: "nav.reading" },
  { href: "/gratitude", icon: HiOutlineHeart, labelKey: "nav.gratitude" },
  { href: "/goals", icon: HiOutlineChartBar, labelKey: "nav.goals" },
  { href: "/good-deeds", icon: HiOutlineStar, labelKey: "nav.goodDeeds" },
  { href: "/stories", icon: HiOutlineBookOpen, labelKey: "nav.stories" },
  { href: "/glossary", icon: HiOutlineDocumentText, labelKey: "nav.glossary" },
  { href: "/tafsir", icon: HiOutlineBookOpen, labelKey: "nav.tafsir" },
  { href: "/word-learning", icon: HiOutlineAcademicCap, labelKey: "nav.wordLearning" },
  { href: "/memorization", icon: HiOutlineBookOpen, labelKey: "nav.memorization" },
  { href: "/tajweed", icon: HiOutlineDocumentText, labelKey: "nav.tajweed" },
  { href: "/reading-plan", icon: HiOutlineCalendar, labelKey: "nav.readingPlan" },
  { href: "/adhkar", icon: HiOutlineHeart, labelKey: "nav.adhkar" },
  { href: "/istighfar", icon: HiOutlineHeart, labelKey: "nav.istighfar" },
  { href: "/sadaqah", icon: HiOutlineHeart, labelKey: "nav.sadaqah" },
  { href: "/arabic-learning", icon: HiOutlineAcademicCap, labelKey: "nav.arabicLearning" },
  { href: "/quiz", icon: HiOutlineAcademicCap, labelKey: "nav.quiz" },
  { href: "/word-of-day", icon: HiOutlineSparkles, labelKey: "nav.wordOfDay" },
  { href: "/fiqh", icon: HiOutlineBookOpen, labelKey: "nav.fiqh" },
  { href: "/dua-requests", icon: HiOutlineHeart, labelKey: "nav.duaRequests" },
  { href: "/calendar-events", icon: HiOutlineCalendar, labelKey: "nav.calendarEvents" },
  { href: "/sleep-mode", icon: HiOutlineSleep, labelKey: "nav.sleepMode" },
  { href: "/anxiety-duas", icon: HiOutlineHeart, labelKey: "nav.anxietyDuas" },
  { href: "/salah-focus", icon: HiOutlineGlobe, labelKey: "nav.salahFocus" },
  { href: "/weekly-reflection", icon: HiOutlinePencil, labelKey: "nav.weeklyReflection" },
  { href: "/adhan-settings", icon: HiOutlineBell, labelKey: "nav.adhanSettings" },
  { href: "/export-data", icon: HiOutlineDownload, labelKey: "nav.exportData" },
  { href: "/custom-themes", icon: HiOutlineColorSwatch, labelKey: "nav.customThemes" },
  { href: "/onboarding", icon: HiOutlineInformationCircle, labelKey: "nav.tutorial" },
  { href: "/favorites", icon: HiOutlineHeart, labelKey: "nav.favorites" },
  { href: "/collections", icon: HiOutlineCollection, labelKey: "nav.collections" },
  { href: "/stats", icon: HiOutlineChartBar, labelKey: "nav.stats" },
  { href: "/notifications", icon: HiOutlineBell, labelKey: "nav.reminders" },
  { href: "/checkin", icon: HiOutlineCalendar, labelKey: "nav.checkin" },
  { href: "/history", icon: HiOutlineChartBar, labelKey: "nav.history" },
  { href: "/settings", icon: HiOutlineCog, labelKey: "nav.settings" },
  { href: "/about", icon: HiOutlineInformationCircle, labelKey: "nav.about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { t, isRTL } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { settings, setSettings } = useApp();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__openSearch = () => setSearchOpen(true);
    return () => {
      delete w.__openSearch;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setMobileOpen(false));
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [moreOpen]);

  const toggleDark = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-cream/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <span className="text-2xl">📖</span>
              <span className="font-semibold text-lg text-gray-800 dark:text-white">
                {isRTL ? "رفيق" : "Quran"}
                <span className="text-[var(--accent)]">
                  {isRTL ? "القرآن" : "Companion"}
                </span>
              </span>
            </Link>

            {/* Desktop nav - primary links + More dropdown */}
            <div className="hidden md:flex items-center gap-1">
              {primaryLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-[var(--accent)]"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t(link.labelKey)}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--accent)] rounded-full"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    moreOpen || moreLinks.some((l) => pathname === l.href)
                      ? "text-[var(--accent)] bg-[var(--accent)]/10"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <HiOutlineDotsHorizontal className="w-4 h-4" />
                  {t("nav.more")}
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 right-0 w-64 max-h-[70vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2"
                    >
                      {moreLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMoreOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                              isActive
                                ? "text-[var(--accent)] bg-[var(--accent)]/10"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            {t(link.labelKey)}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs"
                aria-label="Search"
              >
                <HiOutlineSearch className="w-4 h-4" />
                <span className="hidden lg:inline">{t("nav.search")}</span>
                <kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-[10px] font-mono">
                  Ctrl+K
                </kbd>
              </button>
              <button
                onClick={toggleDark}
                className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {settings.darkMode ? (
                  <HiOutlineSun className="w-5 h-5" />
                ) : (
                  <HiOutlineMoon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open menu"
              >
                <HiOutlineMenu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: isRTL ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "-100%" : "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-0 bottom-0 w-72 max-w-[85vw] bg-cream dark:bg-gray-900 shadow-2xl overflow-y-auto ${
                isRTL ? "left-0" : "right-0"
              }`}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-gray-800 dark:text-white">
                  {isRTL ? "القائمة" : "Menu"}
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 pt-2 space-y-1">
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full transition-colors"
                >
                  <HiOutlineSearch className="w-5 h-5" />
                  {t("nav.search")}
                </button>
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />
                {mobileLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {t(link.labelKey)}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
