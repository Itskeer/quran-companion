"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineHeart,
  HiOutlineChevronDown,
  HiOutlineBookOpen,
} from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

const PROPHETS = [
  { name: "Adam", arabic: "\u0622\u062F\u0645", title: "The First Human", story: "Created from clay, given knowledge of all things. His son Habil was righteous while Qabil chose envy.", lesson: "Obedience to Allah brings honor; envy destroys." },
  { name: "Idris", arabic: "\u0625\u062F\u0631\u064A\u0633", title: "The Patient One", story: "Known for his knowledge and patience. He was raised to a high station by Allah.", lesson: "Patience and knowledge elevate a person." },
  { name: "Nuh", arabic: "\u0646\u0648\u062D", title: "The Patient Caller", story: "Called his people to Allah for 950 years. Built the ark and was saved with the believers.", lesson: "True faith persists despite rejection." },
  { name: "Hud", arabic: "\u0647\u0648\u062F", title: "The Guide", story: "Sent to the people of \u2018Ad who were powerful but arrogant. They were destroyed for their pride.", lesson: "Power without faith leads to destruction." },
  { name: "Salih", arabic: "\u0635\u0627\u0644\u062D", title: "The Miracle Bringer", story: "Sent to Thamud who carved homes in mountains. The she-camel was his sign, but they hamstrung it.", lesson: "Respect the signs of Allah." },
  { name: "Ibrahim", arabic: "\u0625\u0628\u0631\u0627\u0647\u064A\u0645", title: "The Friend of Allah", story: "Destroyed idols, argued with his father, was thrown into fire but Allah made it cool. Built the Kaaba.", lesson: "True monotheism requires sacrifice." },
  { name: "Ismail", arabic: "\u0625\u0633\u0645\u0627\u0639\u064A\u0644", title: "The Sacrifice", story: "Willingly submitted to Allah\u2019s command for sacrifice. His father Ibrahim prepared to sacrifice him.", lesson: "Total submission to Allah\u2019s will." },
  { name: "Ishaq", arabic: "\u0625\u0633\u062D\u0627\u0642", title: "The Prophet of Mercy", story: "Son of Ibrahim, father of Yaqub. Known for his gentle nature and prophethood.", lesson: "Mercy is a sign of true faith." },
  { name: "Yaqub", arabic: "\u0639\u0642\u0648\u0628", title: "The Father of Prophets", story: "Father of 12 sons including Yusuf. Showed immense patience when separated from his beloved son.", lesson: "Patience in trials brings relief." },
  { name: "Yusuf", arabic: "\u064A\u0648\u0633\u0641", title: "The Handsome Prophet", story: "Thrown in well by brothers, taken to Egypt, tempted by the wife of Al-Aziz, became minister. Reunited with family.", lesson: "Allah\u2019s plan is always best." },
  { name: "Ayyub", arabic: "\u0623\u064A\u0648\u0628", title: "The Patient Sufferer", story: "Lost wealth, children, and health but never complained about Allah. Was eventually restored.", lesson: "Patience through suffering is rewarded." },
  { name: "Yunus", arabic: "\u064A\u0648\u0646\u0633", title: "The Prophet of the Whale", story: "Swallowed by a whale after fleeing his people. Prayed from the belly of the whale and was delivered.", lesson: "Never give up hope in Allah." },
  { name: "Shu\u2018ayb", arabic: "\u0634\u0639\u064A\u0628", title: "The Eloquent Prophet", story: "Sent to Madyan who cheated in trade. His eloquent preaching was rejected.", lesson: "Honesty in trade is a sign of faith." },
  { name: "Musa", arabic: "\u0645\u0648\u0633\u0649", title: "The Speaker to Allah", story: "Saved from Pharaoh as a baby, spoke directly to Allah at the burning bush, led Israelites out of Egypt.", lesson: "Allah\u2019s help comes in unexpected ways." },
  { name: "Harun", arabic: "\u0647\u0627\u0631\u0648\u0646", title: "The Helper", story: "Brother of Musa, spoke on his behalf. Served as prophet alongside Musa.", lesson: "Support your brother in good causes." },
  { name: "Dawud", arabic: "\u062F\u0627\u0648\u062F", title: "The King Prophet", story: "Given the Zabur (Psalms), defeating Jalut (Goliath), given the kingdom and judgment.", lesson: "Authority comes with responsibility." },
  { name: "Sulaiman", arabic: "\u0633\u0644\u064A\u0645\u0627\u0646", title: "The Wise King", story: "Given control over jinn, wind, and animals. Built the Temple in Jerusalem with unmatched wisdom.", lesson: "Wisdom is the greatest gift." },
  { name: "Ilyas", arabic: "\u0625\u0644\u064A\u0627\u0633", title: "The Fire Caller", story: "Called the people of Baal to worship Allah alone. A prophet of persistence.", lesson: "Stand firm in truth." },
  { name: "Al-Yasa", arabic: "\u0627\u0644\u064A\u0633\u0639", title: "The Successor", story: "Continued the mission of Ilyas. Known for his knowledge and kindness.", lesson: "Knowledge is meant to be shared." },
  { name: "Yusuf\u2019s Brothers", arabic: "", title: "The Repentant", story: "Jealousy led them to throw Yusuf in a well. Later, they repented and were forgiven.", lesson: "Repentance erases sins." },
  { name: "Lut", arabic: "\u0644\u0648\u0637", title: "The Righteous Stranger", story: "Sent to a people who committed immoral acts. His wife disobeyed and was destroyed with them.", lesson: "Be firm even among the corrupt." },
  { name: "Zakariya", arabic: "\u0632\u0643\u0631\u064A\u0627", title: "The Prayer for a Child", story: "Prayed for a child in old age. Allah granted him Yahya, a prophet from pure lineage.", lesson: "Never lose hope in Allah\u2019s mercy." },
  { name: "Yahya", arabic: "\u064A\u062D\u064A\u0649", title: "The Forerunner", story: "Prepared the way for Isa (Jesus). Known for his piety and knowledge from a young age.", lesson: "Youth is no barrier to righteousness." },
  { name: "Isa", arabic: "\u0639\u064A\u0633\u0649", title: "The Spirit of Allah", story: "Born to Maryam (Mary) without a father. Performed miracles by Allah\u2019s permission. Raised to heaven.", lesson: "Miracles are signs of Allah\u2019s power." },
  { name: "Muhammad \uDFBA", arabic: "\u0645\u062D\u0645\u062F", title: "The Final Messenger", story: "The seal of the prophets. Brought the Quran, the final revelation, for all of humanity until the Day of Judgment.", lesson: "Follow the final messenger for guidance." },
];

