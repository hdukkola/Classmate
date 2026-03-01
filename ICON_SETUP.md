# 📱 App Icon Setup for ClassMate

## Current Status
Your purple ClassMate logo is already in the app and will be used as a placeholder icon when you first build.

## To Add a Custom Icon (Optional - Do This Later)

### For Best Results:
1. Export your purple ClassMate logo as a **1024x1024 PNG** (high resolution)
2. Use a tool to generate all icon sizes:
   - **Online Tool**: https://www.appicon.co/ (free, easy)
   - **CLI Tool**: `npm install -g @capacitor/assets` then run `npx capacitor-assets generate`

### Quick Manual Setup (Not Recommended):

#### iOS Icons:
Place in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`:
- `icon-20.png` (20x20)
- `icon-29.png` (29x29)
- `icon-40.png` (40x40)
- `icon-60.png` (60x60)
- `icon-76.png` (76x76)
- `icon-83.5.png` (83.5x83.5)
- `icon-1024.png` (1024x1024)

And all the @2x and @3x variants.

#### Android Icons:
Place in `android/app/src/main/res/`:
- `mipmap-ldpi/ic_launcher.png` (36x36)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

---

## 🎯 For Now:
**Don't worry about this!** Capacitor will use a default placeholder icon. You can add your custom icon later after you've tested the app and confirmed everything works.

---

## After Adding Icons:
Run this to sync the new icons to your native projects:
```bash
npm run cap:sync
```
