"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTranslation } from "@/i18n/useTranslation";
import {
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineBookOpen,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineCash,
  HiOutlineAcademicCap,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineFlag,
  HiOutlineChartBar,
} from "react-icons/hi";

type GoalCategory = "Quran" | "Prayer" | "Dhikr" | "Charity" | "Knowledge";
type GoalType = "daily" | "weekly" | "monthly" | "one-time";

interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  type: GoalType;
  target: number;
  current: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

const CATEGORIES: { name: GoalCategory; color: string; bg: string; icon: typeof HiOutlineBookOpen }[] = [
  { name: "Quran", color: "text-emerald dark:text-emerald-400", bg: "bg-emerald/10 dark:bg-emerald/20", icon: HiOutlineBookOpen },
  { name: "Prayer", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: HiOutlineHeart },
  { name: "Dhikr", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", icon: HiOutlineSparkles },
  { name: "Charity", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30", icon: HiOutlineCash },
  { name: "Knowledge", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-100 dark:bg-teal-900/30", icon: HiOutlineAcademicCap },
];

const GOAL_TYPES: { value: GoalType; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "one-time", label: "One-time" },
];

const STORAGE_KEY = "spiritual_goals";

const CATEGORY_PRESETS: Record<GoalCategory, string[]> = {
  Quran: ["Read 1 Juz", "Memorize 5 verses", "Read Surah Al-Kahf", "Listen to 1 recitation"],
  Prayer: ["Pray all 5 on time", "Add 2 sunnah prayers", "Pray Fajr on time", "Pray Tahajjud"],
  Dhikr: ["Complete 100 SubhanAllah", "Morning adhkar", "Evening adhkar", "Say Astaghfirullah 100x"],
  Charity: ["Give sadaqah", "Feed someone", "Help a neighbor", "Donate to orphans"],
  Knowledge: ["Read 1 hadith", "Learn a new dua", "Study a tafsir", "Listen to a lecture"],
};

export default function GoalsPage() {
  usePageTitle("Spiritual Goals");
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("Quran");
  const [type, setType] = useState<GoalType>("daily");
  const [target, setTarget] = useState(1);
  const [showCompleted, setShowCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setGoals(JSON.parse(stored));
    } catch {}
  }, []);

  const saveGoals = (updated: Goal[]) => {
    setGoals(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const activeGoals = useMemo(
    () => goals.filter((g) => !g.completed),
    [goals]
  );

  const completedGoals = useMemo(
    () => goals.filter((g) => g.completed),
    [goals]
  );

  const stats = useMemo(() => {
    const total = goals.length;
    const completed = completedGoals.length;
    const inProgress = activeGoals.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, rate };
  }, [goals, completedGoals, activeGoals]);

  const handleAddGoal = () => {
    if (!title.trim()) return;
    const goal: Goal = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      type,
      target,
      current: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    saveGoals([goal, ...goals]);
    setTitle("");
    setTarget(1);
    setShowForm(false);
  };

  const handleIncrement = (id: string) => {
    const updated = goals.map((g) => {
      if (g.id !== id) return g;
      const newCurrent = Math.min(g.current + 1, g.target);
      const isComplete = newCurrent >= g.target;
      return {
        ...g,
        current: newCurrent,
        completed: isComplete,
        completedAt: isComplete ? new Date().toISOString() : undefined,
      };
    });
    saveGoals(updated);
  };

  const handleDecrement = (id: string) => {
    const updated = goals.map((g) => {
      if (g.id !== id) return g;
      return { ...g, current: Math.max(g.current - 1, 0), completed: false, completedAt: undefined };
    });
    saveGoals(updated);
  };

  const handleDelete = (id: string) => {
    saveGoals(goals.filter((g) => g.id !== id));
  };

  const getCategoryInfo = (cat: GoalCategory) =>
    CATEGORIES.find((c) => c.name === cat) || CATEGORIES[0];

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white">
            {t("goals.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("goals.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
            <HiOutlineFlag className="w-5 h-5 text-emerald dark:text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t("goals.total")}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
            <HiOutlineChartBar className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t("goals.inProgress")}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
            <HiOutlineCheck className="w-5 h-5 text-emerald dark:text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t("goals.completed")}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 text-center">
            <HiOutlineSparkles className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rate}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t("goals.success")}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white bg-emerald hover:bg-emerald/90 dark:bg-emerald-400 dark:text-gray-900 dark:hover:bg-emerald-300 transition-all shadow-lg shadow-emerald/20"
          >
            <HiOutlinePlus className="w-5 h-5" />
            {t("goals.addNewGoal")}
          </button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("goals.newGoal")}</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("goals.goalTitle")}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="e.g., Read Surah Al-Mulk daily"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("goals.category")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.name}
                          onClick={() => {
                            setCategory(cat.name);
                            if (!title) setTitle(CATEGORY_PRESETS[cat.name][0]);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            category === cat.name
                              ? `${cat.bg} ${cat.color} ring-2 ring-current/20`
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t("goals.goalType")}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {GOAL_TYPES.map((gt) => (
                        <button
                          key={gt.value}
                          onClick={() => setType(gt.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            type === gt.value
                              ? "bg-emerald/10 text-emerald dark:bg-emerald/20 dark:text-emerald-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {gt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t("goals.targetCount")}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTarget(Math.max(1, target - 1))}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <HiOutlineX className="w-3 h-3" />
                      </button>
                      <span className="text-lg font-bold text-gray-900 dark:text-white w-8 text-center">
                        {target}
                      </span>
                      <button
                        onClick={() => setTarget(target + 1)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <HiOutlinePlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
                    {t("goals.quickPresets")} {category}:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_PRESETS[category].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setTitle(preset)}
                        className="px-2.5 py-1 rounded-lg text-[11px] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-emerald hover:text-emerald dark:hover:border-emerald-400 dark:hover:text-emerald-400 transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddGoal}
                  disabled={!title.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-emerald hover:bg-emerald/90 dark:bg-emerald-400 dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <HiOutlineCheck className="w-4 h-4" />
                  {t("goals.createGoal")}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeGoals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("goals.active")} ({activeGoals.length})
            </h2>
            <div className="space-y-3">
              {activeGoals.map((goal, i) => {
                const catInfo = getCategoryInfo(goal.category);
                const Icon = catInfo.icon;
                const percent = Math.round((goal.current / goal.target) * 100);
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${catInfo.bg}`}>
                          <Icon className={`w-4 h-4 ${catInfo.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {goal.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${catInfo.bg} ${catInfo.color}`}>
                              {goal.category}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">
                              {goal.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          {goal.current} / {goal.target}
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {percent}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald dark:bg-emerald-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrement(goal.id)}
                        disabled={goal.current === 0}
                        className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <HiOutlineX className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleIncrement(goal.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald/10 dark:bg-emerald/20 text-emerald dark:text-emerald-400 text-sm font-medium hover:bg-emerald/20 dark:hover:bg-emerald/30 transition-all"
                      >
                        <HiOutlinePlus className="w-4 h-4" />
                        {t("goals.progress")}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {completedGoals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white"
            >
              {t("goals.completed")} ({completedGoals.length})
              {showCompleted ? (
                <HiOutlineChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <HiOutlineChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <AnimatePresence>
              {showCompleted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  {completedGoals.map((goal) => {
                    const catInfo = getCategoryInfo(goal.category);
                    const Icon = catInfo.icon;
                    return (
                      <div
                        key={goal.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 opacity-75"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-emerald/10 dark:bg-emerald/20">
                              <HiOutlineCheck className="w-4 h-4 text-emerald dark:text-emerald-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm line-through">
                                {goal.title}
                              </h4>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${catInfo.bg} ${catInfo.color}`}>
                                {goal.category}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <HiOutlineTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {goals.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4 opacity-50">🎯</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t("goals.empty")}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
