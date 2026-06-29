export interface IstighfarItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  category: "general" | "forgiveness" | "mercy" | "protection";
}

export const istighfarData: IstighfarItem[] = [
  {
    id: "istighfar-1",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha al-azeem alladhi la ilaha illa huwal hayyul qayyumu wa atubu ilayh.",
    translation: "I seek the forgiveness of Allah, the Mighty, whom there is no god but He, the Ever-Living, the Sustainer of existence, and I repent to Him.",
    source: "Sahih Bukhari 6323, Abu Dawud",
    category: "forgiveness",
  },
  {
    id: "istighfar-2",
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration: "Hasbiyallahu la ilaha illa hu, alayhi tawakkaltu wa huwa rabbul arshil azeem.",
    translation: "Allah is sufficient for me. There is no god but Him. In Him I put my trust, and He is the Lord of the Great Throne.",
    source: "Sahih Bukhari 7492, Sahih Muslim",
    category: "general",
  },
  {
    id: "istighfar-3",
    arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَ مِنَ الْخَاسِرِينَ",
    transliteration: "Rabbana zalamna anfusana wa il-lam taghfir lana wa tarhamna la-nakunanna minal khasireen.",
    translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    source: "Surah Al-A'raf 7:23, Sahih Bukhari",
    category: "forgiveness",
  },
  {
    id: "istighfar-4",
    arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    transliteration: "Rabbi-ghfir lee wa tub alayya innaka antat tawwabur raheem.",
    translation: "My Lord, forgive me and accept my repentance. Indeed, You are the Accepting of Repentance, the Merciful.",
    source: "Surah Al-Baqarah 2:128, Sahih Bukhari",
    category: "mercy",
  },
  {
    id: "istighfar-5",
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ وَتُبْ عَلَيْنَا إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ",
    transliteration: "Rabbana taqabbal minna innaka antas sameeful aleem, wa tub alayna innaka antat tawwabur raheem.",
    translation: "Our Lord, accept from us. Indeed, You are the All-Hearing, the All-Knowing. And accept our repentance. Indeed, You are the Accepting of Repentance, the Merciful.",
    source: "Surah Al-Baqarah 2:127-128, Sahih Bukhari",
    category: "forgiveness",
  },
  {
    id: "istighfar-6",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ، لَا إِلَٰهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ",
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa ala kulli shay'in qadeer, la hawla wa la quwwata illa billah, la ilaha illallahu wa la na'budu illa iyyah, lahun ni'matu wa lahul fadlu wa lahuth thana'ul hasan, la ilaha illallahu mukhliseena lahud deena wa law karihal kafiroon.",
    translation: "There is no god but Allah alone, with no partner. To Him belongs sovereignty and praise, and He has power over all things. There is no power nor might except with Allah. There is no god but Allah, and we worship none but Him. To Him belongs all bounty, to Him belongs all grace, and to Him belongs all praiseworthy commendation. There is no god but Allah, being sincere to Him in religion, even if the disbelievers dislike it.",
    source: "Sahih Muslim 38",
    category: "protection",
  },
  {
    id: "istighfar-7",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    transliteration: "Subhanallahi wa bihamdihi, subhanallahil azeem.",
    translation: "Glory be to Allah and praise be to Him. Glory be to Allah, the Most Great.",
    source: "Sahih Bukhari 6403, Sahih Muslim 49",
    category: "general",
  },
  {
    id: "istighfar-8",
    arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    transliteration: "Allahumma salli wa sallim ala nabiyyina muhammad.",
    translation: "O Allah, send prayers and peace upon our Prophet Muhammad.",
    source: "Sahih Bukhari 3370",
    category: "mercy",
  },
  {
    id: "istighfar-9",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    transliteration: "Allahumma inni a'udhu bika minal hammi wal hazan, wa a'udhu bika minal ajzi wal kasal, wa a'udhu bikal jubni wal bukhil, wa a'udhu bika min ghalabatid dayni wa qahrir rijaal.",
    translation: "O Allah, I seek refuge in You from worry and grief, from helplessness and laziness, from cowardice and stinginess, and from being overpowered by debt and the oppression of men.",
    source: "Abu Dawud 5090",
    category: "protection",
  },
  {
    id: "istighfar-10",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit tammati min sharri ma khalaq.",
    translation: "I seek refuge in the perfect words of Allah from the evil of that which He has created.",
    source: "Sahih Muslim 2708",
    category: "protection",
  },
];
