interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface PrayerTimeCalculation {
  method: "MWL" | "ISNA" | "Egypt" | "Karachi";
  latitude: number;
  longitude: number;
}

type CalculationParams = {
  fajrAngle: number;
  ishaAngle: number;
  asrFactor: number;
};

const CALCULATION_METHODS: Record<string, CalculationParams> = {
  MWL: { fajrAngle: 18, ishaAngle: 17, asrFactor: 1 },
  ISNA: { fajrAngle: 15, ishaAngle: 15, asrFactor: 1 },
  Egypt: { fajrAngle: 19.5, ishaAngle: 17.5, asrFactor: 1 },
  Karachi: { fajrAngle: 18, ishaAngle: 18, asrFactor: 1 },
};

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function computeSunDeclination(jd: number): number {
  const d = jd - 2451545;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = (q + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g))) % 360;
  const e = 23.439 - 0.00000036 * d;
  return Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L)));
}

function computeEquationOfTime(jd: number): number {
  const d = jd - 2451545;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = (q + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g))) % 360;
  const e = 23.439 - 0.00000036 * d;
  const RA = toDegrees(Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(L)), Math.cos(toRadians(L)))) / 15;
  const eqt = q / 15 - Math.round(q / 15);
  return eqt;
}

function computeJD(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function computeSunriseSunset(lat: number, lng: number, jd: number, angle: number, rise: boolean): number {
  const decl = computeSunDeclination(jd);
  const eqt = computeEquationOfTime(jd);
  const cosH = (Math.cos(toRadians(angle)) - Math.sin(toRadians(lat)) * Math.sin(decl)) / (Math.cos(toRadians(lat)) * Math.cos(decl));

  if (cosH > 1 || cosH < -1) return rise ? 6 : 18;

  const H = toDegrees(Math.acos(cosH));
  const T = rise ? 12 - H / 15 : 12 + H / 15;
  return T - eqt - lng / 15;
}

function formatTime(hours: number): string {
  let h = Math.floor(hours);
  let m = Math.round((hours - h) * 60);

  if (m >= 60) {
    h += 1;
    m -= 60;
  }
  if (h >= 24) h -= 24;
  if (h < 0) h += 24;

  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}

function getAsrFactor(method: CalculationParams, latitude: number): number {
  const angle = Math.abs(latitude);
  return angle > 45 ? 2 : method.asrFactor;
}

function computeAsr(lat: number, decl: number, factor: number): number {
  const angle = Math.atan(1 / (factor + Math.tan(Math.abs(toRadians(lat)) - decl)));
  return toDegrees(angle);
}

function computePrayerTimesForDay(
  year: number,
  month: number,
  day: number,
  calc: PrayerTimeCalculation
): PrayerTimes {
  const jd = computeJD(year, month, day);
  const params = CALCULATION_METHODS[calc.method];

  const decl = computeSunDeclination(jd);
  const eqt = computeEquationOfTime(jd);

  const fajrTime = computeSunriseSunset(calc.latitude, calc.longitude, jd, params.fajrAngle, true);
  const sunriseTime = computeSunriseSunset(calc.latitude, calc.longitude, jd, 0.833, true);
  const sunsetTime = computeSunriseSunset(calc.latitude, calc.longitude, jd, 0.833, false);
  const ishaTime = computeSunriseSunset(calc.latitude, calc.longitude, jd, params.ishaAngle, false);

  const dhuhrTime = 12 + eqt - calc.longitude / 15;
  const asrAngle = computeAsr(calc.latitude, decl, params.asrFactor);
  const asrTime = dhuhrTime + (90 - toDegrees(Math.asin(Math.sin(decl) * Math.sin(toRadians(calc.latitude)) + Math.cos(decl) * Math.cos(toRadians(calc.latitude)) * Math.cos(toRadians(90 - asrAngle))))) / 15;
  const maghribTime = sunsetTime;

  return {
    fajr: formatTime(fajrTime),
    sunrise: formatTime(sunriseTime),
    dhuhr: formatTime(dhuhrTime),
    asr: formatTime(asrTime),
    maghrib: formatTime(maghribTime),
    isha: formatTime(ishaTime),
  };
}

export function calculatePrayerTimes(date: Date, calc: PrayerTimeCalculation): PrayerTimes {
  return computePrayerTimesForDay(date.getFullYear(), date.getMonth() + 1, date.getDate(), calc);
}

export function getNextPrayer(times: PrayerTimes): { name: string; time: string } {
  const now = new Date();
  const currentTime = formatTime(now.getHours() + now.getMinutes() / 60);

  const prayers: { name: string; time: string }[] = [
    { name: "Fajr", time: times.fajr },
    { name: "Sunrise", time: times.sunrise },
    { name: "Dhuhr", time: times.dhuhr },
    { name: "Asr", time: times.asr },
    { name: "Maghrib", time: times.maghrib },
    { name: "Isha", time: times.isha },
  ];

  for (const prayer of prayers) {
    if (prayer.time > currentTime) {
      return prayer;
    }
  }

  return prayers[0];
}

export function getTimeUntilPrayer(nextPrayer: { name: string; time: string }): string {
  const now = new Date();
  const [h, m] = nextPrayer.time.split(":").map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const diff = target.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function getPrayerTimesForMonth(
  year: number,
  month: number,
  calc: PrayerTimeCalculation
): PrayerTimes[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const results: PrayerTimes[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    results.push(computePrayerTimesForDay(year, month, day, calc));
  }
  return results;
}

export { CALCULATION_METHODS };
export type { PrayerTimeCalculation };
