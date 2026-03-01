# ⚡ ClassMate - Quick Start to Native App

## 🎯 TL;DR - Get Your App Running on iOS/Android

### For iOS (Mac only):
```bash
# 1. Build your web app
npm run build

# 2. Add iOS platform (first time only)
npx cap add ios

# 3. Open in Xcode and run
npm run ios
```

### For Android:
```bash
# 1. Build your web app
npm run build

# 2. Add Android platform (first time only)
npx cap add android

# 3. Open in Android Studio and run
npm run android
```

---

## 📋 Prerequisites

### For iOS Development:
- ✅ Mac computer (required for iOS development)
- ✅ [Xcode](https://apps.apple.com/us/app/xcode/id497799835) installed from Mac App Store
- ✅ Xcode Command Line Tools: `xcode-select --install`

### For Android Development:
- ✅ [Android Studio](https://developer.android.com/studio) installed
- ✅ Android SDK installed (through Android Studio)
- ✅ JDK 11+ installed

---

## 🚀 Your First Build

1. **Make sure all dependencies are installed:**
   ```bash
   npm install
   ```

2. **Build your web app:**
   ```bash
   npm run build
   ```
   This creates the `dist/` folder with your compiled app.

3. **Choose your platform:**

   **For iOS:**
   ```bash
   npx cap add ios
   npm run cap:open:ios
   ```

   **For Android:**
   ```bash
   npx cap add android
   npm run cap:open:android
   ```

4. **Run in the IDE:**
   - **Xcode:** Select a simulator (iPhone 15 Pro recommended) → Click ▶️ Play
   - **Android Studio:** Wait for Gradle sync → Select emulator → Click ▶️ Run

5. **See your app running natively! 🎉**

---

## 🔄 After Making Changes

Every time you update your React code:

```bash
# Build and sync to native platforms
npm run cap:sync

# Or sync to specific platform
npm run cap:sync:ios
npm run cap:sync:android
```

Then refresh/rebuild in Xcode or Android Studio.

---

## 💡 Common Commands

```bash
# Development
npm run dev                 # Run web dev server
npm run build              # Build for production

# Capacitor - Sync
npm run cap:sync           # Sync to all platforms
npm run cap:sync:ios       # Sync to iOS only
npm run cap:sync:android   # Sync to Android only

# Capacitor - Open IDE
npm run cap:open:ios       # Open Xcode
npm run cap:open:android   # Open Android Studio

# Capacitor - All-in-one
npm run ios                # Build + sync + open Xcode
npm run android            # Build + sync + open Android Studio
```

---

## ❓ Need Help?

- Read the full guide: `CAPACITOR_SETUP_GUIDE.md`
- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS Deployment Guide](https://capacitorjs.com/docs/ios)
- [Android Deployment Guide](https://capacitorjs.com/docs/android)

---

## ✨ What's Next?

1. **Test on real device** (not just simulator)
2. **Add native features** (camera, notifications, haptics)
3. **Customize app icon and splash screen**
4. **Deploy to App Store / Play Store**

Check `CAPACITOR_SETUP_GUIDE.md` for detailed instructions on all of these! 🚀
