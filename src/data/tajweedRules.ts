export interface TajweedRule {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  color: string;
  examples: string[];
  category: "pronunciation" | "elongation" | "nasalization" | "stops" | "special";
  tips: string;
}

export const tajweedRules: TajweedRule[] = [
  {
    id: "madd",
    name: "Madd (Elongation)",
    nameArabic: "المد",
    description:
      "Elongation of a vowel sound. The duration depends on the type: 2 counts (natural), 4 counts (obligatory with hamzah or sukun), or 5 counts (mandatory in certain recitations).",
    color: "#e74c3c",
    examples: [
      "سَمَاوَاتِ (Samawat) - natural elongation",
      "آمَنُوآ (Aamanuu) - mandatory 5-count",
      "كِتَابِي (Kitaabi) - obligatory 4-count",
    ],
    category: "elongation",
    tips: "Count elongation in chest movements, not seconds. 2 counts is the baseline; longer durations require specific following letters.",
  },
  {
    id: "ghunnah",
    name: "Ghunnah (Nasalization)",
    nameArabic: "الغُنَّة",
    description:
      "Nasalization of sound held for 2 counts. Occurs on nūn sākinah and tā' marbūṭah when not affected by other rules like Idghām or Izhar.",
    color: "#3498db",
    examples: [
      "مِنْ (min) - nūn sākinah with ghunnah",
      "بَعْنَ (ba'na) - before letters of Idghām",
      "عَنْ (an) - ghunnah in standard pronunciation",
    ],
    category: "nasalization",
    tips: "Let the sound resonate in your nose for 2 counts. Ghunnah is maintained unless another rule overrides it.",
  },
  {
    id: "qalqalah",
    name: "Qalqalah (Echoing)",
    nameArabic: "القَلْقَلَة",
    description:
      "An echoing or bouncing sound produced when the five Qalqalah letters carry sukūn: ب (bā'), ج (jīm), د (dāl), t (tā'), ظ (ẓā').",
    color: "#f39c12",
    examples: [
      "عَذَابُ ('adhaab) - bā' with sukūn",
      "مَجْدِ (majd) - jīm with sukūn",
      "شَدَدْ (shadad) - dāl with sukūn",
    ],
    category: "pronunciation",
    tips: "The echo is strongest on the edge of the letter. Practice with: ابْتَعِذْ (ibta'idh). Apply light Qalqalah in the middle of a word and full Qalqalah at the end.",
  },
  {
    id: "idgham",
    name: "Idgham (Merging)",
    nameArabic: "الإِدْغَام",
    description:
      "Merging of nūn sākinah or tā' marbūṭah with the six Idgham letters: ي, ر, م, ل, و, ن. Two types: with ghunnah (ي ر م ل) and without ghunnah (و ن).",
    color: "#2ecc71",
    examples: [
      "مِنْ رَبِّ (min rabb) - merging with rā'",
      "عَلَيْهِمْ (alayhim) - lām merges with mīm",
      "سَمِيعٌ وَ (sami'un wa) - merging without ghunnah",
    ],
    category: "pronunciation",
    tips: "Memorize the Idgham letters: يَرْمُونَ (YaRmuun). Letters ي ر م ل carry ghunnah during merging; و ن do not.",
  },
  {
    id: "ikhfa",
    name: "Ikhfa (Concealment)",
    nameArabic: "الإِخْفَاء",
    description:
      "Concealment of the nūn sākinah sound when followed by one of 15 letters, holding ghunnah for 2 counts while preparing to pronounce the next letter.",
    color: "#9b59b6",
    examples: [
      "مِنْ قَوْمِ (min qawm) - before ق",
      "بَعْدِ (ba'd) - before د",
      "عَنْكُمْ ('ankum) - before ك",
    ],
    category: "nasalization",
    tips: "Ikhfa letters: ت ث ج د ذ ز س ش ص ض ط ظ ف ق. Your tongue prepares for the next letter while ghunnah is held.",
  },
  {
    id: "izhar",
    name: "Izhar (Clear Pronunciation)",
    nameArabic: "الإِظْهَار",
    description:
      "Clear pronunciation of nūn sākinah when followed by one of six throat letters: أ (hamzah), ه, ع, غ, ح, خ. Ghunnah is removed.",
    color: "#1abc9c",
    examples: [
      "مِنْ أَجْلِ (min ajl) - before hamzah",
      "عَنْ هُودً ('an hood) - before hā'",
      "بَعْدَ عَذَابٍ ('ba'da 'adhaab) - before 'ayn",
    ],
    category: "pronunciation",
    tips: "Remember the phrase: أَعْحَجَّهُ - the six Izhar letters. The nūn is pronounced clearly without any nasalization.",
  },
  {
    id: "madd-arid-lissukun",
    name: "Madd Arid Lissukun",
    nameArabic: "المد العارض للسكون",
    description:
      "Temporary elongation of 2 or 4 counts when a vowel letter is followed by a letter that temporarily receives sukūn due to stopping (waqf).",
    color: "#e67e22",
    examples: [
      "بِسْمِ stopping at بِسْمِي - temporary elongation",
      "الرَّحْمَنِ stopping at الرَّحْمَنْ - elongation extends",
      "عَالَمِينَ stopping at عَالَمِينْ - 4-count extends",
    ],
    category: "elongation",
    tips: "This rule only applies when you STOP at a word. If you continue reciting, the normal vowel duration applies. The elongation is 'arid' (temporary).",
  },
  {
    id: "madd-munfasil",
    name: "Madd Munfasil (Separated Elongation)",
    nameArabic: "المد المنفصل",
    description:
      "Elongation occurring at the junction of two words, where the first ends with a vowel and the second begins with hamzah. Minimum 2 counts, recommended 4 counts.",
    color: "#c0392b",
    examples: [
      "جَاءَ أَمْرُ (jaa'a amru) - separated hamzah",
      "سَوْفَ أَعْذِبُ (sawfa a'dhibu) - between words",
      "ذَلِكَ أَمْرُ (dhalika amru) - vowel meets hamzah",
    ],
    category: "elongation",
    tips: "Madd Munfasil is 'recommended' (mustaḥabb) to extend 4 counts but not sinful if shortened to 2. In mandatory pausing it becomes 4 or 6.",
  },
  {
    id: "waqf",
    name: "Waqf (Stopping)",
    nameArabic: "الوَقْف",
    description:
      "Rules for properly stopping or pausing during recitation. Includes mandatory stops (waqf lazim), recommended stops (waqf mustaḥabb), and prohibited stops (waqf mamnū').",
    color: "#34495e",
    examples: [
      "مَوْقِفَ الزَّرْعِ - pause at clear meaning",
      "لا توقف في وسط الآية - do not stop mid-verse",
      "الجيم = جيد = permissible stop",
    ],
    category: "stops",
    tips: "Golden rule: never stop where the meaning is incomplete. Look for pause signs: مـ (must stop), ج (permissible), صـ (recommended), قـ (allowed with caution).",
  },
  {
    id: "basmalah",
    name: "Basmalah",
    nameArabic: "البسملة",
    description:
      "The phrase 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ' recited at the beginning of every surah except At-Tawbah. It is a complete verse in Surah Al-Fatiha.",
    color: "#16a085",
    examples: [
      "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ - every surah start",
      "Recited with Basmalah before each prayer unit",
      "Its recitation is Sunnah before reading Quran",
    ],
    category: "special",
    tips: "The Basmalah is not recited loudly in the second unit of Fatiha - it is said silently between the two surahs. Recite it when opening the mushaf.",
  },
  {
    id: "lam-shamsiyyah",
    name: "Lam Shamsiyyah",
    nameArabic: "اللام الشمسية",
    description:
      "The solar lam (ل) which causes assimilation of the preceding 'al-' definite article. The lam is silent and the following letter is doubled in pronunciation.",
    color: "#d35400",
    examples: [
      "الشَّمْسِ (ash-shams) - lām is silent, shīn doubled",
      "الرَّجُلِ (ar-rajul) - lām silent, rā' doubled",
      "النَّاسِ (an-nās) - lām silent, nūn doubled",
    ],
    category: "special",
    tips: "Lam Shamsiyyah letters are 14: ت ث ج د ذ ر ز س ش ص ض ط ظ. The 'al-' is pronounced without the lām, and the sun letter is doubled.",
  },
  {
    id: "qamari-makari",
    name: "Qamari and Makari Letters",
    nameArabic: "الحروف القمرية والمكية",
    description:
      "Moon (Qamari) letters maintain the lam pronunciation while solar (Shamsi) letters assimilate it. There are 14 moon letters where the lam is clearly pronounced.",
    color: "#8e44ad",
    examples: [
      "الْكِتَابِ (al-Kitāb) - kāf is a moon letter",
      "الْقُرْآنِ (al-Qur'an) - qāf is a moon letter",
      "الْمَسْجِدِ (al-masjid) - mīm is a moon letter",
    ],
    category: "special",
    tips: "Moon letters: ب ج ح خ ع غ ف ق ك م ه و ي. Remember: any letter NOT in the 14 sun letters is a moon letter. The lam is always pronounced with moon letters.",
  },
];
