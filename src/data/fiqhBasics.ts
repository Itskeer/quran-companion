export interface FiqhTopic {
  id: string;
  name: string;
  nameArabic: string;
  icon: string;
  category: "cleanliness" | "prayer" | "fasting" | "zakat" | "hajj" | "food" | "clothing" | "transactions";
  rulings: FiqhRuling[];
}

export interface FiqhRuling {
  question: string;
  answer: string;
  source: string;
  importance: "basic" | "intermediate" | "advanced";
}

export const fiqhTopics: FiqhTopic[] = [
  {
    id: "cleanliness",
    name: "Cleanliness (Taharah)",
    nameArabic: "الطَّهَارَة",
    icon: "💧",
    category: "cleanliness",
    rulings: [
      {
        question: "What are the pillars of Wudu (ablution)?",
        answer:
          "The pillars are: (1) Intention (niyyah), (2) Washing the face including mouth and nose, (3) Washing both arms including elbows, (4) Wiping the head (masah), (5) Washing both feet including ankles. These are based on the verse: 'O you who believe, when you rise to prayer, wash your faces and your hands to the elbows, wipe over your heads, and wash your feet to the ankles.' (Al-Ma'idah 5:6)",
        source: "Quran 5:6, Sahih Muslim 234",
        importance: "basic",
      },
      {
        question: "When is Ghusl (full-body bath) required?",
        answer:
          "Ghusl is required after: (1) sexual intercourse, (2) ejaculation, (3) menstruation, (4) postpartum bleeding. The method involves: intention, washing the entire body with water including hair, ensuring water reaches all skin. Tayammum (dry ablution) may substitute when water is unavailable or harmful.",
        source: "Sahih al-Bukhari 136, Sahih Muslim 316",
        importance: "basic",
      },
      {
        question: "What breaks Wudu?",
        answer:
          "Wudu is invalidated by: (1) any discharge from the front or back passage, (2) sleep in which one loses awareness, (3) touching private parts directly, (4) losing consciousness, (5) eating camel meat, (6) touching a person of the opposite sex with desire. Minor排放 does not break Wudu according to the majority of scholars.",
        source: "Sahih al-Bukhari 195, Sunan an-Nasa'i 172",
        importance: "basic",
      },
      {
        question: "What is Tayammum and when is it permitted?",
        answer:
          "Tayammum is dry ablution using clean earth or stone dust. It is permitted when: (1) water is unavailable, (2) water is harmful to use, (3) water is extremely cold and no heating source exists, (4) during illness where water use is risky. The method: strike clean earth twice, wipe the face and both arms. It expires when water becomes available.",
        source: "Quran 5:6, Sahih al-Bukhari 347",
        importance: "intermediate",
      },
    ],
  },
  {
    id: "prayer",
    name: "Prayer (Salah)",
    nameArabic: "الصَّلَاة",
    icon: "🕌",
    category: "prayer",
    rulings: [
      {
        question: "What are the conditions (shurut) for valid prayer?",
        answer:
          "The conditions are: (1) Islam, (2) Sanity, (3) Age of discernment (tamyiz), (4) Ritual purity (taharah), (5) Removing najasah from body and clothes, (6) Covering awrah, (7) Entering prayer time, (8) Facing qiblah, (9) Intention (niyyah). Missing any condition invalidates the prayer according to the majority of scholars.",
        source: "Sunan at-Tirmidhi 3, Sahih Muslim 392",
        importance: "basic",
      },
      {
        question: "When are the five daily prayers due?",
        answer:
          "The five prayers and their approximate times are: (1) Fajr - from dawn to sunrise (2 rak'ahs), (2) Dhuhr - from when the sun passes zenith until shadow equals object height (4 rak'ahs), (3) Asr - when shadow is twice object height until sunset (4 rak'ahs), (4) Maghrib - at sunset until twilight disappears (3 rak'ahs), (5) Isha - from twilight until midnight (4 rak'ahs + Witr).",
        source: "Sahih al-Bukhari 529, Sahih Muslim 611",
        importance: "basic",
      },
      {
        question: "What invalidates prayer?",
        answer:
          "Prayer is invalidated by: (1) talking or excessive movement, (2) eating or drinking, (3) turning away from qiblah, (4) laughing out loud, (5) intentionally missing a pillar, (6) not being in a state of wudu, (7) covering the face (for men), (8) performing actions unrelated to prayer.",
        source: "Sahih al-Bukhari 1210, Sahih Muslim 222",
        importance: "intermediate",
      },
      {
        question: "What are the rules for Jumu'ah (Friday) prayer?",
        answer:
          "Jumu'ah is obligatory for men in congregation when: (1) there are at least 40 residents in the area, (2) it is held at the designated mosque, (3) attended before the Imam sits for the second khutbah. It consists of 2 rak'ahs, a khutbah (sermon), and replaces Dhuhr. Women may attend but it is not obligatory for them. Missing three consecutive Jumu'ahs without valid excuse is sinful.",
        source: "Sahih al-Bukhari 875, Sunan Abu Dawud 1067",
        importance: "intermediate",
      },
    ],
  },
  {
    id: "fasting",
    name: "Fasting (Sawm)",
    nameArabic: "الصَّوْم",
    icon: "🌙",
    category: "fasting",
    rulings: [
      {
        question: "What invalidates the fast?",
        answer:
          "Fasting is invalidated by: (1) eating or drinking intentionally, (2) sexual intercourse, (3) intentional vomiting, (4) menstruation or postpartum bleeding, (5) intentional ejaculation, (6) intending to break the fast. If one breaks the fast accidentally, the fast remains valid. Exemptions exist for travel, illness, pregnancy, and nursing - these require making up the days later or paying fidyah.",
        source: "Sahih al-Bukhari 1933, Sahih Muslim 1151",
        importance: "basic",
      },
      {
        question: "What are the rules for Suhoor and Iftar?",
        answer:
          "Suhoor (pre-dawn meal) should be eaten before the Fajr adhan, and delaying it is recommended (tahajjul). Iftar should be eaten immediately at sunset - 'The people remain in goodness as long as they hasten the Iftar.' The Prophet (ﷺ) broke his fast with fresh dates, then dried dates, then water. It is recommended to say: 'ذَهَبَ الظَّمَأُ وَابْتَلَتِ الْعُرُوقُ' at Iftar.",
        source: "Sahih al-Bukhari 1956, Sahih Muslim 1097",
        importance: "basic",
      },
      {
        question: "What are the rules specific to Ramadan?",
        answer:
          "Ramadan fasting has special rules: (1) It is obligatory for every adult Muslim, (2) The fast begins at true dawn, not the adhan, (3) Suhoor time ends at Fajr adhan, (4) If someone eats doubting it is still Suhoor, they should continue eating until certain, (5) Laylat al-Qadr is in the last 10 nights - odd nights preferred. The reward is multiplication of good deeds.",
        source: "Sahih al-Bukhari 1921, Sunan at-Tirmidhi 780",
        importance: "basic",
      },
      {
        question: "When can one break the fast early?",
        answer:
          "One may break the fast early if: (1) facing extreme difficulty or hardship, (2) traveling and the journey is long enough to shorten prayer, (3) illness that fasting worsens, (4) pregnancy or nursing where fasting harms mother or child. The fast must be made up later (qada) for each day broken. Paying fidyah (feeding one poor person per day) is required for those who cannot fast permanently due to old age or chronic illness.",
        source: "Quran 2:184-185, Sahih Muslim 1114",
        importance: "intermediate",
      },
    ],
  },
  {
    id: "zakat",
    name: "Zakat (Obligatory Charity)",
    nameArabic: "الزَّكَاة",
    icon: "💰",
    category: "zakat",
    rulings: [
      {
        question: "What is the Nisab (minimum threshold) for Zakat?",
        answer:
          "The Nisab is equivalent to: (1) Gold: 85 grams (approx. 2.5% of total wealth), (2) Silver: 595 grams (approx. 2.5%), (3) Trade goods: current market value of these amounts. Zakat is due on wealth that has been held for one full lunar year (hawl) above the Nisab. The Nisab follows the gold/silver standard, not currency values.",
        source: "Sahih Muslim 979, Sahih al-Bukhari 1455",
        importance: "intermediate",
      },
      {
        question: "What are the rates of Zakat?",
        answer:
          "Zakat rates are: (1) Gold and silver: 2.5%, (2) Trade goods: 2.5% of sale value, (3) Agricultural produce: 5% (irrigated) or 10% (rain-fed), (4) Livestock: varies by type (cattle, sheep, goats, camels), (5) Minerals and buried treasure (rikaz): 20%. Zakat is calculated on net wealth after deducting debts and essential expenses.",
        source: "Quran 9:60, Sunan Abu Dawud 1561",
        importance: "intermediate",
      },
      {
        question: "Who are the eight categories of Zakat recipients?",
        answer:
          "The Quran specifies eight categories (9:60): (1) Al-Fuqara' - the poor, (2) Al-Masakin - the needy, (3) Zakat administrators, (4) New Muslims and allies of Islam, (5) Freeing captives, (6) Those in debt, (7) In the cause of Allah, (8) The wayfarer. Zakat must be distributed to these categories only. It is not permissible to give Zakat to one's parents, grandparents, children, or spouse.",
        source: "Quran 9:60, Sahih al-Bukhari 1456",
        importance: "basic",
      },
    ],
  },
  {
    id: "hajj",
    name: "Hajj (Pilgrimage)",
    nameArabic: "الحَجّ",
    icon: "🕋",
    category: "hajj",
    rulings: [
      {
        question: "What are the types of Hajj?",
        answer:
          "There are three types: (1) Tamattu' - Umrah then Hajj separately, with sacrifice, (2) Qiran - Umrah and Hajj together in one ihram, with sacrifice, (3) Ifrad - Hajj only, without sacrifice unless departing early. Tamattu' is the most common and recommended for first-timers. Each requires specific intentions and rituals.",
        source: "Sahih al-Bukhari 1544, Sahih Muslim 1210",
        importance: "intermediate",
      },
      {
        question: "What are the conditions that make Hajj obligatory?",
        answer:
          "Hajj is obligatory once in a lifetime when: (1) Muslim, (2) Adult (baligh), (3) Sane, (4) Free (historically), (5) Physically able, (6) Financially able (has sufficient funds for travel and return), (7) Safe passage. The Prophet (ﷺ) said: 'Islam is built on five pillars.' Hajj is the fifth. If someone dies before performing it, it is not obligatory on their heirs.",
        source: "Sahih al-Bukhari 15, Sahih Muslim 16",
        importance: "basic",
      },
      {
        question: "What are the key steps of Hajj?",
        answer:
          "The key steps are: (1) Enter ihram on the 8th of Dhul Hijjah, (2) Proceed to Mina, (3) Stand at Arafah on the 9th (wuquf), (4) Spend the night at Muzdalifah, (5) Stone the Jamarat at Mina, (6) Sacrifice an animal, (7) Shave head (halq), (8) Tawaf al-Ifadah and Sa'i, (9) Stay at Mina for Days of Tashreeq. Each step must be performed in order to complete Hajj properly.",
        source: "Sahih al-Bukhari 1630, Sahih Muslim 1218",
        importance: "intermediate",
      },
    ],
  },
  {
    id: "food",
    name: "Food and Drink",
    nameArabic: "الْأَطْعِمَةُ وَالْأَشْرِبَة",
    icon: "🍖",
    category: "food",
    rulings: [
      {
        question: "What foods and drinks are Halal and Haram?",
        answer:
          "Haram (forbidden): (1) Pork and its by-products, (2) Blood (flowing), (3) Intoxicants (khamr), (4) Meat not slaughtered in Allah's name, (5) Carnivorous animals with fangs, (6) Dead animals (except fish), (7) Animals dedicated to other than Allah. Halal (permissible): All other foods and drinks that are pure and beneficial. The default is permissibility unless proven otherwise.",
        source: "Quran 5:3, 5:90, Sahih al-Bukhari 5481",
        importance: "basic",
      },
      {
        question: "What is the correct method of Dhabihah (slaughter)?",
        answer:
          "The Islamic method of slaughter requires: (1) The animal must be alive at time of slaughter, (2) Slaughter with a sharp knife at the throat, (3) Say 'بِسْمِ اللَّهِ' before cutting, (4) Cut the windpipe, gullet, and jugular veins completely, (5) Allow full blood drainage, (6) The knife must be sharp to minimize suffering. If Allah's name is forgotten, one may say 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ' at the end.",
        source: "Sahih al-Bukhari 5499, Sunan at-Tirmidhi 1480",
        importance: "intermediate",
      },
      {
        question: "Can Muslims eat food of the People of the Book?",
        answer:
          "Yes, Muslims may eat the meat of Jews and Christians (People of the Book) under conditions: (1) Allah's name is mentioned at the time of slaughter (or not mentioned at all), (2) The meat is not pork or otherwise prohibited, (3) It was not slaughtered in a name other than Allah. Fish and seafood are generally halal without slaughter requirements.",
        source: "Quran 5:5, Sahih al-Bukhari 5490",
        importance: "intermediate",
      },
      {
        question: "What about vegetarian and vegan food?",
        answer:
          "Vegetarian and vegan food is generally halal, provided: (1) No alcohol is used in preparation, (2) No animal-derived ingredients are haram (e.g., pork gelatin), (3) No cross-contamination with prohibited items during processing. Fruits, vegetables, grains, nuts, and legumes are all permissible. The Prophet (ﷺ) ate vegetables and dates regularly.",
        source: "Sahih al-Bukhari 5404, Sahih Muslim 2042",
        importance: "basic",
      },
    ],
  },
  {
    id: "clothing",
    name: "Clothing and Adornment",
    nameArabic: "اللِّبَاسُ وَالتَّزْيِين",
    icon: "👘",
    category: "clothing",
    rulings: [
      {
        question: "What is the Awrah (parts to be covered)?",
        answer:
          "For men: the area between the navel and the knees must be covered at all times. For women in front of non-mahram men: the entire body except the face and hands (some scholars include the feet). In front of mahram women: the area between the navel and knees. In front of husband: any part. The Prophet (ﷺ) said: 'Every religion has a character trait, and the character trait of Islam is modesty.'",
        source: "Sahih al-Bukhari 5889, Sahih Muslim 1389",
        importance: "basic",
      },
      {
        question: "What are the rules for men regarding gold and silk?",
        answer:
          "It is prohibited for Muslim men to wear: (1) Gold in any form (rings, necklaces, etc.), (2) Pure silk (silk-mixed fabrics are permissible if less than 50% silk), (3) Red and saffron-colored clothing for men in some narrations. These are exclusively for women in this world. The Prophet (ﷺ) showed us that silk and gold are permissible for women of my Ummah but forbidden for men.",
        source: "Sahih al-Bukhari 5838, Sahih Muslim 2070",
        importance: "basic",
      },
      {
        question: "What are the guidelines for modest dress in Islam?",
        answer:
          "Islamic dress guidelines include: (1) Clothing should be loose and not revealing the shape of the body, (2) Men should not wear clothing that imitates women and vice versa, (3) Clothing should not be ostentatious or arrogant, (4) Clothing should be clean and presentable, (5) Wearing clothing of distinction for men is discouraged (e.g., long robes for showing off). The Prophet (ﷺ) was simple in his dress and disliked arrogance.",
        source: "Sahih Muslim 2085, Sunan Abu Dawud 4028",
        importance: "basic",
      },
      {
        question: "Can men wear silver jewelry?",
        answer:
          "Yes, men are permitted to wear silver jewelry, particularly silver rings. The Prophet (ﷺ) wore a silver ring on his right hand, as did several companions. However, it should not be ostentatious - a simple band is preferred. Men may also wear silver rings for seals or other practical purposes. Gold remains prohibited for men.",
        source: "Sahih al-Bukhari 5414, Sahih Muslim 2092",
        importance: "intermediate",
      },
    ],
  },
  {
    id: "transactions",
    name: "Transactions and Trade",
    nameArabic: "الْمُعَامَلَاتُ",
    icon: "📊",
    category: "transactions",
    rulings: [
      {
        question: "What is Riba (usury/interest) and why is it forbidden?",
        answer:
          "Riba is any guaranteed increase or benefit in a loan or exchange, including: (1) Interest on loans, (2) Riba al-fadl - excess in hand-to-hand exchange of same goods, (3) Riba al-nasi'ah - delay in exchange. It is absolutely forbidden: 'Allah has permitted trade and forbidden Riba.' (2:275). Those who consume Riba will stand on the Day of Judgment like those beaten by Shaytan - this is one of the seven destructive sins.",
        source: "Quran 2:275-280, Sahih al-Bukhari 2057",
        importance: "basic",
      },
      {
        question: "What is Gharar (excessive uncertainty) in transactions?",
        answer:
          "Gharar refers to excessive uncertainty or ambiguity in a transaction that may lead to dispute. It is prohibited in: (1) Selling what one does not possess, (2) Selling the fruit before it ripens, (3)不确定的交易对象, (4) gambling-like transactions. Minor Gharar is excused but significant Gharar invalidates the transaction. The Prophet prohibited selling fish in the water or birds in the sky due to Gharar.",
        source: "Sahih Muslim 1513, Sahih al-Bukhari 2177",
        importance: "intermediate",
      },
      {
        question: "What are the rules for halal selling and buying?",
        answer:
          "Islamic trade rules include: (1) Mutual consent (no coercion), (2) Clear description of goods, (3) Honest weights and measures, (4) Immediate possession or delivery terms, (5) No selling prohibited items, (6) Paying debts on time. The Prophet (ﷺ) said: 'The truthful, trustworthy merchant is with the prophets, the truthful, and the martyrs.' Honesty and transparency are paramount.",
        source: "Sahih at-Tirmidhi 1209, Sahih Muslim 1033",
        importance: "basic",
      },
      {
        question: "What are the rules for contracts and agreements?",
        answer:
          "Islamic contract principles: (1) Both parties must be competent (baligh, sane), (2) The object must be halal and identifiable, (3) Price must be clearly stated, (4) Consent must be free from coercion, (5) Witnesses are recommended for major transactions, (6) Written documentation is encouraged (Quran 2:282). Contracts can be oral or written, but written is strongly recommended for dispute prevention.",
        source: "Quran 2:282, Sahih al-Bukhari 2139",
        importance: "intermediate",
      },
    ],
  },
];
