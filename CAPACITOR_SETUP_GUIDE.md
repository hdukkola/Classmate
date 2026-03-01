# 🚀 ClassMate - Capacitor Native App Setup Guide

## ✅ What We Just Set Up

Your ClassMate web app is now ready to become a **real native iOS/Android app**! Here's what's configured:

### Files Created:
- ✅ `capacitor.config.ts` - Main Capacitor configuration
- ✅ `index.html` - Entry point for the app
- ✅ `src/main.tsx` - React initialization with Capacitor
- ✅ Updated `package.json` with native build scripts

### Packages Installed:
- ✅ `@capacitor/core` - Core Capacitor functionality
- ✅ `@capacitor/cli` - Command-line tools
- ✅ `@capacitor/ios` - iOS platform support
- ✅ `@capacitor/android` - Android platform support

---

## 📱 Next Steps - How to Build Your Native App

### 🍎 For iOS (Mac with Xcode Required)

1. **Build your web app:**
   ```bash
   npm run build
   ```

2. **Add iOS platform:**
   ```bash
   npx cap add ios
   ```

3. **Sync your web code to iOS:**
   ```bash
   npm run cap:sync:ios
   ```

4. **Open in Xcode:**
   ```bash
   npm run cap:open:ios
   ```

5. **In Xcode:**
   - Select a simulator (iPhone 13, iPhone 15 Pro, etc.)
   - Click the ▶️ Play button to run
   - Your app will launch on the iOS simulator!

**Quick command (does everything):**
```bash
npm run ios
```

---

### 🤖 For Android (Android Studio Required)

1. **Build your web app:**
   ```bash
   npm run build
   ```

2. **Add Android platform:**
   ```bash
   npx cap add android
   ```

3. **Sync your web code to Android:**
   ```bash
   npm run cap:sync:android
   ```

4. **Open in Android Studio:**
   ```bash
   npm run cap:open:android
   ```

5. **In Android Studio:**
   - Wait for Gradle to sync
   - Select an emulator or connected device
   - Click the ▶️ Run button
   - Your app will launch!

**Quick command (does everything):**
```bash
npm run android
```

---

## 🛠️ Development Workflow

### During Development:

1. **Make changes to your web app** (edit React components, CSS, etc.)

2. **Rebuild and sync:**
   ```bash
   npm run cap:sync
   ```
   This builds your web app and copies it to both iOS and Android.

3. **Refresh in Xcode/Android Studio** and re-run

### Hot Reload (Advanced):
You can run your app in the simulator and point it to your local dev server:

1. Run your web dev server:
   ```bash
   npm run dev
   ```

2. Update `capacitor.config.ts` temporarily:
   ```typescript
   server: {
     url: 'http://localhost:5173', // Your Vite dev server
     cleartext: true
   }
   ```

3. Run `npx cap sync` and launch in Xcode/Android Studio
4. Now changes update live! (You'll still need to refresh the app)

---

## 📦 App Configuration

### Update App Details in `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.yourcompany.classmate',  // Change this to your bundle ID
  appName: 'ClassMate',                 // Display name on home screen
  webDir: 'dist',                       // Where Vite builds to
  // ... rest of config
};
```

### iOS Bundle ID:
- Format: `com.yourname.classmate` or `com.yourcompany.classmate`
- Must be unique in the App Store
- Set in `capacitor.config.ts` and in Xcode (Project Settings → General → Bundle Identifier)

### Android Package Name:
- Same as iOS bundle ID
- Set in `capacitor.config.ts`
- Also in `android/app/build.gradle` (after running `npx cap add android`)

---

## 🎨 App Icons & Splash Screens

### Creating App Icons:

1. **Generate icon sets** from your ClassMate logo:
   - iOS needs multiple sizes (20×20 to 1024×1024)
   - Android needs multiple sizes too
   - Use online tools like [AppIcon.co](https://www.appicon.co/) or [MakeAppIcon](https://makeappicon.com/)

2. **For iOS:**
   - In Xcode: Open `ios/App/App/Assets.xcassets/AppIcon.appiconset`
   - Drag and drop your icons

3. **For Android:**
   - Place icons in `android/app/src/main/res/mipmap-*` folders
   - Or use Android Studio's Image Asset tool

### Splash Screen:

The splash screen is already configured in `capacitor.config.ts`:
- Background color: `#0A0A0F` (your dark theme)
- Spinner color: `#6B3894` (your purple brand color)
- Duration: 2 seconds

