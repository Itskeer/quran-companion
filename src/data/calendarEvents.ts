export interface CalendarEvent {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  hijriMonth: number;
  hijriDay: number;
  significance: "major" | "moderate" | "minor";
  category: "worship" | "historical" | "celebration";
  icon: string;
}

export const islamicCalendarEvents: CalendarEvent[] = [
  {
    id: "muharram-1-new-year",
    name: "Islamic New Year",
    nameArabic: "رأس السنة الهجرية",
    description: "The beginning of the new Hijri year, marking the migration of Prophet Muhammad (peace be upon him) from Makkah to Madinah.",
    hijriMonth: 1,
    hijriDay: 1,
    significance: "major",
    category: "historical",
    icon: "🌙"
  },
  {
    id: "muharram-10-ashura",
    name: "Day of Ashura",
    nameArabic: "يوم عاشوراء",
    description: "The 10th of Muharram, a day of fasting commemorating the deliverance of Prophet Musa (Moses) from Pharaoh. Also a day of mourning for the martyrdom of Husayn ibn Ali at Karbala.",
    hijriMonth: 1,
    hijriDay: 10,
    significance: "major",
    category: "worship",
    icon: "🤲"
  },
  {
    id: "muharram-9-tasu",
    name: "Tasu'a",
    nameArabic: "تاسوعاء",
    description: "The 9th of Muharram, the day before Ashura. Recommended to fast alongside the 10th.",
    hijriMonth: 1,
    hijriDay: 9,
    significance: "moderate",
    category: "worship",
    icon: "🤲"
  },
  {
    id: "rabi-al-awwal-12-mawlid",
    name: "Mawlid an-Nabi",
    nameArabic: "المولد النبوي",
    description: "The birth of Prophet Muhammad (peace be upon him), celebrated with gatherings, prayers, and remembrance of his life and teachings.",
    hijriMonth: 3,
    hijriDay: 12,
    significance: "major",
    category: "celebration",
    icon: "🌟"
  },
  {
    id: "rajab-1-start",
    name: "Start of Rajab",
    nameArabic: "بداية رجب",
    description: "The beginning of one of the four sacred months in Islam. A time for increased worship and seeking forgiveness.",
    hijriMonth: 7,
    hijriDay: 1,
    significance: "minor",
    category: "worship",
    icon: "🕌"
  },
  {
    id: "rajab-27-isra-miraj",
    name: "Isra and Mi'raj",
    nameArabic: "الإسراء والمعراج",
    description: "The miraculous night journey of Prophet Muhammad (peace be upon him) from Makkah to Jerusalem and his ascension through the heavens, where the five daily prayers were prescribed.",
    hijriMonth: 7,
    hijriDay: 27,
    significance: "major",
    category: "historical",
    icon: "✨"
  },
  {
    id: "shaban-1-start",
    name: "Start of Sha'ban",
    nameArabic: "بداية شعبان",
    description: "The beginning of the eighth Islamic month, a month in which the Prophet (peace be upon him) would increase his voluntary fasting.",
    hijriMonth: 8,
    hijriDay: 1,
    significance: "minor",
    category: "worship",
    icon: "🌙"
  },
  {
    id: "shaban-15-shab-e-barat",
    name: "Shab e-Barat",
    nameArabic: "ليلة النصف من شعبان",
    description: "The Night of Forgiveness, believed to be when Allah decides the fate of people for the coming year. A night of prayer, fasting, and seeking mercy.",
    hijriMonth: 8,
    hijriDay: 15,
    significance: "major",
    category: "worship",
    icon: "🌌"
  },
  {
    id: "ramadan-1-start",
    name: "Start of Ramadan",
    nameArabic: "بداية رمضان",
    description: "The beginning of the holy month of Ramadan, the month of fasting, spiritual reflection, and increased devotion.",
    hijriMonth: 9,
    hijriDay: 1,
    significance: "major",
    category: "worship",
    icon: "🕌"
  },
  {
    id: "ramadan-15-mid",
    name: "Mid-Ramadan",
    nameArabic: "نصف رمضان",
    description: "The 15th of Ramadan, the midpoint of the blessed month. A time to evaluate one's progress in worship and increase devotion.",
    hijriMonth: 9,
    hijriDay: 15,
    significance: "moderate",
    category: "worship",
    icon: "🌙"
  },
  {
    id: "ramadan-21-third-ashra",
    name: "Third Ashra of Ramadan",
    nameArabic: "العشر الأخير من رمضان",
    description: "The last ten nights of Ramadan, the most blessed nights of the year. Laylat al-Qadr is sought in these nights, described as better than a thousand months.",
    hijriMonth: 9,
    hijriDay: 21,
    significance: "major",
    category: "worship",
    icon: "⭐"
  },
  {
    id: "ramadan-27-laylat-al-qadr",
    name: "Laylat al-Qadr",
    nameArabic: "ليلة القدر",
    description: "The Night of Power, when the Quran was first revealed. Better than a thousand months of worship. Observed in the odd nights of the last ten days of Ramadan.",
    hijriMonth: 9,
    hijriDay: 27,
    significance: "major",
    category: "worship",
    icon: "💫"
  },
  {
    id: "shawwal-1-eid-al-fitr",
    name: "Eid al-Fitr",
    nameArabic: "عيد الفطر",
    description: "The Festival of Breaking the Fast, celebrated at the end of Ramadan. Muslims gather for special prayers, give Zakat al-Fitr, and celebrate with family and community.",
    hijriMonth: 10,
    hijriDay: 1,
    significance: "major",
    category: "celebration",
    icon: "🎉"
  },
  {
    id: "dhul-qadah-1-start",
    name: "Start of Dhul Qa'dah",
    nameArabic: "بداية ذو القعدة",
    description: "The beginning of the eleventh Islamic month, one of the four sacred months. A month in which fighting was traditionally prohibited.",
    hijriMonth: 11,
    hijriDay: 1,
    significance: "minor",
    category: "worship",
    icon: "🌙"
  },
  {
    id: "dhul-hijjah-9-arafah",
    name: "Day of Arafah",
    nameArabic: "يوم عرفة",
    description: "The 9th of Dhul Hijjah, the day when pilgrims stand at the plain of Arafah during Hajj. Fasting on this day expiates sins of the previous and coming year.",
    hijriMonth: 12,
    hijriDay: 9,
    significance: "major",
    category: "worship",
    icon: "🕋"
  },
  {
    id: "dhul-hijjah-10-eid-al-adha",
    name: "Eid al-Adha",
    nameArabic: "عيد الأضحى",
    description: "The Festival of Sacrifice, the most important Eid. Commemorates Ibrahim's willingness to sacrifice his son Ismail. Muslims sacrifice an animal and distribute meat to the needy.",
    hijriMonth: 12,
    hijriDay: 10,
    significance: "major",
    category: "celebration",
    icon: "🐑"
  },
  {
    id: "dhul-hijjah-11-tashreeq",
    name: "Days of Tashreeq",
    nameArabic: "أيام التشريق",
    description: "The 11th, 12th, and 13th of Dhul Hijjah, days of remembrance and celebration following Eid al-Adha. Prohibition of fasting during these days.",
    hijriMonth: 12,
    hijriDay: 11,
    significance: "moderate",
    category: "worship",
    icon: "📿"
  },
  {
    id: "dhul-hijjah-12-yawm-al-nahr",
    name: "Yawm al-Nahr",
    nameArabic: "يوم النحر",
    description: "The Day of Sacrifice, the 12th of Dhul Hijjah. The second day of Tashreeq and the final day of the Hajj rites.",
    hijriMonth: 12,
    hijriDay: 12,
    significance: "moderate",
    category: "historical",
    icon: "🕋"
  },
  {
    id: "dhul-hijjah-18-tarwiyah",
    name: "Yawm al-Tarwiyah",
    nameArabic: "يوم التروية",
    description: "The 8th of Dhul Hijjah, when pilgrims begin moving from Makkah to Mina, gathering water for the journey ahead. The first day of Hajj.",
    hijriMonth: 12,
    hijriDay: 8,
    significance: "moderate",
    category: "historical",
    icon: "🕋"
  },
  {
    id: "hijri-new-year",
    name: "Hijri New Year",
    nameArabic: "السنة الهجرية",
    description: "The anniversary of the Hijra, when Prophet Muhammad (peace be upon him) migrated from Makkah to Madinah in 622 CE, establishing the first Muslim community.",
    hijriMonth: 1,
    hijriDay: 1,
    significance: "major",
    category: "historical",
    icon: "🌙"
  }
];
