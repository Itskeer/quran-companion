"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTranslation } from "@/i18n/useTranslation";
import {
  HiOutlineShare,
  HiOutlineBookOpen,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
} from "react-icons/hi";

interface Story {
  title: string;
  category: string;
  story: string;
  lesson: string;
}

const STORIES: Story[] = [
  {
    title: "The Cat and the Prayer",
    category: "Compassion",
    story: "A Companion of the Prophet noticed that a cat was sleeping on his sleeve. Rather than disturb the cat, he cut off the sleeve. The Prophet said: 'Ibn Umar, you have shown compassion.'",
    lesson: "Compassion extends to all creatures.",
  },
  {
    title: "The Bedouin and the Camel",
    category: "Kindness",
    story: "A man asked the Prophet: 'O Messenger of Allah, should I tie my camel and trust in Allah, or should I leave her untied and trust in Allah?' The Prophet said: 'Tie her, then trust in Allah.'",
    lesson: "Trust in Allah does not mean neglecting responsibility.",
  },
  {
    title: "The Boy Who Fed a Dog",
    category: "Charity",
    story: "A man was forgiven all his sins because he gave water to a thirsty dog by climbing down a well. The Prophet said: 'Allah appreciated his deed and forgave him.'",
    lesson: "Even small acts of kindness are rewarded.",
  },
  {
    title: "The Old Woman's Prayer",
    category: "Patience",
    story: "An old woman threw trash on the Prophet every day. One day, no trash was thrown. He went to check on her and found she was ill. He visited her and she accepted Islam.",
    lesson: "Respond to evil with good.",
  },
  {
    title: "The Merchant and the Orphan",
    category: "Generosity",
    story: "A merchant was told his goods had arrived by sea. He was so happy he said 'O Allah, You are my partner in my business.' He then gave all profits to an orphan.",
    lesson: "True generosity comes from trusting Allah's provision.",
  },
  {
    title: "The Student Who Walked Miles",
    category: "Knowledge",
    story: "A man walked a long distance to learn a single hadith. When asked why, he said: 'If I die before learning it, I will have died seeking knowledge.'",
    lesson: "The pursuit of knowledge is a form of worship.",
  },
  {
    title: "The Beggar's Dua",
    category: "Gratitude",
    story: "A beggar thanked Allah for his sight, hearing, and health. The Prophet said: 'He has built his house in Paradise with those three words.'",
    lesson: "Gratitude transforms even poverty into richness.",
  },
  {
    title: "The Thief and the Night Prayer",
    category: "Repentance",
    story: "A man stole repeatedly. He asked the Prophet for help. The Prophet taught him to pray at night. The man's heart was changed and he never stole again.",
    lesson: "Night prayer transforms the heart.",
  },
  {
    title: "The Mother and the Three Children",
    category: "Sacrifice",
    story: "A mother left her three children with a neighbor to go for Hajj. She never returned. The children were told she was in Jannah. They accepted her sacrifice.",
    lesson: "A mother's sacrifice is beyond measure.",
  },
  {
    title: "The King's Dream",
    category: "Faith",
    story: "A king dreamed he was standing before Allah and was asked about his wealth. He said it was all from Allah. Allah said: 'Your wealth was indeed from Us, but what did you do with it?'",
    lesson: "We will be questioned about our blessings.",
  },
  {
    title: "The Scholar's Simplicity",
    category: "Humility",
    story: "A great scholar wore patched clothes. Someone asked why. He said: 'The earth is enough for me to sit on, and my Lord is enough for me to serve.'",
    lesson: "True scholars are humble.",
  },
  {
    title: "The Fisherman's Trust",
    category: "Trust",
    story: "A fisherman cast his net and caught nothing. He said 'Alhamdulillah' and cast again. His companion asked why he thanked Allah for catching nothing. He said: 'Because He allowed me to cast again.'",
    lesson: "Gratitude in every situation.",
  },
  {
    title: "The Orphan's Cake",
    category: "Charity",
    story: "A girl lost her parents. She baked a cake and brought it to the Prophet's house. The Prophet ate it and made dua for her.",
    lesson: "Even a small gift given with sincerity is accepted.",
  },
  {
    title: "The Traveler's Well",
    category: "Compassion",
    story: "A traveler was dying of thirst. He found a well but couldn't reach the water. A passerby drew water for him. The Prophet said: 'He is my brother in faith.'",
    lesson: "Helping others is a bond of faith.",
  },
  {
    title: "The Gardener's Legacy",
    category: "Continuous Charity",
    story: "A man planted a date palm tree. After he died, people ate from it. The Prophet said: 'Whoever plants a tree, it is as if he planted a charity that will be rewarded until the Day of Judgment.'",
    lesson: "Plant the seeds of good that outlast you.",
  },
];