function ProphetCard({
  prophet,
  isExpanded,
  onToggle,
  isFavorite,
  onToggleFavorite,
}: {
  prophet: (typeof PROPHETS)[0];
  isExpanded: boolean;
  onToggle: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      {/* Top accent border */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />

      <div className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            {prophet.arabic && (
              <p
                className="mb-1 text-2xl text-gray-800"
                style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
              >
                {prophet.arabic}
              </p>
            )}
            <h3 className="text-lg font-bold text-gray-900">{prophet.name}</h3>
            <p className="text-sm italic text-gray-500">{prophet.title}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`rounded-full p-1.5 transition-colors ${
              isFavorite
                ? "bg-red-50 text-red-500"
                : "bg-gray-50 text-gray-300 hover:text-red-400"
            }`}
          >
            <HiOutlineHeart className="h-4 w-4" />
          </button>
        </div>

        {/* Brief story */}
        <p className="mb-3 text-sm leading-relaxed text-gray-600">
          {prophet.story}
        </p>

        {/* Expand button */}
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-between rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <span className="flex items-center gap-2">
            <HiOutlineBookOpen className="h-4 w-4" />
            {isExpanded ? t("prophets.hideLesson") : t("prophets.readLesson")}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <HiOutlineChevronDown className="h-4 w-4" />
          </motion.div>
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  {t("prophets.lesson")}
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {prophet.lesson}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ProphetsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("prophet-favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("prophet-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const filteredProphets = useMemo(() => {
    let result = PROPHETS;
    if (showFavoritesOnly) {
      result = result.filter((p) => favorites.includes(p.name));
    }
    if (!search.trim()) return result;
    const q = search.toLowerCase();
    return result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.story.toLowerCase().includes(q) ||
        p.lesson.toLowerCase().includes(q)
    );
  }, [search, favorites, showFavoritesOnly]);

  const toggleFavorite = (name: string) => {
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

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

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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
            قصص الأنبياء
          </p>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("prophets.title")}
          </h1>
          <p className="text-lg text-gray-500">
            {t("prophets.subtitle")}
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("prophets.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100"
              >
                <HiOutlineX className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition-all ${
              showFavoritesOnly
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:text-red-500"
            }`}
          >
            <HiOutlineHeart
              className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`}
            />
            {showFavoritesOnly ? t("prophets.showingFavorites") : t("common.favorites")}
          </button>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredProphets.length}{" "}
            {filteredProphets.length !== 1 ? t("prophets.prophets") : t("prophets.prophet")}
            {showFavoritesOnly && ` ${t("prophets.inFavorites")}`}
          </p>
          {favorites.length > 0 && (
            <p className="text-sm text-gray-500">
              {favorites.length} {t("prophets.favorited")}
            </p>
          )}
        </div>

        {/* Prophets Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProphets.map((prophet, index) => (
              <ProphetCard
                key={prophet.name}
                prophet={prophet}
                isExpanded={expandedIndex === index}
                onToggle={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                isFavorite={favorites.includes(prophet.name)}
                onToggleFavorite={() => toggleFavorite(prophet.name)}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProphets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <HiOutlineSearch className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-lg text-gray-500">{t("prophets.noProphets")}</p>
            <p className="text-sm text-gray-400">
              {t("prophets.tryDifferent")}
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 border-t border-gray-100 pt-8 text-center"
        >
          <p
            className="mb-1 text-2xl text-gray-600"
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            سلام على المرسلين
          </p>
          <p className="text-sm text-gray-400">
            &ldquo;Peace be upon the messengers.&rdquo; &mdash; Quran 37:181
          </p>
        </motion.div>
      </div>
    </div>
  );
}
