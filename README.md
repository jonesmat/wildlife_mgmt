# TPWD 1-D-1 Wildlife Management Tool

A local web app for creating TPWD 1-D-1 Open Space Agricultural Valuation
Wildlife Management Plans (PWD 885) and annual reports (PWD 888), with an
activity log for recording harvest, sightings, and management activities
throughout the year.

---

## Starting the App

### Windows — double-click `start.bat`

### Mac / Linux — run `./start.sh` in a terminal

The script will:
1. Locate Node.js (system install or bundled portable runtime — see below)
2. Install dependencies automatically on the first run
3. Start the server and open `http://localhost:3000` in your browser

Keep the window open while using the app. Press **Ctrl+C** to stop.

---

## Node.js

The app requires Node.js. You have two options:

### Option A — Install Node.js (recommended if you use this regularly)

Download the **LTS** installer from **https://nodejs.org/en/download/**  
Run it once; no further setup needed.

### Option B — Portable runtime (no installation, no admin rights)

Download the **pre-built binary** zip/tarball and drop it into a `_runtime/`
folder inside the app directory. The start script finds it automatically.

1. Open **https://nodejs.org/en/download/prebuilt-binaries**
2. Select your OS, x64 (or ARM64 for Apple Silicon), and the zip/tar.gz format
3. Extract the archive into `_runtime/` so the layout looks like this:

**Windows:**
```
wildlife_mgmt\
  _runtime\
    node-vXX.X.X-win-x64\    <-- extracted folder
      node.exe
      npm.cmd
  start.bat
  server.js
```

**Mac / Linux:**
```
wildlife_mgmt/
  _runtime/
    node-vXX.X.X-<os>-x64/   <-- extracted folder
      bin/
        node
        npm
  start.sh
  server.js
```

4. Run `start.bat` / `./start.sh` — it will detect the runtime automatically.

> **Note:** `_runtime/` is excluded from version control. When sharing the app
> as a zip, include the `_runtime/` folder so the recipient can run it
> without installing anything.

---

## Sharing the App

To send the app to someone else:

1. Zip the entire `wildlife_mgmt/` folder
2. Include `_runtime/` if you want zero-install for the recipient (Option B above)
3. Exclude `data/` — the recipient starts with a blank property

The recipient only needs to unzip and run the start script.

---

## Your Data

All data — the plan, annual reports, log entries, photos, and maps — is stored
**inside your browser** (IndexedDB). Nothing is written to disk or sent to any
server. That means:

- **Back up regularly** with *Settings → Data Export & Restore*, or turn on
  Google Drive sync (below). If the browser's site data is cleared or the
  device is lost, un-backed-up data is gone.
- Each browser/device starts empty until you import a backup or sync it.

---

## Google Drive Sync (optional)

Sync keeps a copy of your data in **your own Google Drive** (in the hidden
app-data area only this app can access) and shares it between devices.
Enabling it means your data leaves the browser and is stored in your Google
account — skip this if you prefer strictly local storage.

One-time setup (free) — sync needs a Google OAuth Client ID that identifies
*your* copy of the app to Google:

1. Go to **https://console.cloud.google.com/** and create a project.
2. **APIs & Services → Library** — enable the **Google Drive API**.
3. **APIs & Services → OAuth consent screen** — configure it (External;
   adding just yourself as a test user is fine for personal use).
4. **APIs & Services → Credentials → Create credentials → OAuth client ID** —
   type **Web application**, and add your site's address (and
   `http://localhost:3000` for local use) under **Authorized JavaScript
   origins**.
5. Copy the client ID into **Settings → Google Sync** in the app (or hardcode
   it as `DEFAULT_CLIENT_ID` in `public/google-sync.js` for your deployment).

Then use **Sync Now** on each device you want connected. The optional
auto-sync checkbox syncs silently whenever the app opens. If both a device
and Drive have changes since their last sync, the app asks which copy to keep.

---

## Stopping the App

Press **Ctrl+C** in the terminal/command window, or close it.
