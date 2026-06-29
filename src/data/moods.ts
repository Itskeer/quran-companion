import { Mood } from "@/types";

export const moods: Mood[] = [
  {
    id: "happy",
    emoji: "😊",
    label: "Happy",
    labelAr: "سعيد",
    labelFr: "Heureux",
    themes: ["Gratitude", "Blessings", "Mercy"],
  },
  {
    id: "sad",
    emoji: "😔",
    label: "Sad",
    labelAr: "حزين",
    labelFr: "Triste",
    themes: ["Comfort", "Patience", "Hope", "Healing"],
  },
  {
    id: "anxious",
    emoji: "😟",
    label: "Anxious",
    labelAr: "قلق",
    labelFr: "Anxieux",
    themes: ["Trust", "Peace", "Comfort", "Hope"],
  },
  {
    id: "angry",
    emoji: "😡",
    label: "Angry",
    labelAr: "غاضب",
    labelFr: "En colère",
    themes: ["Patience", "Forgiveness", "Strength", "Peace"],
  },
  {
    id: "cant-sleep",
    emoji: "😴",
    label: "Can't Sleep",
    labelAr: "أرق",
    labelFr: "Insomnie",
    themes: ["Peace", "Trust", "Protection", "Mercy"],
  },
  {
    id: "heartbroken",
    emoji: "💔",
    label: "Heartbroken",
    labelAr: "مكسور القلب",
    labelFr: "Cœur brisé",
    themes: ["Comfort", "Hope", "Healing", "Patience"],
  },
  {
    id: "lonely",
    emoji: "😞",
    label: "Lonely",
    labelAr: "وحيد",
    labelFr: "Seul",
    themes: ["Comfort", "Hope", "Trust", "Mercy"],
  },
  {
    id: "stressed",
    emoji: "😣",
    label: "Stressed",
    labelAr: "متوتر",
    labelFr: "Stressé",
    themes: ["Peace", "Patience", "Trust", "Hope"],
  },
  {
    id: "confused",
    emoji: "😶",
    label: "Confused",
    labelAr: "حائر",
    labelFr: "Confus",
    themes: ["Guidance", "Peace", "Trust", "Hope"],
  },
  {
    id: "need-guidance",
    emoji: "🤲",
    label: "Need Guidance",
    labelAr: "بحاجة إلى توجيه",
    labelFr: "Besoin de guidance",
    themes: ["Guidance", "Hope", "Mercy", "Protection"],
  },
  {
    id: "grateful",
    emoji: "❤️",
    label: "Grateful",
    labelAr: "شاكر",
    labelFr: "Reconnaissant",
    themes: ["Gratitude", "Blessings", "Mercy", "Hope"],
  },
  {
    id: "motivation",
    emoji: "🌱",
    label: "Want Motivation",
    labelAr: "أريد تحفيزاً",
    labelFr: "Besoin de motivation",
    themes: ["Motivation", "Strength", "Guidance", "Hope"],
  },
];

export function getMoodById(id: string): Mood | undefined {
  return moods.find((m) => m.id === id);
}

export function getMoodsByTheme(theme: string): Mood[] {
  return moods.filter((m) => m.themes.includes(theme));
}
