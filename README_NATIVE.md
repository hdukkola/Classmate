# 📱 ClassMate - Native App Edition

> **Your premium iOS student productivity app is now ready for native deployment!**

---

## 🌟 What is This?

**ClassMate** is a premium iOS-style student productivity app featuring:

- 🎨 Glassmorphism & gradient UI design
- ✨ Smooth Motion animations
- 📊 Analytics & GPA tracking
- 🤖 AI-powered insights
- 📅 Calendar & schedule management
- 🔐 Supabase authentication
- 🌓 Dark mode with purple theme

**Now powered by Capacitor for native iOS & Android deployment!**

---

## 🚀 Quick Start

### Run in Web Browser (Current Setup)
```bash
npm install
npm run dev
```
Open http://localhost:5173

---

### Run on iOS (Mac Only)
```bash
npm run build
npx cap add ios
npm run ios
```
Select iPhone simulator in Xcode → Click ▶️

---

### Run on Android
```bash
npm run build
npx cap add android
npm run android
```
Select emulator in Android Studio → Click ▶️

---

## 📚 Documentation

| Guide | Purpose | When to Read |
|-------|---------|--------------|
| **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** | ✅ Setup summary | Start here! |
| **[QUICK_START_NATIVE.md](QUICK_START_NATIVE.md)** | ⚡ 5-min quick start | Want to run native NOW |
| **[CAPACITOR_SETUP_GUIDE.md](CAPACITOR_SETUP_GUIDE.md)** | 📖 Complete guide | Detailed walkthrough |
| **[WEB_VS_NATIVE_COMPARISON.md](WEB_VS_NATIVE_COMPARISON.md)** | 🆚 Understand differences | Learn what changed |
| **[TROUBLESHOOTING_NATIVE.md](TROUBLESHOOTING_NATIVE.md)** | 🔧 Fix issues | Having problems? |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion** - Animations
- **Recharts** - Data visualization
- **React Router** - Navigation

### Backend
- **Supabase** - Authentication & database
- **Edge Functions** - Serverless API

### Native
- **Capacitor** - Native iOS/Android wrapper
- **Xcode** - iOS development
- **Android Studio** - Android development

---

## 📱 Supported Platforms

| Platform | Status | Deploy To |
|----------|--------|-----------|
| 🌐 Web | ✅ Working | Any web host |
| 🍎 iOS | ✅ Ready | App Store |
| 🤖 Android | ✅ Ready | Play Store |

---

## 🎨 Features

### Screens
1. **Home** - Hero GPA card with animated progress ring
2. **Grades** - Class list with performance indicators
3. **GPA** - Detailed GPA breakdown
4. **Analytics** - Risk meter, trend charts, projections
5. **AI** - AI-powered study insights
6. **Calendar** - Schedule & assignment tracking
7. **Settings** - Theme, account, preferences

### Design
- Premium glassmorphism effects
- Animated gradient backgrounds
- Purple/indigo color palette
- Dark mode optimized
- iOS-native typography (Inter Tight)
- Smooth 60fps animations

---

## 🔧 Development

### Web Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Native Development
```bash
npm run cap:sync           # Build and sync to all platforms
npm run cap:sync:ios       # Sync to iOS only
npm run cap:sync:android   # Sync to Android only

npm run cap:open:ios       # Open Xcode
npm run cap:open:android   # Open Android Studio

npm run ios                # Build + sync + open Xcode
npm run android            # Build + sync + open Android Studio
```

---

## 📦 Project Structure

```
ClassMate/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main app component
│   │   ├── Root.tsx                   # Root layout
│   │   ├── routes.tsx                 # React Router config
│   │   ├── screens/                   # All app screens
│   │   │   ├── Home.tsx
│   │   │   ├── Grades.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── ...
│   │   ├── components/                # Reusable components
│   │   ├── contexts/                  # React contexts
│   │   ├── data/                      # Mock data
│   │   ├── services/                  # API services
│   │   └── utils/                     # Utilities
│   │       └── capacitor.ts          # ← Native helpers
│   ├── config/                        # Configuration
│   ├── lib/                           # Libraries
│   └── styles/                        # Global styles
│       ├── index.css
│       ├── fonts.css
│       ├── tailwind.css
│       └── theme.css                  # CSS custom properties
│
├── supabase/                          # Backend
│   └── functions/
│       └── server/                    # Edge functions
│
├── capacitor.config.ts                # ← Capacitor config
├── index.html                         # ← App entry point
├── vite.config.ts                     # Vite config
└── package.json                       # Dependencies & scripts
```

---

## 🎯 Workflow

### Making Changes

1. **Edit your code** (components, styles, etc.)
2. **Test in browser** (`npm run dev`)
3. **Build for native** (`npm run cap:sync`)
4. **Test in Xcode/Android Studio**

### Before Committing

```bash
npm run build        # Make sure it builds
npm run cap:sync     # Make sure native builds work
```

---

## 🔐 Environment Setup

### Supabase (Already Configured)
The app uses Supabase for:
- User authentication (signup/login)
- Database storage
- Edge functions (server API)

Environment variables are handled via Supabase dashboard (no local .env needed for dev).

---

## 🚢 Deployment

### Web (Current)
Deploy the `dist/` folder to any static host:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### iOS App Store
1. Open in Xcode (`npm run ios`)
2. Set Bundle ID and Team
3. Archive (Product → Archive)
4. Upload to App Store Connect
5. Submit for review

### Android Play Store
1. Open in Android Studio (`npm run android`)
2. Generate signed APK/AAB
3. Upload to Play Console
4. Submit for review

---

## 📱 Native Features (Optional)

Want to add native capabilities? Install plugins:

```bash
# Haptic feedback
npm install @capacitor/haptics

# Camera
npm install @capacitor/camera

# Push notifications
npm install @capacitor/push-notifications

# Status bar customization
npm install @capacitor/status-bar

# Better storage
npm install @capacitor/preferences
```

After installing, sync:
```bash
npm run cap:sync
```

Usage example:
```typescript
import { Haptics } from '@capacitor/haptics';

// Trigger haptic feedback
await Haptics.impact({ style: 'medium' });
```

---

## 🐛 Debugging

### Web
Use browser DevTools as usual.

### iOS
1. Run app in simulator
2. Safari → Develop → Simulator → [ClassMate]
3. Use Web Inspector

### Android
1. Run app on device/emulator
2. Chrome → `chrome://inspect`
3. Click "inspect"

---

## 🎓 Learn More

- [Capacitor Docs](https://capacitorjs.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)
- [Motion Docs](https://motion.dev)
- [Supabase Docs](https://supabase.com/docs)

---

## 📄 License

Private project - ClassMate student productivity app.

---

## 🆘 Support

Having issues?

1. Check `TROUBLESHOOTING_NATIVE.md`
2. Run `npx cap doctor`
3. Review error logs in Xcode/Android Studio
4. Check [Capacitor GitHub Issues](https://github.com/ionic-team/capacitor/issues)

---

## ✨ Credits

Built with:
- React + TypeScript
- Tailwind CSS
- Capacitor
- Supabase
- Motion (Framer Motion)
- Recharts

Deployed via Figma Make.

---

**Ready to build your native app? Start with [QUICK_START_NATIVE.md](QUICK_START_NATIVE.md)!** 🚀