const CATEGORIES = [
  "All",
  "Compassion",
  "Kindness",
  "Charity",
  "Patience",
  "Knowledge",
  "Gratitude",
  "Faith",
  "Humility",
  "Trust",
  "Generosity",
  "Repentance",
  "Sacrifice",
  "Continuous Charity",
];

const CATEGORY_COLORS: Record<string, string> = {
  Compassion: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
  Kindness: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  Charity: "bg-emerald/10 dark:bg-emerald/20 text-emerald dark:text-emerald-400",
  Patience: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  Knowledge: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  Gratitude: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  Faith: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  Humility: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
  Trust: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  Generosity: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  Repentance: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  Sacrifice: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  "Continuous Charity": "bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400",
};

function estimateReadingTime(text: string, t: (key: string) => string): string {
  const words = text.split(" ").length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} ${t("common.minutes")} read`;
}

export default function StoriesPage() {
  const { t } = useTranslation();
  usePageTitle(t("stories.title"));
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStories = useMemo(() => {
    let result = STORIES;
    if (selectedCategory !== "All") {
      result = result.filter((s) => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.story.toLowerCase().includes(q) ||
          s.lesson.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  const handleShare = (story: Story) => {
    const text = `${story.title}\n\n${story.story}\n\nLesson: ${story.lesson}\n\n— Islamic Stories from Quran Companion`;
    if (navigator.share) {
      navigator.share({ title: story.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white">{t("stories.title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t("stories.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("stories.search")}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald/30 text-sm"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="overflow-x-auto -mx-4 px-4"
        >
          <div className="flex gap-2 min-w-max pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald text-white"
                    : "bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStories.map((story, i) => {
            const expanded = expandedIndex === i;
            const catColor = CATEGORY_COLORS[story.category] || "bg-gray-100 text-gray-600";
            const readTime = estimateReadingTime(story.story, t);

            return (
              <motion.div
                key={`${story.title}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                layout
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedIndex(expanded ? null : i)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${catColor}`}>
                      {story.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <HiOutlineBookOpen className="w-3 h-3" />
                      {readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {story.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {story.story}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(story);
                      }}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-emerald transition-colors"
                    >
                      <HiOutlineShare className="w-3.5 h-3.5" />
                      {t("stories.share")}
                    </button>
                    <div className="flex items-center gap-1 text-xs text-emerald">
                      {expanded ? (
                        <>{t("stories.less")} <HiOutlineChevronLeft className="w-3 h-3 rotate-[-90deg]" /></>
                      ) : (
                        <>{t("stories.readMoreLabel")} <HiOutlineChevronRight className="w-3 h-3 rotate-90" /></>
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700/50">
                        <div className="pt-4">
                          <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed font-serif italic mb-4">
                            &ldquo;{story.story}&rdquo;
                          </p>

                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30">
                            <div className="flex items-center gap-2 mb-2">
                              <HiOutlineLightningBolt className="w-4 h-4 text-amber-500" />
                              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                {t("stories.lesson")}
                              </p>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                              {story.lesson}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {filteredStories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <HiOutlineBookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t("stories.noResults")}</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-3 text-sm text-emerald hover:underline"
            >
              {t("stories.clearFilters")}
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/5 border border-emerald/10">
            <HiOutlineHeart className="w-4 h-4 text-emerald" />
            <span className="text-xs text-emerald font-medium">
              {STORIES.length} {t("stories.count")}
            </span>
          </div>
        </motion.div>

        <div className="pb-8 text-center">
          <p className="text-xs text-gray-400 italic">
            &ldquo;And We have certainly made the Quran easy to remember.&rdquo;
            <br />— Quran 54:17
          </p>
        </div>
      </div>
    </div>
  );
}
