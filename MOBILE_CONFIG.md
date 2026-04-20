## Capacitor Configuration for AI Diet Planner

### App Identity
```
App ID (Bundle ID):    com.aidiet.app
App Name:              AI Diet Planner
Company Domain:        aidiet.com
iOS Target Version:    13.0+
Android Target API:    21+ (5.1+)
```

### Backend Configuration

**Frontend `.env`:**
```env
# Web & Mobile
VITE_API_BASE_URL=http://localhost:5000/api

# For production, use your deployed backend
# VITE_API_BASE_URL=https://api.aidiet-planner.com/api
```

**capacitor.config.json:**
```json
{
  "appId": "com.aidiet.app",
  "appName": "AI Diet Planner",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "iosScheme": "capacitor"
  },
  "ios": {
    "contentInset": "automatic",
    "preferredContentMode": "mobile"
  },
  "android": {
    "usesCleartextTraffic": true
  },
  "plugins": {
    "SplashScreen": {
      "launchAutoHide": true,
      "launchShowDuration": 2000,
      "backgroundColor": "#f4f0e7",
      "showSpinner": false
    },
    "StatusBar": {
      "style": "dark",
      "backgroundColor": "#f4f0e7",
      "overlaysWebView": false
    }
  }
}
```

### iOS Configuration

**Info.plist Additions:**
```xml
<!-- Location Services -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>AI Diet Planner uses your location to find nearby health and nutrition services.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>AI Diet Planner uses your location to find nearby health and nutrition services.</string>

<!-- Local Network (for API calls) -->
<key>NSLocalNetworkUsageDescription</key>
<string>AI Diet Planner needs to access your local network for app functionality.</string>

<key>NSBonjourServiceTypes</key>
<array>
  <string>_http._tcp</string>
  <string>_https._tcp</string>
</array>

<!-- Camera (optional, for future food photo feature) -->
<key>NSCameraUsageDescription</key>
<string>AI Diet Planner uses your camera to capture meals for tracking.</string>

<!-- Photo Library (optional) -->
<key>NSPhotoLibraryUsageDescription</key>
<string>AI Diet Planner needs access to your photos for meal logging.</string>

<!-- User Notifications -->
<key>NSUserNotificationUsageDescription</key>
<string>AI Diet Planner sends notifications for meal reminders and health updates.</string>
```

### Android Configuration

**AndroidManifest.xml Additions:**
```xml
<!-- Core Permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Location Permissions -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- Notification Permission (Android 13+) -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Camera (optional) -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />

<!-- Photo Access (optional) -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

<!-- Notification Channel Configuration -->
<application>
  <!-- ... existing config ... -->
  
  <service
    android:name="com.getcapacitor.plugin.notification.NotificationService"
    android:exported="true" />
</application>
```

**build.gradle (android/app/build.gradle):**
```gradle
android {
  compileSdkVersion 34
  
  defaultConfig {
    applicationId "com.aidiet.app"
    minSdkVersion 21
    targetSdkVersion 34
    versionCode 1
    versionName "1.0.0"
  }
  
  buildTypes {
    release {
      minifyEnabled true
      shrinkResources true
      proguardFiles getDefaultProguardFile(
        'proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
  }
}

dependencies {
  // Capacitor core
  implementation "androidx.appcompat:appcompat:1.6.1"
  implementation "androidx.work:work-runtime:2.8.1"
  implementation "androidx.security:security-crypto:1.1.0-alpha06"
}
```

### Version Numbers

**Current Versions:**
- React: 18.3.1
- Node.js: 18+ (recommended 20+)
- Capacitor: 8.3.0
- iOS Support: iOS 13+
- Android Support: Android 5.1+ (API 21+)

### App Store Submission

**Version Format:**
- iOS: X.Y.Z (e.g., 1.0.0)
- Android: 
  - versionCode: Integer (increments by 1 each build)
  - versionName: X.Y.Z (user-facing version)

**Build Process:**
```
1. Increment version in capacitor.config.json
2. Update iOS build number in Xcode
3. Update Android versionCode in build.gradle
4. npm run build
5. npm run cap:build:ios  (for App Store)
6. npm run cap:build:android (for Play Store)
```

### Features Matrix

| Feature | Web | iOS | Android | Status |
|---------|-----|-----|---------|--------|
| Authentication | ✅ | ✅ | ✅ | Ready |
| Profile Management | ✅ | ✅ | ✅ | Ready |
| Diet Plans | ✅ | ✅ | ✅ | Ready |
| Meal Tracking | ✅ | ✅ | ✅ | Ready |
| Progress Charts | ✅ | ✅ | ✅ | Ready |
| Notifications | ⚠️ | ✅ | ✅ | Mobile Ready |
| Geolocation | ⚠️ | ✅ | ✅ | Mobile Ready |
| Local Storage | ✅ | ✅ | ✅ | Ready |
| Dark Mode | ❌ | ❌ | ❌ | Pending UI |
| Camera Photos | ❌ | ❌ | ❌ | Future |

### Performance Targets

- **App Size**: < 50MB (iOS), < 60MB (Android)
- **Startup Time**: 2-5 seconds
- **Memory Usage**: < 150MB
- **Battery Impact**: Minimal (<5% per hour)

### API Endpoints Configuration

**Local Development:**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

**Staging:**
```
VITE_API_BASE_URL=https://api-staging.aidiet-planner.com/api
```

**Production:**
```
VITE_API_BASE_URL=https://api.aidiet-planner.com/api
```

### Environment-Specific Requirements

**macOS Requirements (for iOS):**
- Xcode 14.3+
- Apple Developer account
- iOS SDK 13+
- Memory: 8GB+ RAM
- Disk: 50GB+ free space

**Windows/Linux Requirements (for Android):**
- Android Studio 2021.3+
- Java Development Kit (JDK) 11+
- Android SDK API 21+
- Memory: 4GB+ RAM
- Disk: 20GB+ free space

### Signing & Distribution

**iOS Signing:**
- Certificate: iOS Distribution
- Provisioning Profile: App Store
- Team ID: (from Apple account)

**Android Signing:**
- Keystore: `android/app.keystore`
- Alias: `aidiet`
- Key valid for: 30+ years

### Deployment Checklist

- [ ] Version incremented (major.minor.patch)
- [ ] All tests passing (web + mobile)
- [ ] Build succeeds: `npm run build:mobile`
- [ ] No console errors in simulators/emulators
- [ ] Notifications tested and working
- [ ] Location services tested (if used)
- [ ] App icons and splash screens updated
- [ ] Privacy policy page working
- [ ] Terms of service page working
- [ ] All APIs responding correctly
- [ ] App Store metadata prepared
- [ ] Google Play metadata prepared
- [ ] Release notes written

