
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9e5ac6a523e749fe84ae3d52ddda0949',
  appName: 'imanes-bloom-garden',
  webDir: 'dist',
  server: {
    url: 'https://9e5ac6a5-23e7-49fe-84ae-3d52ddda0949.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_flower",
      iconColor: "#8BC34A",
      sound: "blooming_sound.wav",
    },
    BackgroundRunner: {
      label: "Steps Tracker",
      interval: 900, // 15 minutes in seconds
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
