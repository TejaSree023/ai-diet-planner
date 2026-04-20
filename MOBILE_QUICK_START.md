# Mobile App Quick Start Guide

## What We Set Up

Your AI Diet Planner web app is now ready to be converted into native iOS and Android applications using **Capacitor**. 

### ✅ Installed Components
- `@capacitor/core` - Core Capacitor framework
- `@capacitor/ios` - iOS native support
- `@capacitor/android` - Android native support
- `@capacitor/device` - Device info access
- `@capacitor/geolocation` - Location services
- `@capacitor/local-notifications` - Push notifications
- `@capacitor/preferences` - Secure local storage
- `@capacitor/status-bar` - Status bar styling
- `@capacitor/app` - App lifecycle management

### 📁 New Directories Created
```
frontend/
  ├── ios/                 # Xcode project (ready to build)
  ├── android/             # Android Studio project (ready to build)
  ├── capacitor.config.json # Mobile app configuration
```

### 📄 New Files Created
1. **capacitor.config.json** - Mobile app settings
2. **frontend/src/services/mobileStorage.js** - Persistent storage service
3. **frontend/src/services/notificationService.js** - Push notifications
4. **frontend/src/services/geolocationService.js** - Location services
5. **MOBILE_BUILD_GUIDE.md** - Complete build instructions

## Quick Start (5 minutes)

### 1️⃣ First Build
```powershell
cd frontend
npm run build:mobile
```

### 2️⃣ Run on iOS Simulator (macOS only)
```powershell
npm run mobile:ios
```
This opens Xcode. Select iPhone simulator and press ▶️ to run.

### 3️⃣ Run on Android Emulator
```powershell
npm run mobile:android
```
This opens Android Studio. Select emulator and press ▶️ to run.

## Using Mobile Features

### Persistent Storage
```javascript
import { mobileStorage } from './services/mobileStorage';

// Save
await mobileStorage.set('token', 'abc123');

// Load
const token = await mobileStorage.get('token');

// Remove
await mobileStorage.remove('token');
```

### Notifications (Daily Reminders)
```javascript
import { notificationService } from './services/notificationService';

// Initialize (request permission)
await notificationService.initialize();

// Set water reminder at 9 AM daily
await notificationService.setWaterReminder(true, 9);

// Set meal reminder at 12 PM daily
await notificationService.setMealReminder(true, 12);

// Set weigh-in reminder at 7 AM daily
await notificationService.setWeighInReminder(true, 7);
```

### Location Services
```javascript
import { geolocationService } from './services/geolocationService';

// Get current location
const location = await geolocationService.getCurrentLocation();
console.log(location.latitude, location.longitude);

// Calculate distance (useful for finding nearby gyms)
const distance = geolocationService.calculateDistance(
  40.7128, -74.0060,  // User location
  40.7589, -73.9851   // Target location
);
console.log(`Distance: ${distance} km`);
```

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Build web app (required before mobile) |
| `npm run build:mobile` | Build web + sync to native apps |
| `npm run mobile:ios` | Open Xcode project |
| `npm run mobile:android` | Open Android Studio project |
| `npm run cap:update` | Sync code changes to native projects |
| `npm run cap:build:ios` | Build iOS app for App Store |
| `npm run cap:build:android` | Build Android app for Play Store |

## Architecture Overview

```
┌─────────────────────────────────────────┐
│      AI Diet Planner Web App            │
│   (React + Vite + Tailwind CSS)         │
└────────────┬────────────────────────────┘
             │
             ├─── BROWSER (web: localhost:5173)
             │
             └─── CAPACITOR ──┬──→ iOS App (App Store)
                              │
                              └──→ Android App (Play Store)
```

## What Works on Mobile

### ✅ Fully Supported
- User authentication (login/register)
- Profile creation and editing
- Diet plan generation
- Meal tracking and logging
- Progress tracking with charts
- Recipe browsing and favorites
- Chatbot interactions
- All dashboard features
- Local storage for offline access

### 🔄 Partially Supported
- Notifications (working, needs permission request)
- Geolocation (requires location permission)
- Network calls (works, but respect data limits on mobile)

### ⚠️ Not on Mobile Yet
- Dark/light mode toggle (CSS prepared but no UI control)
- File uploads (storage access)
- Camera access (future enhancement)
- Bluetooth (future enhancement)

## Platform-Specific Notes

### iOS
- Minimum target: iOS 13.0
- Requires Apple Developer account for App Store
- Certificate signing needed
- App Store review takes 24-48 hours

### Android
- Minimum target: Android 5.1 (API 21)
- Requires Google Play Developer account ($25 one-time)
- APK/AAB signing needed
- Play Store review takes 2-3 hours typically

## Next Steps

1. **Test on Device/Emulator**
   ```powershell
   npm run build:mobile
   npm run mobile:ios  # or mobile:android
   ```

2. **Update App Icons** (1024x1024 PNG)
   - iOS: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Android: `android/app/src/main/res/mipmap-*/ic_launcher.png`

3. **Customize Splash Screen**
   - iOS: `ios/App/App/Assets.xcassets/Splash.imageset/`
   - Android: `android/app/src/main/res/drawable/splash.png`

4. **Test Thoroughly**
   - Test on multiple devices
   - Test on multiple Android/iOS versions
   - Test offline functionality
   - Test notifications

5. **Submit to App Stores**
   - See [MOBILE_BUILD_GUIDE.md](./MOBILE_BUILD_GUIDE.md) for details

## Troubleshooting

### App won't run on simulator/emulator
```powershell
npm run build
npx cap sync
# Then try again
```

### Backend API not connecting
Check `capacitor.config.json` - ensure `webDir: "dist"` exists

### Notifications not showing
```javascript
await notificationService.initialize(); // Request permission first
```

### Files not syncing
```powershell
npx cap sync ios    # Sync to iOS
npx cap sync android # Sync to Android
```

## Important URLs

- **Capacitor Docs**: https://capacitorjs.com
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console
- **Your Backend**: Update `VITE_API_BASE_URL` in `.env`

## App Configuration

**File**: `capacitor.config.json`
```json
{
  "appId": "com.aidiet.app",
  "appName": "AI Diet Planner",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  }
}
```

## Development Workflow

```
┌──────────────┐
│ Make changes │
│ in React app │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ npm run build    │ (creates dist/)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ npx cap sync     │ (copies to iOS/Android)
└──────┬───────────┘
       │
       ├──→ npm run mobile:ios    (test on iOS)
       │
       └──→ npm run mobile:android (test on Android)
```

## Need Help?

1. Check [MOBILE_BUILD_GUIDE.md](./MOBILE_BUILD_GUIDE.md) for detailed instructions
2. Review [Capacitor Docs](https://capacitorjs.com) for plugin usage
3. Check console logs: `npm run mobile:ios/android` → View output

---

**Status**: ✅ Mobile support is fully integrated. Ready to build!
