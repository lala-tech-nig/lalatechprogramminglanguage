# LALA IDE — Android App (Capacitor)

Wraps the LALA IDE web app as a native **Android APK** using Capacitor.

## Prerequisites

- Node.js 18+
- Android Studio with SDK 33+
- Java 17 (set `JAVA_HOME`)

## Build Steps

### Step 1 — Copy the web IDE

```bash
# From project root:
xcopy website\client apps\lala-web-build /E /I /Y
```

### Step 2 — Install & sync

```bash
cd apps/lala-ide-android
npm install
npx cap sync android
```

### Step 3 — Open in Android Studio

```bash
npx cap open android
```

Or just double-click **build-android.bat** on Windows.

### Step 4 — Generate APK

In Android Studio:
`Build → Generate Signed Bundle/APK → APK → Next → Create keystore → Finish`

The APK will be in:
`android/app/release/app-release.apk`

## Features on Android

- Full LALA IDE with dark theme
- Touch-optimized code editing
- Dark keyboard
- Offline support (localStorage)
- File download to Android Downloads
- Share code via Android share sheet
- Status bar matches IDE dark theme

## Firebase

Add your `google-services.json` to `android/app/` and configure Firebase
in `website/client/code-editor.html`.
