import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.classmate.app',
  appName: 'ClassMate',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    // Disable iOS bounce effect for more native feel
    scrollEnabled: false
  },
  android: {
    // Use AndroidX libraries
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0A0A0F",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#6B3894",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
