@echo off
title TPWD Wildlife Management Tool
cd /d "%~dp0"

echo.
echo  ================================================
echo   TPWD 1-D-1 Wildlife Management Tool
echo  ================================================
echo.

:: ── Locate Node.js ───────────────────────────────────────────────────────────

where node >nul 2>nul
if not errorlevel 1 goto :node_ready

:: Not installed system-wide — search for a bundled portable runtime
for /r "_runtime" %%f in (node.exe) do (
    echo  Using bundled Node.js runtime.
    echo.
    set "PATH=%%~dpf;%PATH%"
    goto :node_ready
)

:: Not found anywhere
echo  Node.js was not found on this computer.
echo.
echo  ── OPTION A ─ Install Node.js (recommended) ─────────────────────────────
echo.
echo    Download the LTS installer from:
echo      https://nodejs.org/en/download/
echo    Run the installer, then run start.bat again.
echo.
echo  ── OPTION B ─ Portable runtime (no install, no admin rights) ────────────
echo.
echo    1. Open https://nodejs.org/en/download/prebuilt-binaries
echo    2. Select  Windows / x64 / .zip
echo    3. Extract the zip into this app's _runtime\ folder so it looks like:
echo.
echo         wildlife_mgmt\
echo           _runtime\
echo             node-vXX.X.X-win-x64\    ^<-- the extracted folder
echo               node.exe
echo               npm.cmd
echo           start.bat
echo           server.js
echo.
echo    4. Run start.bat again.
echo.
pause
exit /b 1

:node_ready

:: ── Install dependencies (first run only) ────────────────────────────────────

if not exist node_modules (
    echo  Installing dependencies (this only happens once)...
    call npm install --silent
    if errorlevel 1 (
        echo.
        echo  ERROR: npm install failed.
        echo  Make sure you have an internet connection and try again.
        echo.
        pause
        exit /b 1
    )
    echo  Done.
    echo.
)

:: ── Start server and open browser ────────────────────────────────────────────

echo  Server starting at http://localhost:3000
echo  Your browser will open automatically in a moment.
echo.
echo  Keep this window open while using the app.
echo  Press Ctrl+C to stop the server.
echo.

start /b "" cmd /c "timeout /t 2 >nul && start http://localhost:3000"
node server.js

echo.
echo  Server stopped.
pause >nul
