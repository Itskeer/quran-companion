"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppProviders";
import { NotificationSchedule } from "@/types";
import { useTranslation } from "@/i18n/useTranslation";
import {
  HiOutlineBell,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlinePencil,
} from "react-icons/hi";

type Tab = "reminders" | "schedule" | "history";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function NotificationsPage() {
  const { t } = useTranslation();
  const {
    notificationSettings,
    setNotificationSettings,
    notifications,
    addNotification,
    updateNotification,
    removeNotification,
    toggleNotification,
    notificationHistory,
  } = useApp();

  const [tab, setTab] = useState<Tab>("reminders");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState<string | null>(
    null
  );
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formTime, setFormTime] = useState("08:00");
  const [formDays, setFormDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [formType, setFormType] = useState<
    "verse" | "dua" | "dhikr" | "reading" | "streak" | "custom"
  >("custom");

  const toggleReminder = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleDay = (day: number) => {
    setFormDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const resetForm = () => {
    setFormTitle("");
    setFormBody("");
    setFormTime("08:00");
    setFormDays([0, 1, 2, 3, 4, 5, 6]);
    setFormType("custom");
  };

  const handleCreateNotification = () => {
    if (!formTitle.trim()) return;
    const notif: NotificationSchedule = {
      id: `notif-${Date.now()}`,
      title: formTitle.trim(),
      body: formBody.trim() || "Time for your reminder",
      time: formTime,
      days: formDays,
      type: formType,
      enabled: true,
    };
    addNotification(notif);
    resetForm();
    setShowAddModal(false);
  };

  const handleUpdateNotification = () => {
    if (!editingNotification || !formTitle.trim()) return;
    updateNotification(editingNotification, {
      title: formTitle.trim(),
      body: formBody.trim() || "Time for your reminder",
      time: formTime,
      days: formDays,
      type: formType,
    });
    setEditingNotification(null);
    resetForm();
  };

  const startEdit = (notif: NotificationSchedule) => {
    setEditingNotification(notif.id);
    setFormTitle(notif.title);
    setFormBody(notif.body);
    setFormTime(notif.time);
    setFormDays(notif.days);
    setFormType(notif.type);
  };

  const reminderToggles = [
    {
      key: "morningAdhkar" as const,
      label: t("notifications.morningVerse"),
      desc: t("notifications.morningVerseDesc"),
      time: "06:00",
    },
    {
      key: "eveningAdhkar" as const,
      label: t("notifications.eveningDua"),
      desc: t("notifications.eveningDuaDesc"),
      time: "18:00",
    },
    {
      key: "dailyQuran" as const,
      label: t("notifications.readingReminder"),
      desc: t("notifications.readingReminderDesc"),
      time: "20:00",
    },
    {
      key: "fridayReminder" as const,
      label: t("notifications.fridaySpecial"),
      desc: t("notifications.fridaySpecialDesc"),
      time: "12:00",
    },
    {
      key: "readingGoal" as const,
      label: t("notifications.streakWarning"),
      desc: t("notifications.streakWarningDesc"),
      time: "21:00",
    },
    {
      key: "sleepReminder" as const,
      label: t("notifications.sleepReminder"),
      desc: t("notifications.sleepReminderDesc"),
      time: "22:00",
    },
  ];

  const sortedHistory = useMemo(
    () =>
      [...notificationHistory].sort(
        (a, b) =>
          new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      ),
    [notificationHistory]
  );

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {t("notifications.title")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("notifications.manageReminders")}
        </p>
      </motion.div>

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {(
          [
            ["reminders", t("notifications.reminders")],
            ["schedule", t("notifications.schedule")],
            ["history", t("notifications.historyTab")],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "reminders" && (
          <motion.div
            key="reminders"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-3"
          >
            {reminderToggles.map((reminder, i) => (
              <motion.div
                key={reminder.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <HiOutlineBell className="w-4 h-4 text-emerald dark:text-emerald-400" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {reminder.label}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-6">
                    {reminder.desc}
                  </p>
                </div>
                <button
                  onClick={() => toggleReminder(reminder.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-3 ${
                    notificationSettings[reminder.key]
                      ? "bg-emerald dark:bg-emerald-400"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <motion.div
                    animate={{
                      x: notificationSettings[reminder.key] ? 20 : 2,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "schedule" && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-emerald dark:bg-emerald-400 text-white dark:text-gray-900 font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <HiOutlinePlus className="w-4 h-4" />
              {t("notifications.addCustomReminder")}
            </button>

            {notifications.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-12 text-center">
                <HiOutlineBell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("notifications.noCustomReminders")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              notif.enabled
                                ? "bg-emerald dark:bg-emerald-400"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {notif.title}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-4">
                          {notif.body}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification(notif.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-3 ${
                          notif.enabled
                            ? "bg-emerald dark:bg-emerald-400"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <motion.div
                          animate={{ x: notif.enabled ? 20 : 2 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 ml-4 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1">
                        <HiOutlineClock className="w-3 h-3" />
                        {notif.time}
                      </span>
                      <span className="capitalize">{notif.type}</span>
                      <span>
                        {notif.days
                          .map((d) => DAYS_OF_WEEK[d])
                          .join(", ")}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3 ml-4">
                      <button
                        onClick={() => {
                          startEdit(notif);
                          setShowAddModal(true);
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <HiOutlinePencil className="w-3 h-3 inline mr-1" />
                        {t("common.edit")}
                      </button>
                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <HiOutlineTrash className="w-3 h-3 inline mr-1" />
                        {t("common.delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {sortedHistory.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-12 text-center">
                <HiOutlineClock className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("notifications.noNotificationHistory")}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald/10 dark:bg-emerald/20 flex items-center justify-center shrink-0">
                      <HiOutlineBell className="w-4 h-4 text-emerald dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.body}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {new Date(item.sentAt).toLocaleString()}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 capitalize">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <HiOutlineCheck className="w-4 h-4 text-emerald dark:text-emerald-400 shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingNotification(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingNotification ? t("notifications.editReminder") : t("notifications.newReminder")}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingNotification(null);
                    resetForm();
                  }}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                    {t("notifications.titleLabel")}
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={t("notifications.titlePlaceholder")}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                    {t("notifications.messageLabel")}
                  </label>
                  <input
                    type="text"
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    placeholder={t("notifications.messagePlaceholder")}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                    {t("notifications.timeLabel")}
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    {t("notifications.daysLabel")}
                  </label>
                  <div className="flex gap-2">
                    {DAYS_OF_WEEK.map((day, i) => (
                      <button
                        key={i}
                        onClick={() => toggleDay(i)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                          formDays.includes(i)
                            ? "bg-emerald/10 text-emerald dark:text-emerald-400 border border-emerald/30"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-transparent"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                    {t("notifications.typeLabel")}
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as typeof formType)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald"
                  >
                    <option value="custom">{t("notifications.typeCustom")}</option>
                    <option value="verse">{t("notifications.typeVerse")}</option>
                    <option value="dua">{t("notifications.typeDua")}</option>
                    <option value="dhikr">{t("notifications.typeDhikr")}</option>
                    <option value="reading">{t("notifications.typeReading")}</option>
                    <option value="streak">{t("notifications.typeStreak")}</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingNotification(null);
                      resetForm();
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    onClick={
                      editingNotification
                        ? handleUpdateNotification
                        : handleCreateNotification
                    }
                    disabled={!formTitle.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-emerald dark:bg-emerald-400 text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    {editingNotification ? t("notifications.update") : t("notifications.create")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
