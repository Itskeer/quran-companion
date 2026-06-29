export interface ArabicLetter {
  letter: string;
  name: string;
  transliteration: string;
  pronunciation: string;
  type: "sun" | "moon" | "other";
  word: string;
  wordMeaning: string;
}

export interface ArabicWord {
  arabic: string;
  transliteration: string;
  english: string;
  french: string;
  category: "greetings" | "numbers" | "colors" | "family" | "food" | "body" | "nature" | "actions";
}

export interface ArabicNumber {
  number: number;
  eastern: string;
  western: string;
  transliteration: string;
}

export const arabicAlphabet: ArabicLetter[] = [
  { letter: "أ", name: "Alif", transliteration: "a", pronunciation: "ah", type: "moon", word: "أَرْض", wordMeaning: "earth" },
  { letter: "ب", name: "Ba", transliteration: "b", pronunciation: "bah", type: "moon", word: "بَاب", wordMeaning: "door" },
  { letter: "ت", name: "Ta", transliteration: "t", pronunciation: "tah", type: "sun", word: "تَمْر", wordMeaning: "dates" },
  { letter: "ث", name: "Tha", transliteration: "th", pronunciation: "thah", type: "sun", word: "ثَلْاثَة", wordMeaning: "three" },
  { letter: "ج", name: "Jim", transliteration: "j", pronunciation: "jah", type: "moon", word: "جَبَل", wordMeaning: "mountain" },
  { letter: "ح", name: "Ha", transliteration: "ḥ", pronunciation: "ḥah", type: "moon", word: "حَبِيب", wordMeaning: "beloved" },
  { letter: "خ", name: "Kha", transliteration: "kh", pronunciation: "khah", type: "moon", word: "خَبَر", wordMeaning: "news" },
  { letter: "د", name: "Dal", transliteration: "d", pronunciation: "dah", type: "sun", word: "دَار", wordMeaning: "house" },
  { letter: "ذ", name: "Dhal", transliteration: "dh", pronunciation: "dhah", type: "sun", word: "ذِكْر", wordMeaning: "remembrance" },
  { letter: "ر", name: "Ra", transliteration: "r", pronunciation: "rah", type: "sun", word: "رَحْمَة", wordMeaning: "mercy" },
  { letter: "ز", name: "Zay", transliteration: "z", pronunciation: "zay", type: "sun", word: "زَهْرَة", wordMeaning: "flower" },
  { letter: "س", name: "Sin", transliteration: "s", pronunciation: "sah", type: "sun", word: "سَمَاء", wordMeaning: "sky" },
  { letter: "ش", name: "Shin", transliteration: "sh", pronunciation: "shah", type: "sun", word: "شَمْس", wordMeaning: "sun" },
  { letter: "ص", name: "Sad", transliteration: "ṣ", pronunciation: "ṣah", type: "moon", word: "صَلَاة", wordMeaning: "prayer" },
  { letter: "ض", name: "Dad", transliteration: "ḍ", pronunciation: "ḍah", type: "moon", word: "ضَوْء", wordMeaning: "light" },
  { letter: "ط", name: "Ta", transliteration: "ṭ", pronunciation: "ṭah", type: "moon", word: "طَعَام", wordMeaning: "food" },
  { letter: "ظ", name: "Za", transliteration: "ẓ", pronunciation: "ẓah", type: "moon", word: "ظَلَام", wordMeaning: "darkness" },
  { letter: "ع", name: "'Ayn", transliteration: "'", pronunciation: "'ah", type: "moon", word: "عِلْم", wordMeaning: "knowledge" },
  { letter: "غ", name: "Ghayn", transliteration: "gh", pronunciation: "ghah", type: "moon", word: "غَيْب", wordMeaning: "absent" },
  { letter: "ف", name: "Fa", transliteration: "f", pronunciation: "fah", type: "moon", word: "فَرْح", wordMeaning: "joy" },
  { letter: "ق", name: "Qaf", transliteration: "q", pronunciation: "qah", type: "moon", word: "قَلْب", wordMeaning: "heart" },
  { letter: "ك", name: "Kaf", transliteration: "k", pronunciation: "kah", type: "moon", word: "كِتَاب", wordMeaning: "book" },
  { letter: "ل", name: "Lam", transliteration: "l", pronunciation: "lah", type: "moon", word: "لَيْل", wordMeaning: "night" },
  { letter: "م", name: "Mim", transliteration: "m", pronunciation: "mah", type: "moon", word: "مَاء", wordMeaning: "water" },
  { letter: "ن", name: "Nun", transliteration: "n", pronunciation: "nah", type: "moon", word: "نُور", wordMeaning: "light" },
  { letter: "ه", name: "Ha", transliteration: "h", pronunciation: "hah", type: "moon", word: "هَوَاء", wordMeaning: "air" },
  { letter: "و", name: "Waw", transliteration: "w", pronunciation: "waw", type: "moon", word: "وَجْه", wordMeaning: "face" },
  { letter: "ي", name: "Ya", transliteration: "y", pronunciation: "yah", type: "moon", word: "يَد", wordMeaning: "hand" },
];

