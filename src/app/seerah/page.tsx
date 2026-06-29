"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineFilter,
} from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

const EVENTS = [
  { year: "570 CE", hijri: "Year of the Elephant", title: "Birth of Prophet Muhammad \uDFBA", description: "Born in Makkah, in the month of Rabi' al-Awwal. His father Abdullah had passed away before his birth.", location: "Makkah", category: "early" },
  { year: "576 CE", title: "Death of Aminah", description: "His mother Aminah passed away when he was six years old. He was then cared for by his grandfather Abdul Muttalib.", location: "Madinah", category: "early" },
  { year: "582 CE", title: "Orphanhood", description: "His grandfather Abdul Muttalib also passed away. He was then cared for by his uncle Abu Talib.", location: "Makkah", category: "early" },
  { year: "595 CE", title: "Marriage to Khadijah", description: "At age 25, he married Khadijah bint Khuwaylid, a respected businesswoman. They had six children together.", location: "Makkah", category: "early" },
  { year: "610 CE", hijri: "Year of Revelation", title: "First Revelation", description: "The angel Jibril (Gabriel) descended in Cave Hira with the first verses of the Quran: 'Read, in the name of your Lord.'", location: "Cave Hira, Makkah", category: "prophethood" },
  { year: "613 CE", title: "Public Preaching", description: "After 3 years of secret preaching, the Prophet began openly calling people to Islam on Mount Safa.", location: "Makkah", category: "prophethood" },
  { year: "619 CE", title: "Year of Sorrow", description: "Both his wife Khadijah and uncle Abu Talib passed away, leaving him without their protection and support.", location: "Makkah", category: "prophethood" },
  { year: "620 CE", title: "Isra and Mi'raj", description: "The miraculous Night Journey from Makkah to Jerusalem, and ascension through the seven heavens.", location: "Makkah to Jerusalem", category: "prophethood" },
  { year: "622 CE", hijri: "1 AH", title: "Hijrah to Madinah", description: "The migration to Madinah, marking the beginning of the Islamic calendar. A new community was established.", location: "Madinah", category: "prophethood" },
  { year: "624 CE", hijri: "2 AH", title: "Battle of Badr", description: "The first major battle where 313 Muslims defeated over 1000 Quraysh. A turning point for Islam.", location: "Badr", category: "battles" },
  { year: "625 CE", hijri: "3 AH", title: "Battle of Uhud", description: "A setback for the Muslims where they faced casualties, including the loss of Hamza (uncle). A lesson in obedience.", location: "Uhud, Madinah", category: "battles" },
  { year: "627 CE", hijri: "5 AH", title: "Battle of the Trench", description: "The Muslims defended Madinah by digging a trench. A test of patience and strategy.", location: "Madinah", category: "battles" },
  { year: "628 CE", hijri: "6 AH", title: "Treaty of Hudaybiyyah", description: "A peace treaty with the Quraysh that led to more people accepting Islam.", location: "Hudaybiyyah", category: "expansion" },
  { year: "630 CE", hijri: "8 AH", title: "Conquest of Makkah", description: "The peaceful conquest of Makkah. The Prophet forgave his enemies and cleansed the Kaaba of idols.", location: "Makkah", category: "expansion" },
  { year: "630 CE", hijri: "8 AH", title: "Battle of Hunayn", description: "After Makkah, the Muslims faced the tribes of Hawazin and Thaqif. Despite initial setback, they prevailed.", location: "Hunayn", category: "battles" },
  { year: "631 CE", hijri: "9 AH", title: "Delegation Year", description: "Many tribes from across Arabia came to accept Islam. The message spread far and wide.", location: "Arabia", category: "expansion" },
  { year: "632 CE", hijri: "10 AH", title: "Farewell Pilgrimage", description: "The Prophet performed his only Hajj and delivered the famous Farewell Sermon at Arafat.", location: "Arafat", category: "expansion" },
  { year: "632 CE", hijri: "11 AH", title: "Passing of the Prophet \uDFBA", description: "The Prophet Muhammad \uDFBA passed away in Madinah at age 63. His final words were about prayer and mercy.", location: "Madinah", category: "expansion" },
];

const CATEGORIES = [
  { id: "all", label: "All Events" },
  { id: "early", label: "Early Life" },
  { id: "prophethood", label: "Prophethood" },
  { id: "battles", label: "Battles" },
  { id: "expansion", label: "Expansion" },
] as const;

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  early: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  prophethood: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  battles: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  expansion: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
};