To customize further, edit the `SplashScreen` section in `capacitor.config.ts`.

---

## 🔌 Adding Native Features

### Want to add native capabilities? Install plugins:

**Haptic Feedback:**
```bash
npm install @capacitor/haptics
```

**Push Notifications:**
```bash
npm install @capacitor/push-notifications
```

**Camera Access:**
```bash
npm install @capacitor/camera
```

**Local Notifications:**
```bash
npm install @capacitor/local-notifications
```

**Status Bar Control:**
```bash
npm install @capacitor/status-bar
```

Then import in your React code:
```typescript
import { Haptics } from '@capacitor/haptics';

// Trigger haptic feedback
await Haptics.impact({ style: 'medium' });
```

After installing plugins, always run:
```bash
npm run cap:sync
```

---

## 🚢 Deploying to App Stores

### iOS App Store:

1. **Set up Apple Developer Account** ($99/year)
2. **In Xcode:**
   - Set your Team in Signing & Capabilities
   - Set Bundle Identifier to match your config
   - Archive your app (Product → Archive)
   - Upload to App Store Connect
3. **Submit for review** in App Store Connect

### Google Play Store:

1. **Create Google Play Developer Account** ($25 one-time)
2. **In Android Studio:**
   - Build → Generate Signed Bundle/APK
   - Create a keystore
   - Build release AAB
3. **Upload to Google Play Console**
4. **Submit for review**

---

## 📊 Current App Structure

```
ClassMate/
├── capacitor.config.ts       # Capacitor settings
├── index.html                # App entry point
├── src/
│   ├── main.tsx              # React initialization
│   └── app/
│       ├── App.tsx           # Main app component
│       ├── screens/          # All your screens
│       └── ...               # Rest of your app
├── ios/                      # (Created after 'npx cap add ios')
│   └── App.xcworkspace       # Open this in Xcode
└── android/                  # (Created after 'npx cap add android')
    └── ...                   # Open folder in Android Studio
```

---

## 🐛 Troubleshooting

### "Platform not found" error:
Run `npx cap add ios` or `npx cap add android` first.

### Changes not appearing in native app:
Always run `npm run cap:sync` after making changes.

### iOS build fails:
- Make sure you have Xcode installed (Mac only)
- Update CocoaPods: `sudo gem install cocoapods`
- Run `npx cap sync ios` again

### Android build fails:
- Make sure Android Studio is installed
- Set `ANDROID_HOME` environment variable
- Check that you have JDK 11 or higher

### App is blank/white screen:
- Check browser console in Xcode (Safari → Develop → Simulator)
- Make sure `webDir: 'dist'` matches your Vite build output
- Run `npm run build` before syncing

---

## 🎯 Quick Command Reference

| Command | What it does |
|---------|--------------|
| `npm run build` | Build your web app |
| `npm run dev` | Run development server |
| `npx cap add ios` | Add iOS platform |
| `npx cap add android` | Add Android platform |
| `npm run cap:sync` | Build + sync to all platforms |
| `npm run ios` | Build, sync, and open Xcode |
| `npm run android` | Build, sync, and open Android Studio |
| `npx cap open ios` | Open Xcode (without building) |
| `npx cap open android` | Open Android Studio (without building) |

---

## 💡 Pro Tips

1. **Test on real devices** - Simulators are great, but test on actual phones too
2. **Use Safari Web Inspector** for debugging iOS apps (Safari → Develop → Simulator)
3. **Use Chrome DevTools** for debugging Android apps (chrome://inspect)
4. **Keep your Capacitor updated**: `npm install @capacitor/core@latest @capacitor/cli@latest`
5. **After major changes**, delete `ios` and `android` folders and re-add platforms

---

## 🎊 You're Ready!

Your ClassMate app is now configured to run as a native iOS and Android app! The transition from web → native is complete. All your existing code works - you just wrapped it in a native container. 🚀

**Next step:** Run `npm run ios` or `npm run android` to see your app running natively!

Need help? Check the [Capacitor Docs](https://capacitorjs.com/docs) or ask me! 💜
