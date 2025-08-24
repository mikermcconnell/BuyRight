import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.buyright.app',
  appName: 'BuyRight',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'buyright.app',
    // Use localhost during development
    url: 'http://localhost:3005',
    cleartext: true
  },
  android: {
    backgroundColor: '#FAFAFA',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#58CC02',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#58CC02',
      sound: 'beep.wav'
    }
  }
};

export default config;
