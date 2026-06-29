"use client";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTranslation } from "@/i18n/useTranslation";
import GeometricPattern from "@/components/GeometricPattern";
import {
  HiOutlineBookOpen,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineCash,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineLibrary,
  HiOutlineDocumentText,
  HiOutlineGlobe,
  HiOutlineAdjustments,
  HiOutlineFlag,
  HiOutlineCollection,
  HiOutlineClipboardCheck,
  HiOutlineLightningBolt,
  HiOutlineChat,
  HiOutlineCheck,
  HiOutlineChevronRight,
} from "react-icons/hi";

function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    const duration = 1500;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
        {count}+
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </div>
  );
}

const features = [
  { name: "Quran Reader", desc: "Read all 114 Surahs with Arabic text and English translations", icon: <HiOutlineBookOpen className="w-6 h-6" />, color: "from-emerald-500 to-teal-500" },
  { name: "Dua Library", desc: "102+ authentic duas organized by category and occasion", icon: <HiOutlineHeart className="w-6 h-6" />, color: "from-blue-500 to-indigo-500" },
  { name: "Dhikr Counter", desc: "Digital tasbih to track your daily remembrance of Allah", icon: <HiOutlineSparkles className="w-6 h-6" />, color: "from-amber-500 to-orange-500" },
  { name: "Prayer Times", desc: "Accurate prayer times based on your location", icon: <HiOutlineClock className="w-6 h-6" />, color: "from-purple-500 to-pink-500" },
  { name: "Qibla Compass", desc: "Find the direction of the Kaaba for prayer", icon: <HiOutlineLocationMarker className="w-6 h-6" />, color: "from-teal-500 to-cyan-500" },
  { name: "Zakat Calculator", desc: "Calculate your annual Zakat obligation easily", icon: <HiOutlineCash className="w-6 h-6" />, color: "from-yellow-500 to-amber-500" },
  { name: "99 Names of Allah", desc: "Learn and memorize the beautiful names of Allah", icon: <HiOutlineStar className="w-6 h-6" />, color: "from-cyan-500 to-blue-500" },
  { name: "Seerah Timeline", desc: "Explore the prophetic biography of Prophet Muhammad (pbuh)", icon: <HiOutlineCalendar className="w-6 h-6" />, color: "from-orange-500 to-red-500" },
  { name: "Hadith Collection", desc: "Authentic hadith from trusted collections", icon: <HiOutlineLibrary className="w-6 h-6" />, color: "from-rose-500 to-pink-500" },
  { name: "Islamic Stories", desc: "Inspiring stories from the Quran and Sunnah", icon: <HiOutlineDocumentText className="w-6 h-6" />, color: "from-indigo-500 to-violet-500" },
  { name: "Ramadan Guide", desc: "Complete companion for the blessed month", icon: <HiOutlineFlag className="w-6 h-6" />, color: "from-violet-500 to-purple-500" },
  { name: "Reading Goals", desc: "Set and track your Quran reading goals", icon: <HiOutlineClipboardCheck className="w-6 h-6" />, color: "from-green-500 to-emerald-500" },
];

const techStack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "Framer Motion",
  "Local Storage",
];

export default function AboutPage() {
  const { t } = useTranslation();
  usePageTitle("About");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative min-h-screen pt-24 pb-16 px-4">
        <GeometricPattern className="absolute inset-0 opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4">
      <GeometricPattern className="absolute inset-0 opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Header with Islamic Geometric Pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-10 text-center"
          style={{
            background: "linear-gradient(135deg, #059669 0%, #047857 40%, #d97706 80%, #f59e0b 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 text-8xl rotate-12">&#9776;</div>
            <div className="absolute bottom-4 left-8 text-7xl -rotate-12">&#9776;</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-20">&#9776;</div>
          </div>
          <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white/15 rounded-full" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-6xl mb-4"
            >
              &#128214;
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              About Quran Companion
            </h1>
            <p className="text-white/80 max-w-lg mx-auto text-sm leading-relaxed">
              A spiritual wellness platform helping Muslims worldwide connect with the Quran and build lasting spiritual habits through technology.
            </p>
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative inline-block mb-4"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
              AJ
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white dark:border-gray-800 flex items-center justify-center">
              <HiOutlineCheck className="w-4 h-4 text-white" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Ahmed Jaballah
          </h2>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-1">
            Creator & Developer
          </p>
          <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
            <HiOutlineLocationMarker className="w-4 h-4" />
            <span>Tunisia &#127481;&#127479;</span>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineChat className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              About the Creator
            </h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              Ahmed Jaballah is a passionate developer and devout Muslim who created Quran Companion as a spiritual wellness platform. His vision is to help Muslims worldwide connect with the Quran and build lasting spiritual habits through technology.
            </p>
            <p>
              This app was built with love and dedication to serve the Ummah. Every feature is designed with the intention of making it easier for Muslims to maintain their connection with Allah&apos;s words and the teachings of the Prophet Muhammad (peace be upon him).
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-500/20">
              <p className="text-emerald-700 dark:text-emerald-300 text-sm italic">
                &quot;The best of people are those that bring most benefit to the rest of mankind.&quot;
                <span className="block mt-1 text-emerald-600 dark:text-emerald-400 text-xs not-italic">
                  &mdash; Prophet Muhammad (peace be upon him)
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineLightningBolt className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Features
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-lg transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-3`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {feature.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <HiOutlineCollection className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              By the Numbers
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <AnimatedCounter target={37} label="Pages" />
            <AnimatedCounter target={102} label="Duas" />
            <AnimatedCounter target={400} label="Ideas" />
            <AnimatedCounter target={114} label="Surahs" />
          </div>
        </motion.div>

        {/* Connect Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineGlobe className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Connect
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "GitHub", desc: "View Source Code", color: "from-gray-700 to-gray-900", icon: "💻" },
              { name: "Email", desc: "Get in Touch", color: "from-blue-500 to-blue-600", icon: "📧" },
              { name: "Twitter", desc: "Follow Updates", color: "from-sky-400 to-sky-500", icon: "🐦" },
            ].map((link) => (
              <div
                key={link.name}
                className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${link.color} text-white cursor-pointer hover:scale-105 transition-transform`}
              >
                <div className="absolute top-2 right-2 text-3xl opacity-30">{link.icon}</div>
                <div className="relative z-10">
                  <div className="text-lg font-bold mb-1">{link.name}</div>
                  <div className="text-white/80 text-xs flex items-center gap-1">
                    {link.desc}
                    <HiOutlineChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineAdjustments className="w-5 h-5 text-teal-500 dark:text-teal-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tech Stack
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 p-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineDocumentText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
              Important Note
            </h2>
          </div>
          <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
            Quran Companion is designed as a spiritual companion, not a substitute for religious scholarship. All verses and duas are from authentic sources. Please consult with knowledgeable scholars for religious rulings.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center py-6 space-y-2"
        >
          <div className="text-2xl mb-2">&#10084;&#65039;</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with &#10084;&#65039; for the Ummah
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; 2026 Quran Companion &middot; Version 1.0.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}


