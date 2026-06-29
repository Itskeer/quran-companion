interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  dayName: string;
  formatted: string;
}

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi ul-Awwal",
  "Rabi ul-Thani",
  "Jumada al-Ula",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhul Qi'dah",
  "Dhul Hijjah",
];

const HIJRI_MONTHS_FR = [
  "Mouharram",
  "Safar",
  "Rabi' el Oual",
  "Rabi' el Thani",
  "Joumada el Oula",
  "Joumada el Thania",
  "Rajab",
  "Cha'ban",
  "Ramadan",
  "Chawwal",
  "Dhou el Qi'da",
  "Dhou el Hijja",
];

const HIJRI_MONTHS_AR = [
  "محرّم",
  "صفر",
  "ربيع الأول",
  "ربيع الثاني",
  "جمادى الأولى",
  "جمادى الثانية",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

const GREGORIAN_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function jdFromGregorian(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function gregorianFromJD(jd: number): { year: number; month: number; day: number } {
  const a = jd + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

function hijriFromJD(jd: number): { day: number; month: number; year: number } {
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const remainder = l - 10631 * n + 354;
  const j = Math.floor((10985 - remainder) / 5316) * Math.floor((50 * remainder) / 17719) + Math.floor(remainder / 5670) * Math.floor((43 * remainder) / 15238);
  const adjustedRemainder = remainder - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * adjustedRemainder) / 709);
  const day = adjustedRemainder - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { day, month, year };
}

function jdFromHijri(year: number, month: number, day: number): number {
  return Math.floor((11 * year + 3) / 30) + 354 * year + 30 * month - Math.floor((month - 1) / 2) + day + 1948440 - 385;
}

function getDayOfWeek(gYear: number, gMonth: number, gDay: number): string {
  const jd = jdFromGregorian(gYear, gMonth, gDay);
  const dow = (jd + 1) % 7;
  return GREGORIAN_DAY_NAMES[dow];
}

export function gregorianToHijri(date: Date): HijriDate {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();

  const jd = jdFromGregorian(gYear, gMonth, gDay);
  const hijri = hijriFromJD(jd);

  return {
    day: hijri.day,
    month: hijri.month,
    year: hijri.year,
    monthName: HIJRI_MONTHS[hijri.month - 1] || "",
    dayName: getDayOfWeek(gYear, gMonth, gDay),
    formatted: `${hijri.day} ${HIJRI_MONTHS[hijri.month - 1] || ""} ${hijri.year}`,
  };
}

export function getCurrentHijriDate(): HijriDate {
  return gregorianToHijri(new Date());
}

export function hijriToGregorian(year: number, month: number, day: number): Date {
  const jd = jdFromHijri(year, month, day);
  const greg = gregorianFromJD(jd);
  return new Date(greg.year, greg.month - 1, greg.day);
}

export function getHijriMonthName(month: number, lang: "en" | "ar" | "fr" = "en"): string {
  if (month < 1 || month > 12) return "";
  if (lang === "ar") return HIJRI_MONTHS_AR[month - 1];
  if (lang === "fr") return HIJRI_MONTHS_FR[month - 1];
  return HIJRI_MONTHS[month - 1];
}

export function getDaysInHijriMonth(year: number, month: number): number {
  const start = jdFromHijri(year, month, 1);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const end = jdFromHijri(nextYear, nextMonth, 1);
  return end - start;
}

export function isRamadan(date?: Date): boolean {
  const hijri = gregorianToHijri(date || new Date());
  return hijri.month === 9;
}

export function isEidAlFitr(date?: Date): boolean {
  const hijri = gregorianToHijri(date || new Date());
  return hijri.month === 10 && hijri.day <= 3;
}

export function isEidAlAdha(date?: Date): boolean {
  const hijri = gregorianToHijri(date || new Date());
  return hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13;
}

export function isIslamicHoliday(date?: Date): boolean {
  const hijri = gregorianToHijri(date || new Date());
  if (hijri.month === 1 && hijri.day === 1) return true;
  if (hijri.month === 9 && hijri.day === 27) return true;
  return isRamadan(date) || isEidAlFitr(date) || isEidAlAdha(date);
}

export { HIJRI_MONTHS, HIJRI_MONTHS_AR, HIJRI_MONTHS_FR };
export type { HijriDate };
