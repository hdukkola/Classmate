# 🔧 ClassMate Native - Troubleshooting Guide

## Common Issues & Solutions

---

## 🍎 iOS Issues

### ❌ "Could not find Xcode"

**Problem:** Xcode is not installed or not set as default.

**Solution:**
```bash
# Install Xcode from Mac App Store (7+ GB download)
# After installation:
sudo xcode-select --switch /Applications/Xcode.app
xcode-select --install
```

---

### ❌ "No provisioning profiles found"

**Problem:** You need to sign your app with an Apple ID.

**Solution:**
1. Open Xcode
2. Go to Signing & Capabilities tab
3. Check "Automatically manage signing"
4. Select your Team (use your Apple ID)
5. Xcode will create a free development profile

**Note:** Free Apple ID works for testing on your own devices. App Store submission requires $99/year Apple Developer Program.

---

### ❌ White screen / App crashes on launch

**Problem:** Web files not synced or incorrect path.

**Solution:**
```bash
# Clean and rebuild
rm -rf ios/App/public
npm run build
npx cap sync ios
```

In Xcode: Product → Clean Build Folder (⌘⇧K)

---

### ❌ "Module 'Capacitor' not found"

**Problem:** CocoaPods dependencies not installed.

**Solution:**
```bash
cd ios/App
pod install
cd ../..
npx cap sync ios
```

If that fails:
```bash
sudo gem install cocoapods
pod repo update
cd ios/App
pod install
```

---

### ❌ App doesn't fill the whole screen (black bars)

**Problem:** Launch screen or safe area issues.

**Solution:**
1. Check `index.html` has `viewport-fit=cover`
2. In Xcode: Select App target → General → App Icons and Launch Screen
3. Make sure "Launch Screen" is set

---

### ❌ "Failed to verify bitcode" when archiving

**Problem:** Old Xcode build setting.

**Solution:**
1. In Xcode: Select App target
2. Build Settings → Search "bitcode"
3. Set "Enable Bitcode" to **NO**

---

## 🤖 Android Issues

### ❌ "Android SDK not found"

**Problem:** Android Studio or SDK not installed/configured.

**Solution:**
1. Install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio → Settings → Appearance & Behavior → System Settings → Android SDK
3. Install at least one SDK version (API 30+ recommended)
4. Set environment variable:
   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

---

### ❌ Gradle build fails

**Problem:** Gradle version mismatch or Java version issue.

**Solution:**
1. Make sure you have JDK 11 or higher:
   ```bash
   java -version
   ```
2. If Java version is wrong, install JDK 11+:
   ```bash
   brew install openjdk@11
   ```
3. In Android Studio: File → Invalidate Caches → Restart

---

### ❌ "Manifest merger failed"

**Problem:** Conflicting Android manifest entries.

**Solution:**
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

If issue persists, check `android/app/src/main/AndroidManifest.xml` for duplicate entries.

---

### ❌ App crashes immediately on Android

**Problem:** Usually JavaScript error or missing permissions.

**Solution:**
1. In Android Studio: View → Tool Windows → Logcat
2. Filter by "chromium" to see JavaScript errors
3. Check console for specific error messages

Common fix:
```bash
npm run build
npx cap sync android
```

---

### ❌ Blank white screen on Android

**Problem:** Web files not loading or CORS issue.

**Solution:**
1. Check `capacitor.config.ts` has `androidScheme: 'https'`
2. Rebuild:
   ```bash
   npm run build
   npx cap sync android
   ```
3. In Android Studio: Build → Clean Project, then Build → Rebuild Project

---

### ❌ "Failed to find target with hash string 'android-XX'"

**Problem:** Missing Android SDK platform version.

**Solution:**
1. Open Android Studio
2. Tools → SDK Manager
3. Install the required SDK Platform (usually latest stable version)
4. Sync again:
   ```bash
   npx cap sync android
   ```

---

## 🌐 General Capacitor Issues

### ❌ "Platform not added"

**Problem:** You haven't added iOS or Android platform yet.

**Solution:**
```bash
# For iOS
npx cap add ios

# For Android
npx cap add android
```

Only run once per platform!

---

### ❌ Changes not showing in native app

**Problem:** You edited files but didn't sync.

**Solution:**
```bash
# After any code changes:
npm run build
npx cap sync

# Or for specific platform:
npm run cap:sync:ios
npm run cap:sync:android
```

---

### ❌ "Cannot find module '@capacitor/core'"

**Problem:** Capacitor not installed.

**Solution:**
```bash
npm install @capacitor/core @capacitor/cli
```

---

### ❌ API calls failing in native app

**Problem:** CORS or network configuration issue.

**Solution:**

