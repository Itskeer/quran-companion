import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qurancompanion.app',
  appName: 'Quran Companion',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#0F5132',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
      showSpinner: false,
    },
    LocalNotifications: {
      smallIcon: 'icon-192',
      iconColor: '#0F5132',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F5132',
    },
  },
};

export default config;
