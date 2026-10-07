# LALA IDE — Desktop App (Electron)

VS Code-style code editor for **Windows**, **macOS**, and **Linux**.
Wraps the shared web IDE (`website/client/code-editor.html`) in a native window.

## Quick Start

```bash
cd apps/lala-ide-desktop
npm install
npm start           # Run in dev mode (shows window immediately)
```

## Build Native Installers

| Command              | Output                          | Platform    |
|----------------------|---------------------------------|-------------|
| `npm run build:win`  | `dist/LALA IDE Setup.exe`       | Windows     |
| `npm run build:mac`  | `dist/LALA IDE.dmg`             | macOS       |
| `npm run build:linux`| `dist/LALA IDE.AppImage`        | Linux       |

> macOS DMG must be built on a macOS machine or via GitHub Actions.

## Icons

Place icons in `build-assets/`:
- `icon.ico`  — Windows (256x256 ICO)
- `icon.icns` — macOS
- `icon.png`  — Linux (512x512 PNG)

## Cloud Sync (MongoDB + Express)

The IDE connects to the Express backend (`website/server/`) for auth and project sync.

1. Start the API server: `cd website/server && node index.js`
2. The IDE will auto-connect to `http://localhost:5000/api`
3. Create an account or sign in via the IDE's auth modal
4. Use **File → Sync to Cloud** or `Ctrl+S` to save projects to MongoDB

## Features
- Full LALA IDE in a native window
- Native menus (File, Edit, View, Run, Help)
- Window size/position persistence
- DevTools in dev mode (--inspect)
- Auto-updater ready (electron-updater)
