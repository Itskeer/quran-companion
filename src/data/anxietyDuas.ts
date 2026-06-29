export interface AnxietyDua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  category: "stress" | "fear" | "sadness" | "anxiety" | "patience" | "protection" | "healing";
  situation: string;
}

export const anxietyDuas: AnxietyDua[] = [
  {
    id: "hasbiyallah",
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration: "Hasbiyallahu la ilaha illa hu, alayhi tawakkaltu, wa huwa rabbul arshil adheem",
    translation: "Allah is sufficient for me. There is no god but Him. In Him I put my trust, and He is the Lord of the Great Throne.",
    source: "Quran 9:129",
    category: "stress",
    situation: "When feeling overwhelmed or stressed"
  },
  {
    id: "la-ilaha-illallah-fear",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ الرَّحْمَٰنُ الرَّحِيمُ",
    transliteration: "La ilaha illAllahu ar-Rahman ar-Raheem",
    translation: "There is no god but Allah, the Most Gracious, the Most Merciful.",
    source: "Quran 1:1-3",
    category: "fear",
    situation: "When feeling afraid or fearful"
  },
  {
    id: "rabbana-la-tuzigh",
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
    transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana, wa hab lana min ladunka rahma",
    translation: "Our Lord, let not our hearts deviate after You have guided us, and grant us mercy from Yourself.",
    source: "Quran 3:8",
    category: "sadness",
    situation: "When seeking guidance and relief from sadness"
  },
  {
    id: "allahumma-min-al-hammi",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    transliteration: "Allahumma inni a'udhu bika min al-hammi wal-hazn",
    translation: "O Allah, I seek refuge in You from worry and sorrow.",
    source: "Sahih al-Bukhari 6313",
    category: "anxiety",
    situation: "When feeling worried or sorrowful"
  },
  {
    id: "rabbi-shrah-li",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    transliteration: "Rabbi shrah li sadri, wa yassir li amri",
    translation: "My Lord, expand for me my breast, and ease for me my task.",
    source: "Quran 20:25-26",
    category: "anxiety",
    situation: "When feeling anxious or facing difficulties"
  },
  {
    id: "hasbunallah",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "HasbunAllahu wa ni'mal wakeel",
    translation: "Allah is sufficient for us, and He is the best Disposer of affairs.",
    source: "Quran 3:173",
    category: "stress",
    situation: "When needing to place trust in Allah (tawakkul)"
  },
  {
    id: "allahumma-min-qalb",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ هَوَى النَّفْسِ وَشَرِّ الْقَلْبِ",
    transliteration: "Allahumma inni a'udhu bika min hawa an-nafs, wa sharri al-qalb",
    translation: "O Allah, I seek refuge in You from the evil of the self and the evil of the heart.",
    source: "Sunan al-Tirmidhi 3484",
    category: "anxiety",
    situation: "When troubled by anxious thoughts or inner turmoil"
  },
  {
    id: "rabbana-aghfir",
    arabic: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ",
    transliteration: "Rabbana ighfir lana wa li-ikhwanina alladhina sabaquna bil-iman",
    translation: "Our Lord, forgive us and our brothers who preceded us in faith.",
    source: "Quran 59:10",
    category: "sadness",
    situation: "When seeking forgiveness and relief from sadness"
  },
  {
    id: "la-hawla",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    translation: "There is no power nor strength except with Allah.",
    source: "Sahih al-Bukhari 6423",
    category: "patience",
    situation: "When feeling weak or powerless"
  },
  {
    id: "allahumma-al-afiya",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    transliteration: "Allahumma inni as'aluka al-'afiya fil-dunya wal-akhirah",
    translation: "O Allah, I ask You for wellbeing in this world and the Hereafter.",
    source: "Sunan Ibn Majah 3514",
    category: "healing",
    situation: "When seeking physical or spiritual wellbeing"
  },
  {
    id: "rabbi-laka-al-hamd",
    arabic: "رَبِّ لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَلِكَبِيرِ سُلْطَانِكَ",
    transliteration: "Rabbi laka al-hamd kama yanbaghi li-jalali wajhika, wa li-kabiri sultanik",
    translation: "My Lord, to You belongs all praise, as is due to the majesty of Your face and the greatness of Your sovereignty.",
    source: "Sunan al-Tirmidhi 3535",
    category: "sadness",
    situation: "When feeling down and needing gratitude"
  },
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    transliteration: "SubhanAllahi wa bihamdihi, SubhanAllahil adheem",
    translation: "Glory be to Allah and His praise. Glory be to Allah, the Magnificent.",
    source: "Sahih al-Bukhari 6329",
    category: "protection",
    situation: "When seeking peace of mind and heart"
  },
  {
    id: "astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullah al-adheem alladhi la ilaha illa huwal-hayyul-qayyum, wa atubu ilayh",
    translation: "I seek forgiveness from Allah, the Magnificent, whom there is no god but Him, the Ever-Living, the Sustainer, and I repent to Him.",
    source: "Sunan Abi Dawud 5078",
    category: "healing",
    situation: "When seeking purification and inner peace"
  },
  {
    id: "rabbajalni-muqimas-salah",
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    transliteration: "Rabbaj'alni muqimas-salah, wa min dhurriyyati, Rabbana wa taqabbal du'a",
    translation: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, accept my supplication.",
    source: "Quran 14:40",
    category: "patience",
    situation: "When seeking steadfastness in worship"
  },
  {
    id: "inna-lillahi",
    arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    transliteration: "Inna lillahi wa inna ilayhi raji'un",
    translation: "Indeed, we belong to Allah, and indeed, to Him we will return.",
    source: "Quran 2:156",
    category: "patience",
    situation: "When facing loss, grief, or calamity"
  },
];
