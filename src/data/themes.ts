import { Theme } from "@/types";

export const themesList: Theme[] = [
  {
    id: "hope",
    name: "Hope",
    nameAr: "أمل",
    nameFr: "Espoir",
    description: "Verses and duas that inspire hope and optimism.",
  },
  {
    id: "patience",
    name: "Patience",
    nameAr: "صبر",
    nameFr: "Patience",
    description: "Teachings on patience during trials.",
  },
  {
    id: "trust",
    name: "Trust",
    nameAr: "توكل",
    nameFr: "Confiance",
    description: "Reliance upon Allah in all matters.",
  },
  {
    id: "mercy",
    name: "Mercy",
    nameAr: "رحمة",
    nameFr: "Miséricorde",
    description: "Allah's infinite mercy and compassion.",
  },
  {
    id: "forgiveness",
    name: "Forgiveness",
    nameAr: "مغفرة",
    nameFr: "Pardon",
    description: "Seeking and granting forgiveness.",
  },
  {
    id: "gratitude",
    name: "Gratitude",
    nameAr: "شكر",
    nameFr: "Gratitude",
    description: "Being thankful for blessings.",
  },
  {
    id: "peace",
    name: "Peace",
    nameAr: "سلام",
    nameFr: "Paix",
    description: "Inner peace through remembrance.",
  },
  {
    id: "guidance",
    name: "Guidance",
    nameAr: "هداية",
    nameFr: "Guidance",
    description: "Seeking the straight path.",
  },
  {
    id: "comfort",
    name: "Comfort",
    nameAr: "طمأنينة",
    nameFr: "Réconfort",
    description: "Finding solace in divine words.",
  },
  {
    id: "healing",
    name: "Healing",
    nameAr: "شفاء",
    nameFr: "Guérison",
    description: "Spiritual and emotional healing.",
  },
  {
    id: "strength",
    name: "Strength",
    nameAr: "قوة",
    nameFr: "Force",
    description: "Inner strength through faith.",
  },
  {
    id: "motivation",
    name: "Motivation",
    nameAr: "تحفيز",
    nameFr: "Motivation",
    description: "Inspiration to take action.",
  },
  {
    id: "protection",
    name: "Protection",
    nameAr: "حماية",
    nameFr: "Protection",
    description: "Seeking Allah's protection.",
  },
];

export function getThemeById(id: string): Theme | undefined {
  return themesList.find((t) => t.id === id);
}

export function getThemeByName(name: string): Theme | undefined {
  return themesList.find(
    (t) => t.name.toLowerCase() === name.toLowerCase()
  );
}
