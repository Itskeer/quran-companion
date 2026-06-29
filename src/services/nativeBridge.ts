import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();
const isAndroid = Capacitor.getPlatform() === "android";
const isIOS = Capacitor.getPlatform() === "ios";

export function getPlatform() {
  if (isAndroid) return "android";
  if (isIOS) return "ios";
  return "web";
}

// Clipboard
export async function copyToClipboard(text: string): Promise<void> {
  if (!isNative) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const { Clipboard } = await import("@capacitor/clipboard");
  await Clipboard.write({ string: text });
}

// Share
export async function shareContent(title: string, text: string): Promise<void> {
  if (!isNative) {
    if (navigator.share) {
      await navigator.share({ title, text });
    }
    return;
  }
  const { Share } = await import("@capacitor/share");
  await Share.share({ title, text });
}

// Preferences (localStorage replacement for native)
export async function setPreference(key: string, value: string): Promise<void> {
  if (!isNative) {
    localStorage.setItem(key, value);
    return;
  }
  const { Preferences } = await import("@capacitor/preferences");
  await Preferences.set({ key, value });
}

export async function getPreference(key: string): Promise<string | null> {
  if (!isNative) {
    return localStorage.getItem(key);
  }
  const { Preferences } = await import("@capacitor/preferences");
  const result = await Preferences.get({ key });
  return result.value;
}

export async function removePreference(key: string): Promise<void> {
  if (!isNative) {
    localStorage.removeItem(key);
    return;
  }
  const { Preferences } = await import("@capacitor/preferences");
  await Preferences.remove({ key });
}

// Haptics
export async function vibrate(duration: number = 10): Promise<void> {
  if (!isNative) {
    if (navigator.vibrate) navigator.vibrate(duration);
    return;
  }
  const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
  await Haptics.impact({ style: ImpactStyle.Light });
}

export async function vibrateSuccess(): Promise<void> {
  if (!isNative) {
    if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
    return;
  }
  const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
  await Haptics.impact({ style: ImpactStyle.Medium });
}

// Local Notifications
export async function scheduleNotification(options: {
  title: string;
  body: string;
  id?: number;
  schedule?: { at: Date };
}): Promise<void> {
  if (!isNative) return;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  await LocalNotifications.schedule({
    notifications: [
      {
        title: options.title,
        body: options.body,
        id: options.id ?? Math.floor(Math.random() * 100000),
        schedule: options.schedule,
      },
    ],
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNative) return true;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const result = await LocalNotifications.requestPermissions();
  return result.display === "granted";
}

// Status Bar
export async function setStatusBarStyle(style: "light" | "dark"): Promise<void> {
  if (!isNative) return;
  const { StatusBar, Style } = await import("@capacitor/status-bar");
  await StatusBar.setStyle({ style: style === "light" ? Style.Light : Style.Dark });
}

// App lifecycle
export async function onAppResume(callback: () => void): Promise<void> {
  if (!isNative) {
    window.addEventListener("focus", callback);
    return;
  }
  const { App } = await import("@capacitor/app");
  await App.addListener("appStateChange", ({ isActive }) => {
    if (isActive) callback();
  });
}

export { isNative, isAndroid, isIOS };
