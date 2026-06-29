"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTranslation } from "@/i18n/useTranslation";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  calculatePrayerTimes,
  getNextPrayer,
  getTimeUntilPrayer,
  CALCULATION_METHODS,
  type PrayerTimeCalculation,
} from "@/services/prayerTimes";
import {
  HiOutlineBell,
  HiOutlineLocationMarker,
  HiOutlineChevronDown,
} from "react-icons/hi";

type Method = PrayerTimeCalculation["method"];

interface PrayerNotificationSettings {
  fajr: boolean;
  sunrise: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

const PRAYER_NAMES = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

const PRAYER_ICONS: Record<string, string> = {
  Fajr: "🌅",
  Sunrise: "☀️",
  Dhuhr: "🌞",
  Asr: "🌤️",
  Maghrib: "🌇",
  Isha: "🌙",
};

const PRAYER_ARABIC: Record<string, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const METHOD_LABELS: Record<Method, string> = {
  MWL: "prayer.method.mwl",
  ISNA: "prayer.method.isna",
  Egypt: "prayer.method.egypt",
  Karachi: "prayer.method.karachi",
};

function sendNotification(title: string, body: string) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "🕌" });
  }
}

export default function PrayerTimesPage() {
  const { t } = useTranslation();
  usePageTitle(t("prayer.title"));
  const geo = useGeolocation();

  const [method, setMethod] = useLocalStorage<Method>(
    "prayer-times-method",
    "MWL"
  );
  const [notifications, setNotifications] = useLocalStorage<PrayerNotificationSettings>(
    "prayer-times-notifications",
    { fajr: false, sunrise: false, dhuhr: false, asr: false, maghrib: false, isha: false }
  );

  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const calc: PrayerTimeCalculation = useMemo(
    () => ({
      method,
      latitude: geo.latitude,
      longitude: geo.longitude,
    }),
    [method, geo.latitude, geo.longitude]
  );

  const times = useMemo(() => {
    if (geo.loading || geo.error) return null;
    return calculatePrayerTimes(new Date(), calc);
  }, [calc, geo.loading, geo.error]);

  const nextPrayer = useMemo(() => {
    if (!times) return null;
    return getNextPrayer(times);
  }, [times]);

  const timeUntil = useMemo(() => {
    if (!nextPrayer) return "";
    return getTimeUntilPrayer(nextPrayer);
  }, [nextPrayer]);

  const weeklyTimes = useMemo(() => {
    if (geo.loading || geo.error) return [];
    const days: { date: Date; label: string; dayNum: string; times: ReturnType<typeof calculatePrayerTimes> }[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        date: d,
        label: d.toLocaleDateString("en", { weekday: "short" }),
        dayNum: String(d.getDate()),
        times: calculatePrayerTimes(d, calc),
      });
    }
    return days;
  }, [calc, geo.loading, geo.error]);

  const toggleNotification = useCallback(
    async (prayer: keyof PrayerNotificationSettings) => {
      if (!notifications[prayer]) {
        if ("Notification" in window && Notification.permission !== "granted") {
          await Notification.requestPermission();
        }
      }
      setNotifications((prev) => ({
        ...prev,
        [prayer]: !prev[prayer],
      }));
    },
    [notifications, setNotifications]
  );

  useEffect(() => {
    if (!times) return;
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      if (notifications.fajr && currentTime === times.fajr) sendNotification(t("prayer.notification.fajr.title"), t("prayer.notification.fajr.body"));
      if (notifications.sunrise && currentTime === times.sunrise) sendNotification(t("prayer.notification.sunrise.title"), t("prayer.notification.sunrise.body"));
      if (notifications.dhuhr && currentTime === times.dhuhr) sendNotification(t("prayer.notification.dhuhr.title"), t("prayer.notification.dhuhr.body"));
      if (notifications.asr && currentTime === times.asr) sendNotification(t("prayer.notification.asr.title"), t("prayer.notification.asr.body"));
      if (notifications.maghrib && currentTime === times.maghrib) sendNotification(t("prayer.notification.maghrib.title"), t("prayer.notification.maghrib.body"));
      if (notifications.isha && currentTime === times.isha) sendNotification(t("prayer.notification.isha.title"), t("prayer.notification.isha.body"));
    }, 60000);
    return () => clearInterval(interval);
  }, [notifications, times]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-2">
            🕌 {t("prayer.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("prayer.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <HiOutlineLocationMarker className="w-4 h-4 text-emerald dark:text-emerald-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {geo.loading
              ? t("prayer.gettingLocation")
              : geo.error
                ? t("prayer.locationUnavailable")
                : `${geo.latitude.toFixed(4)}, ${geo.longitude.toFixed(4)}`}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative inline-block w-full max-w-xs mx-auto">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as Method)}
              className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-dark dark:text-white outline-none focus:ring-2 focus:ring-emerald/30 cursor-pointer"
            >
              {(Object.keys(METHOD_LABELS) as Method[]).map((m) => (
                <option key={m} value={m}>
                  {t(METHOD_LABELS[m])}
                </option>
              ))}
            </select>
            <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </motion.div>

        {nextPrayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border-2 border-emerald dark:border-emerald-400 rounded-2xl p-6 mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald text-white text-xs font-bold uppercase tracking-wide">
                {t("prayer.next")}
              </span>
            </div>
            <p className="text-2xl font-bold text-emerald dark:text-emerald-400 mb-1">
              {nextPrayer.name}
            </p>
            <p className="text-lg font-noto-arabic text-emerald-700 dark:text-emerald-300 mb-2">
              {PRAYER_ARABIC[nextPrayer.name]}
            </p>
            <p className="text-3xl font-bold text-dark dark:text-white mb-1">
              {nextPrayer.time}
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {t("prayer.in")} {timeUntil}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
        >
          {PRAYER_NAMES.map((name, i) => {
            const time = times ? times[name.toLowerCase() as keyof typeof times] : "--:--";
            const isNext = nextPrayer?.name === name;
            const notifKey = name.toLowerCase() as keyof PrayerNotificationSettings;
            const notifOn = notifications[notifKey];
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className={`relative rounded-2xl p-4 text-center transition-all ${
                  isNext
                    ? "bg-emerald/10 dark:bg-emerald/20 border-2 border-emerald dark:border-emerald-400 shadow-lg shadow-emerald/10"
                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                }`}
              >
                {isNext && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald text-white text-[10px] font-bold uppercase">
                    {t("prayer.nextBadge")}
                  </span>
                )}
                <div className="text-2xl mb-2">{PRAYER_ICONS[name]}</div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                  isNext ? "text-emerald dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {name}
                </p>
                <p className="text-lg font-bold text-dark dark:text-white mb-1">
                  {time}
                </p>
                <p className="text-[10px] font-noto-arabic text-gray-400 dark:text-gray-500 mb-3">
                  {PRAYER_ARABIC[name]}
                </p>
                <button
                  onClick={() => toggleNotification(notifKey)}
                  className={`mx-auto flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                    notifOn
                      ? "bg-emerald/10 text-emerald dark:bg-emerald/20 dark:text-emerald-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {notifOn ? (
                    <HiOutlineBell className="w-3 h-3" />
                  ) : (
                    <HiOutlineBell className="w-3 h-3" />
                  )}
                  {notifOn ? t("prayer.on") : t("prayer.off")}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 text-center">
            {t("prayer.thisWeek")}
          </h2>
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 min-w-max">
              {weeklyTimes.map((day, i) => {
                const isToday =
                  day.date.toISOString().split("T")[0] ===
                  new Date().toISOString().split("T")[0];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.03 }}
                    className={`flex-shrink-0 w-28 rounded-2xl p-3 text-center ${
                      isToday
                        ? "bg-emerald/10 dark:bg-emerald/20 border-2 border-emerald dark:border-emerald-400"
                        : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    <p className={`text-xs font-semibold mb-1 ${
                      isToday ? "text-emerald dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {day.label}
                    </p>
                    <p className={`text-lg font-bold mb-3 ${
                      isToday ? "text-emerald dark:text-emerald-400" : "text-dark dark:text-white"
                    }`}>
                      {day.dayNum}
                    </p>
                    <div className="space-y-2">
                      {PRAYER_NAMES.map((name) => {
                        const key = name.toLowerCase() as keyof typeof day.times;
                        const isNextPrayer =
                          isToday && nextPrayer?.name === name;
                        return (
                          <div key={name}>
                            <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase">
                              {name.slice(0, 1)}
                            </p>
                            <p className={`text-xs font-medium ${
                              isNextPrayer
                                ? "text-emerald dark:text-emerald-400 font-bold"
                                : "text-gray-600 dark:text-gray-300"
                            }`}>
                              {day.times[key]}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
