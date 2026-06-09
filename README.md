# TPWD 1-D-1 Wildlife Management Tool

A local web app for creating TPWD 1-D-1 Open Space Agricultural Valuation
Wildlife Management Plans (PWD 885) and annual reports (PWD 888), with an
activity log for recording harvest, sightings, and management activities
throughout the year.

---

## Requirements

**Node.js** — the only thing you need to install.

1. Go to **https://nodejs.org/en/download/**
2. Download the **LTS** version for your operating system
3. Run the installer (accept all defaults)

You only need to do this once. Dependencies are downloaded automatically
the first time you start the app.

---

## Starting the App

### Windows

Double-click **`start.bat`**

A command window will open and your browser will launch automatically
at `http://localhost:3000`. Keep the command window open while you use
the app — closing it stops the server.

### Mac / Linux

Open a Terminal, navigate to this folder, and run:

```bash
chmod +x start.sh   # first time only
./start.sh
```

Or right-click `start.sh` → Open With → Terminal (macOS).

---

## Your Data

All property data and uploaded photos are stored in the **`data/`** folder
inside this directory. Back this folder up to keep your records safe.

- `data/property.json` — plan, annual reports, and log entries
- `data/photos/` — uploaded photos

---

## Stopping the App

Press **Ctrl+C** in the terminal/command window, or simply close it.