function TimelineCard({
  event,
  index,
  isLeft,
}: {
  event: (typeof EVENTS)[0];
  index: number;
  isLeft: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const colors = CATEGORY_COLORS[event.category];

  return (
    <div ref={ref} className="relative mb-8 md:mb-0">
      {/* Timeline dot */}
      <div className="absolute left-0 top-6 z-10 flex items-center justify-center md:left-1/2 md:-translate-x-1/2">
        <div
          className={`h-4 w-4 rounded-full ${colors.dot} ring-4 ring-white shadow-sm`}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1, type: "spring", bounce: 0.2 }}
        className={`ml-8 md:ml-0 ${
          isLeft ? "md:mr-[calc(50%+24px)]" : "md:ml-[calc(50%+24px)]"
        }`}
      >
        <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
          {/* Category accent */}
          <div
            className={`absolute left-0 top-0 h-full w-1 ${colors.dot}`}
          />

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
            >
              <HiOutlineCalendar className="h-3 w-3" />
              {event.year}
            </span>
            {event.hijri && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {event.hijri}
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${colors.bg} ${colors.text}`}
            >
              {event.category}
            </span>
          </div>

          <h3 className="mb-2 text-lg font-bold text-gray-900">
            {event.title}
          </h3>

          <p className="mb-3 text-sm leading-relaxed text-gray-600">
            {event.description}
          </p>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineLocationMarker className="h-3.5 w-3.5" />
            <span>{event.location}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TimelineCardMobile({
  event,
}: {
  event: (typeof EVENTS)[0];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const colors = CATEGORY_COLORS[event.category];

  return (
    <div ref={ref} className="relative mb-6">
      {/* Timeline dot */}
      <div className="absolute left-0 top-6 z-10 flex items-center justify-center">
        <div
          className={`h-4 w-4 rounded-full ${colors.dot} ring-4 ring-white shadow-sm`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1, type: "spring", bounce: 0.2 }}
        className="ml-8"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
          <div
            className={`absolute left-0 top-0 h-full w-1 ${colors.dot}`}
          />

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
            >
              <HiOutlineCalendar className="h-3 w-3" />
              {event.year}
            </span>
            {event.hijri && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {event.hijri}
              </span>
            )}
          </div>

          <h3 className="mb-2 text-lg font-bold text-gray-900">
            {event.title}
          </h3>

          <p className="mb-3 text-sm leading-relaxed text-gray-600">
            {event.description}
          </p>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineLocationMarker className="h-3.5 w-3.5" />
            <span>{event.location}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SeerahPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const timelineRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "all"
      ? EVENTS
      : EVENTS.filter((e) => e.category === activeCategory);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #f0fdf4 0%, #ffffff 30%, #f8fafc 100%)",
      }}
    >
      {/* Geometric pattern overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-conic-gradient(#059669 0% 25%, transparent 0% 50%)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <p
            className="mb-2 text-3xl text-emerald-800 md:text-4xl"
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            السيرة النبوية
          </p>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("seerah.pageTitle")}
          </h1>
          <p className="text-lg text-gray-500">
            {t("seerah.pageSubtitle")}
          </p>
        </motion.div>

        {/* Islamic decorative border */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 rotate-45 bg-emerald-300"
              />
            ))}
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
        </div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
              }`}
            >
              {cat.id === "all" ? t("seerah.allEvents") :
               cat.id === "early" ? t("seerah.earlyLife") :
               cat.id === "prophethood" ? t("seerah.prophethood") :
               cat.id === "battles" ? t("seerah.battles") :
               t("seerah.expansion")}
            </button>
          ))}
        </motion.div>

        {/* Desktop Timeline */}
        <div ref={timelineRef} className="hidden md:block">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-300" />

          <div className="relative space-y-12 py-4">
            <AnimatePresence mode="wait">
              {filtered.map((event, index) => (
                <TimelineCard
                  key={`${event.title}-${index}`}
                  event={event}
                  index={index}
                  isLeft={index % 2 === 0}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-300" />

          <div className="relative py-4">
            <AnimatePresence mode="wait">
              {filtered.map((event, index) => (
                <TimelineCardMobile
                  key={`${event.title}-${index}`}
                  event={event}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <HiOutlineFilter className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-lg text-gray-500">{t("seerah.noEvents")}</p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 border-t border-gray-100 pt-8 text-center"
        >
          {/* Decorative border */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rotate-45 bg-emerald-300"
                />
              ))}
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
          </div>

          <p
            className="mb-2 text-2xl text-gray-600"
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ
          </p>
          <p className="text-sm text-gray-400">
            &ldquo;And We have not sent you, [O Muhammad], except as a mercy to
            the worlds.&rdquo; &mdash; Quran 21:107
          </p>
        </motion.div>
      </div>
    </div>
  );
}
