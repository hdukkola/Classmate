import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Check if the app is running on a native platform (iOS/Android)
 */
export const isNative = () => Capacitor.isNativePlatform();

/**
 * Check if running on iOS
 */
export const isIOS = () => Capacitor.getPlatform() === 'ios';

/**
 * Check if running on Android
 */
export const isAndroid = () => Capacitor.getPlatform() === 'android';

/**
 * Check if running in web browser
 */
export const isWeb = () => Capacitor.getPlatform() === 'web';

/**
 * Get the current platform name
 */
export const getPlatform = () => Capacitor.getPlatform();

/**
 * Convert web URLs to native file paths if needed
 */
export const convertFileSrc = (filePath: string) => Capacitor.convertFileSrc(filePath);

/**
 * Hide the splash screen when app is ready
 */
export const hideSplashScreen = async () => {
  if (isNative()) {
    await SplashScreen.hide();
  }
};

/**
 * Log platform info (useful for debugging)
 */
export const logPlatformInfo = () => {
  console.log('🚀 ClassMate Platform Info:');
  console.log('  Platform:', getPlatform());
  console.log('  Is Native:', isNative());
  console.log('  Is iOS:', isIOS());
  console.log('  Is Android:', isAndroid());
  console.log('  Is Web:', isWeb());
  
  // Hide splash screen after logging
  hideSplashScreen();
};