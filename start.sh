#!/bin/bash
echo ""
echo " ================================================"
echo "  TPWD 1-D-1 Wildlife Management Tool"
echo " ================================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo " ERROR: Node.js is not installed."
    echo ""
    echo " Please download and install Node.js from:"
    echo "   https://nodejs.org/en/download/"
    echo ""
    echo " Choose the 'LTS' version. After installing, run this script again."
    echo ""
    exit 1
fi

# Change to the directory this script lives in (so it works when double-clicked)
cd "$(dirname "$0")"

# Install dependencies on first run
if [ ! -d "node_modules" ]; then
    echo " Installing dependencies (first run only, may take a moment)..."
    npm install --omit=dev --silent
    if [ $? -ne 0 ]; then
        echo ""
        echo " ERROR: Dependency installation failed."
        echo " Make sure you have an internet connection and try again."
        echo ""
        exit 1
    fi
    echo " Done."
    echo ""
fi

echo " Starting server at http://localhost:3000"
echo " Your browser will open automatically."
echo ""
echo " Keep this window open while using the app."
echo " Press Ctrl+C to stop the server."
echo ""

# Open browser after server starts (works on macOS and most Linux desktops)
(sleep 2 && (open "http://localhost:3000" 2>/dev/null || xdg-open "http://localhost:3000" 2>/dev/null)) &

node server.js
