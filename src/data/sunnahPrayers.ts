export interface SunnahPrayer {
  id: string;
  name: string;
  nameArabic: string;
  rakAhs: number;
  time: string;
  description: string;
  category: "rawatib" | "tahajjud" | "duha" | "istikhara" | "tarawih" | "other";
  isMuakkadah: boolean;
  benefit: string;
}

export const sunnahPrayers: SunnahPrayer[] = [
  {
    id: "rawatib-before-fajr",
    name: "Rawatib before Fajr",
    nameArabic: "الرواتب قبل الفجر",
    rakAhs: 2,
    time: "Before Fajr prayer",
    description: "Two rak'ahs performed before the Fajr prayer. The Prophet (peace be upon him) said: 'The two rak'ahs before Fajr are better than the world and everything in it.'",
    category: "rawatib",
    isMuakkadah: true,
    benefit: "The most beloved voluntary prayer to Allah. Equivalent in reward to the world and all that is in it."
  },
  {
    id: "rawatib-after-dhuhr",
    name: "Rawatib after Dhuhr",
    nameArabic: "الرواتب بعد الظهر",
    rakAhs: 2,
    time: "After Dhuhr prayer",
    description: "Two rak'ahs performed after the Dhuhr prayer. Part of the twelve rak'ahs of daily Sunnah prayers.",
    category: "rawatib",
    isMuakkadah: true,
    benefit: "Part of the twelve rak'ahs upon which a house is built in Paradise for those who consistently perform them."
  },
  {
    id: "rawatib-after-maghrib",
    name: "Rawatib after Maghrib",
    nameArabic: "الرواتب بعد المغرب",
    rakAhs: 2,
    time: "After Maghrib prayer",
    description: "Two rak'ahs performed after the Maghrib prayer. One of the emphasized Sunnah prayers.",
    category: "rawatib",
    isMuakkadah: true,
    benefit: "Protection from entering Hellfire. Part of the twelve Sunnah rak'ahs that ensure a house in Paradise."
  },
  {
    id: "rawatib-after-isha",
    name: "Rawatib after Isha",
    nameArabic: "الرواتب بعد العشاء",
    rakAhs: 2,
    time: "After Isha prayer",
    description: "Two rak'ahs performed after the Isha prayer. The last of the twelve Sunnah mu'akkadah rak'ahs of the day.",
    category: "rawatib",
    isMuakkadah: true,
    benefit: "Completes the twelve Sunnah rak'ahs that guarantee a house in Paradise. Protection from sin and Allah's displeasure."
  },
  {
    id: "rawatib-before-jumuah",
    name: "Rawatib before Jumu'ah",
    nameArabic: "الرواتب قبل الجمعة",
    rakAhs: 4,
    time: "Before Jumu'ah (Friday) prayer",
    description: "Four rak'ahs performed before the Friday congregational prayer. Ghair Muakkadah (less emphasized).",
    category: "rawatib",
    isMuakkadah: false,
    benefit: "Increases one's reward for the Friday prayer and serves as preparation for the blessed gathering."
  },
  {
    id: "duha",
    name: "Salat al-Duha",
    nameArabic: "صلاة الضحى",
    rakAhs: 2,
    time: "Between sunrise and Dhuhr (mid-morning)",
    description: "Voluntary prayer performed when the sun rises and becomes high, typically 15-20 minutes after sunrise until just before Dhuhr. Minimum 2 rak'ahs, up to 8.",
    category: "duha",
    isMuakkadah: false,
    benefit: "Equivalent to giving charity for every bone in the body. Allah forgives sins committed during the day as the sun rises. Also called 'the prayer of the repentant.'"
  },
  {
    id: "tahajjud",
    name: "Tahajjud",
    nameArabic: "التهجد",
    rakAhs: 2,
    time: "Last third of the night (before Fajr)",
    description: "Night prayer performed after sleeping, during the last third of the night before Fajr. Consists of pairs of rak'ahs with salam after each pair. A special time when Allah descends to the lowest heaven.",
    category: "tahajjud",
    isMuakkadah: false,
    benefit: "The closest a servant can be to Allah. A sign of faith, a means of intercession on the Day of Judgment, and protection from Hellfire. Allah says: 'Their sides forsake their beds, invoking their Lord in fear and hope.' (32:16)"
  },
  {
    id: "tarawih",
    name: "Tarawih",
    nameArabic: "التراويح",
    rakAhs: 20,
    time: "After Isha prayer during Ramadan only",
    description: "Special congregational prayers performed only during Ramadan after the Isha prayer. Traditionally 20 rak'ahs, performed in pairs with rest intervals. The entire Quran can be completed over the month.",
    category: "tarawih",
    isMuakkadah: true,
    benefit: "Whoever stands in prayer during Ramadan with faith and seeking reward, all their previous sins will be forgiven. A special mercy and blessing of the month of Ramadan."
  }
];