export const arabicBasicWords: ArabicWord[] = [
  { arabic: "السَّلَامُ عَلَيْكُمْ", transliteration: "as-salamu alaykum", english: "peace be upon you", french: "paix sur vous", category: "greetings" },
  { arabic: "صَبَاحُ الْخَيْرِ", transliteration: "sabah al-khayr", english: "good morning", french: "bonjour", category: "greetings" },
  { arabic: "مَسَاءُ الْخَيْرِ", transliteration: "masaa al-khayr", english: "good evening", french: "bonsoir", category: "greetings" },
  { arabic: "شُكْرًا", transliteration: "shukran", english: "thank you", french: "merci", category: "greetings" },
  { arabic: "عَفْوًا", transliteration: "afwan", english: "you're welcome", french: "de rien", category: "greetings" },
  { arabic: "نَعَمْ", transliteration: "na'am", english: "yes", french: "oui", category: "greetings" },
  { arabic: "لَا", transliteration: "la", english: "no", french: "non", category: "greetings" },
  { arabic: "وَاحِدٌ", transliteration: "wahid", english: "one", french: "un", category: "numbers" },
  { arabic: "اِثْنَانِ", transliteration: "ithnayn", english: "two", french: "deux", category: "numbers" },
  { arabic: "ثَلَاثَةٌ", transliteration: "thalatha", english: "three", french: "trois", category: "numbers" },
  { arabic: "أَرْبَعَةٌ", transliteration: "arba'a", english: "four", french: "quatre", category: "numbers" },
  { arabic: "خَمْسَةٌ", transliteration: "khamsa", english: "five", french: "cinq", category: "numbers" },
  { arabic: "أَحْمَرُ", transliteration: "ahmar", english: "red", french: "rouge", category: "colors" },
  { arabic: "أَزْرَقُ", transliteration: "azraq", english: "blue", french: "bleu", category: "colors" },
  { arabic: "أَخْضَرُ", transliteration: "akhdar", english: "green", french: "vert", category: "colors" },
  { arabic: "أَصْفَرُ", transliteration: "asfar", english: "yellow", french: "jaune", category: "colors" },
  { arabic: "أَبْيَضُ", transliteration: "abyad", english: "white", french: "blanc", category: "colors" },
  { arabic: "أَبٌ", transliteration: "ab", english: "father", french: "père", category: "family" },
  { arabic: "أُمٌّ", transliteration: "umm", english: "mother", french: "mère", category: "family" },
  { arabic: "أَخٌ", transliteration: "akh", english: "brother", french: "frère", category: "family" },
  { arabic: "أُخْتٌ", transliteration: "ukht", english: "sister", french: "soeur", category: "family" },
  { arabic: "اِبْنٌ", transliteration: "ibn", english: "son", french: "fils", category: "family" },
  { arabic: "بِنْتٌ", transliteration: "bint", english: "daughter", french: "fille", category: "family" },
  { arabic: "مَاءٌ", transliteration: "ma'", english: "water", french: "eau", category: "food" },
  { arabic: "خُبْزٌ", transliteration: "khubz", english: "bread", french: "pain", category: "food" },
  { arabic: "لَحْمٌ", transliteration: "lahm", english: "meat", french: "viande", category: "food" },
  { arabic: "ثِمَارٌ", transliteration: "thimar", english: "fruits", french: "fruits", category: "food" },
  { arabic: "حَلِيبٌ", transliteration: "halib", english: "milk", french: "lait", category: "food" },
  { arabic: "رَأْسٌ", transliteration: "ra's", english: "head", french: "tête", category: "body" },
  { arabic: "يَدٌ", transliteration: "yad", english: "hand", french: "main", category: "body" },
  { arabic: "عَيْنٌ", transliteration: "'ayn", english: "eye", french: "œil", category: "body" },
  { arabic: "قَلْبٌ", transliteration: "qalb", english: "heart", french: "cœur", category: "body" },
  { arabic: "وَجْهٌ", transliteration: "wajh", english: "face", french: "visage", category: "body" },
  { arabic: "شَمْسٌ", transliteration: "shams", english: "sun", french: "soleil", category: "nature" },
  { arabic: "قَمَرٌ", transliteration: "qamar", english: "moon", french: "lune", category: "nature" },
  { arabic: "نَجْمٌ", transliteration: "najm", english: "star", french: "étoile", category: "nature" },
  { arabic: "شَجَرَةٌ", transliteration: "shajara", english: "tree", french: "arbre", category: "nature" },
  { arabic: "بَحْرٌ", transliteration: "bahar", english: "sea", french: "mer", category: "nature" },
  { arabic: "كَسَرَ", transliteration: "kasara", english: "he broke", french: "il a brisé", category: "actions" },
  { arabic: "كَذَبَ", transliteration: "kathaba", english: "he lied", french: "il a menti", category: "actions" },
  { arabic: "صَرَحَ", transliteration: "saraha", english: "he declared", french: "il a déclaré", category: "actions" },
  { arabic: "دَرَسَ", transliteration: "darasa", english: "he studied", french: "il a étudié", category: "actions" },
  { arabic: "عَلِمَ", transliteration: "'alima", english: "he knew", french: "il a su", category: "actions" },
];

export const arabicNumbers: ArabicNumber[] = [
  { number: 0, eastern: "٠", western: "0", transliteration: "sifr" },
  { number: 1, eastern: "١", western: "1", transliteration: "wahid" },
  { number: 2, eastern: "٢", western: "2", transliteration: "ithnayn" },
  { number: 3, eastern: "٣", western: "3", transliteration: "thalatha" },
  { number: 4, eastern: "٤", western: "4", transliteration: "arba'a" },
  { number: 5, eastern: "٥", western: "5", transliteration: "khamsa" },
  { number: 6, eastern: "٦", western: "6", transliteration: "sitta" },
  { number: 7, eastern: "٧", western: "7", transliteration: "sab'a" },
  { number: 8, eastern: "٨", western: "8", transliteration: "thamaniya" },
  { number: 9, eastern: "٩", western: "9", transliteration: "tis'a" },
  { number: 10, eastern: "١٠", western: "10", transliteration: "'ashara" },
];
