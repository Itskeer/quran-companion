const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export function calculateQiblaDirection(latitude: number, longitude: number): number {
  const lat = (latitude * Math.PI) / 180;
  const lng = (longitude * Math.PI) / 180;
  const kLat = (KAABA_LAT * Math.PI) / 180;
  const kLng = (KAABA_LNG * Math.PI) / 180;

  const dLng = kLng - lng;
  const y = Math.sin(dLng);
  const x = Math.cos(lat) * Math.tan(kLat) - Math.sin(lat) * Math.cos(dLng);
  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  if (qibla < 0) qibla += 360;
  return qibla;
}

export function getQiblaDirectionName(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;

  if (normalized >= 337.5 || normalized < 22.5) return "N";
  if (normalized >= 22.5 && normalized < 67.5) return "NE";
  if (normalized >= 67.5 && normalized < 112.5) return "E";
  if (normalized >= 112.5 && normalized < 157.5) return "SE";
  if (normalized >= 157.5 && normalized < 202.5) return "S";
  if (normalized >= 202.5 && normalized < 247.5) return "SW";
  if (normalized >= 247.5 && normalized < 292.5) return "W";
  if (normalized >= 292.5 && normalized < 337.5) return "NW";
  return "N";
}

export function getQiblaDistance(latitude: number, longitude: number): number {
  const R = 6371;
  const lat1 = (latitude * Math.PI) / 180;
  const lat2 = (KAABA_LAT * Math.PI) / 180;
  const dLat = ((KAABA_LAT - latitude) * Math.PI) / 180;
  const dLng = ((KAABA_LNG - longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    });
  });
}
