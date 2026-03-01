# ClassMate Mobile (Expo)

## Prerequisites
- Node.js 18+
- npm or pnpm
- Expo CLI (optional; `npx expo` works)

## Install
```bash
cd mobile
npm install
```

## Run
```bash
npm run start
```

Then press:
- `a` for Android emulator/device
- `i` for iOS simulator (macOS only)

## Notes
- This app ports the web flow to React Native:
  - Auth (login/signup)
  - Tab navigation
  - Home, Grades, GPA, Analytics, Calendar, AI, Settings
  - Class detail stack route
- Web-only imports and `figma:asset/...` references were removed from the mobile app.