1. **Check Supabase URL** - Make sure it's accessible from native app
2. **Update Supabase config** in `src/config/supabase.ts`:
   ```typescript
   // Should work in both web and native
   const supabaseUrl = 'https://your-project.supabase.co';
   const supabaseAnonKey = 'your-anon-key';
   ```

3. **Android:** Update `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <application
       android:usesCleartextTraffic="true">
   ```

4. **iOS:** Check `ios/App/App/Info.plist` for network permissions

---

### ❌ localStorage not persisting

**Problem:** Native apps have stricter storage rules.

**Solution:**
Use Capacitor Preferences instead:
```bash
npm install @capacitor/preferences
```

```typescript
import { Preferences } from '@capacitor/preferences';

// Set
await Preferences.set({ key: 'name', value: 'Max' });

// Get
const { value } = await Preferences.get({ key: 'name' });
```

---

### ❌ Fonts not loading

**Problem:** Font paths incorrect for native platform.

**Solution:**

Make sure fonts are in `public/` folder or properly bundled. If using Google Fonts (like Inter), they should load fine from CDN.

For local fonts, put them in `/public/fonts/` and reference them:
```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.woff2') format('woff2');
}
```

Then sync:
```bash
npm run cap:sync
```

---

## 🐛 Debugging Tips

### iOS Debugging:
1. Run app in simulator
2. Open Safari → Develop → Simulator → [Your App]
3. Use Web Inspector just like browser DevTools!

### Android Debugging:
1. Run app on device/emulator
2. Open Chrome → `chrome://inspect`
3. Click "inspect" under your app
4. Use DevTools!

### Check Capacitor Logs:
```bash
# iOS
npx cap run ios --livereload

# Android
npx cap run android --livereload
```

---

## 📦 Build Issues

### ❌ "Build failed" with no clear error

**Nuclear Option (when nothing else works):**
```bash
# Remove platforms
rm -rf ios android

# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Rebuild everything
npm run build

# Re-add platforms
npx cap add ios
npx cap add android

# Sync
npx cap sync
```

---

### ❌ Out of disk space

**Problem:** Xcode/Android simulators take up lots of space.

**Solution:**

Clean Xcode derived data:
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

Clean Android build cache:
```bash
cd android
./gradlew clean
```

---

## 🔐 Permission Issues

### Camera/Microphone/Location not working

**Problem:** Permissions not declared.

**iOS Solution:**
Edit `ios/App/App/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan documents</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo access to upload images</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location for nearby features</string>
```

**Android Solution:**
Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

Then sync:
```bash
npx cap sync
```

---

## ⚡ Performance Issues

### App feels slow/laggy

**Solutions:**
1. Test on **real device**, not just simulator
2. Build in **Release mode** (simulators run Debug mode which is slower)
3. Check for memory leaks in React components
4. Optimize large images
5. Use production build:
   ```bash
   npm run build
   npx cap sync
   ```

---

## 🆘 Still Stuck?

1. **Check Capacitor Logs:**
   ```bash
   npx cap doctor
   ```

2. **Check Platform Specific Issues:**
   ```bash
   # iOS
   cd ios/App
   pod install
   
   # Android
   cd android
   ./gradlew clean
   ```

3. **Verify Your Config:**
   ```bash
   cat capacitor.config.ts
   ```

4. **Check Official Docs:**
   - [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
   - [Capacitor Android Guide](https://capacitorjs.com/docs/android)
   - [Capacitor Troubleshooting](https://capacitorjs.com/docs/basics/troubleshooting)

5. **Common Error Messages:**
   - Google the **exact error** + "capacitor" + "ios/android"
   - Check [Capacitor GitHub Issues](https://github.com/ionic-team/capacitor/issues)

---

## ✅ Prevention Checklist

Before running into issues, always:

- [ ] Run `npm run build` before syncing
- [ ] Run `npx cap sync` after code changes
- [ ] Keep Capacitor updated: `npm update @capacitor/core @capacitor/cli`
- [ ] Test on real devices, not just simulators
- [ ] Check console/logcat for JavaScript errors
- [ ] Verify API endpoints work from native app

---

## 🎯 Quick Fix Commands

```bash
# The "turn it off and on again" for Capacitor
npm run build && npx cap sync && npx cap copy

# Clean iOS
rm -rf ios/App/Pods ios/App/Podfile.lock
cd ios/App && pod install && cd ../..

# Clean Android
cd android && ./gradlew clean && cd ..

# Nuclear option (start fresh)
rm -rf ios android
npx cap add ios
npx cap add android
npx cap sync
```

---

**Remember:** Most issues are solved by rebuilding and syncing! When in doubt:
```bash
npm run build
npx cap sync
```

Good luck! 🚀
