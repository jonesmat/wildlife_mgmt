#!/bin/bash
cd "$(dirname "$0")"

echo ""
echo " ================================================"
echo "  TPWD 1-D-1 Wildlife Management Tool"
echo " ================================================"
echo ""

# ── Locate Node.js ────────────────────────────────────────────────────────────

if ! command -v node &>/dev/null; then
    # Not installed system-wide — search for a bundled portable runtime
    RUNTIME_NODE=$(find "_runtime" \( -type f -o -type l \) -name "node" \
        ! -name "*.js" ! -name "*.md" 2>/dev/null | head -1)

    if [ -n "$RUNTIME_NODE" ]; then
        echo " Using bundled Node.js runtime."
        echo ""
        export PATH="$(cd "$(dirname "$RUNTIME_NODE")" && pwd):$PATH"
    else
        echo " Node.js was not found on this computer."
        echo ""
        echo " ── OPTION A ─ Install Node.js (recommended) ──────────────────────────"
        echo ""
        echo "   Download the LTS installer from:"
        echo "     https://nodejs.org/en/download/"
        echo "   Run the installer, then run ./start.sh again."
        echo ""
        echo " ── OPTION B ─ Portable runtime (no install, no admin rights) ─────────"
        echo ""
        echo "   1. Open https://nodejs.org/en/download/prebuilt-binaries"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "   2. Select  macOS / ARM64 (M1/M2/M3) or x64 (older Intel) / .tar.gz"
        else
            echo "   2. Select  Linux / x64 / .tar.xz"
        fi
        echo "   3. Extract into this app's _runtime/ folder so it looks like:"
        echo ""
        echo "        wildlife_mgmt/"
        echo "          _runtime/"
        echo "            node-vXX.X.X-<os>-x64/   <-- the extracted folder"
        echo "              bin/"
        echo "                node"
        echo "                npm"
        echo "          start.sh"
        echo "          server.js"
        echo ""
        echo "   4. Run ./start.sh again."
        echo ""
        exit 1
    fi
fi

# ── Install dependencies (first run only) ────────────────────────────────────

if [ ! -d "node_modules" ]; then
    echo " Installing dependencies (this only happens once)..."
    if ! npm install --silent 2>/dev/null; then
        npm install  # retry without --silent to show errors
        if [ $? -ne 0 ]; then
            echo ""
            echo " ERROR: npm install failed."
            echo " Make sure you have an internet connection and try again."
            echo ""
            exit 1
        fi
    fi
    echo " Done."
    echo ""
fi

# ── Stop any existing instance on port 3000 ──────────────────────────────────

EXISTING_PID=$(lsof -ti :3000 2>/dev/null)
if [ -n "$EXISTING_PID" ]; then
    echo " Restarting server..."
    kill "$EXISTING_PID" 2>/dev/null
    sleep 1
    echo ""
fi

# ── Start server and open browser ────────────────────────────────────────────

echo " Server starting at http://localhost:3000"
echo " Your browser will open automatically in a moment."
echo ""
echo " Keep this window open while using the app."
echo " Press Ctrl+C to stop the server."
echo ""

# Open browser after server has had time to start
(sleep 2 && \
    (open "http://localhost:3000" 2>/dev/null || \
     xdg-open "http://localhost:3000" 2>/dev/null || \
     true)) &

node server.js
