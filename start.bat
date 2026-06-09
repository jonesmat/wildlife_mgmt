@echo off
title TPWD Wildlife Management Tool

echo.
echo  ================================================
echo   TPWD 1-D-1 Wildlife Management Tool
echo  ================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo  ERROR: Node.js is not installed.
    echo.
    echo  Please download and install Node.js from:
    echo    https://nodejs.org/en/download/
    echo.
    echo  Choose the "LTS" version. After installing,
    echo  run this file again.
    echo.
    pause
    exit /b 1
)

:: Install dependencies on first run (or if node_modules is missing)
if not exist node_modules (
    echo  Installing dependencies (first run only, may take a moment)...
    call npm install --omit=dev --silent
    if errorlevel 1 (
        echo.
        echo  ERROR: Dependency installation failed.
        echo  Make sure you have an internet connection and try again.
        echo.
        pause
        exit /b 1
    )
    echo  Done.
    echo.
)

echo  Starting server at http://localhost:3000
echo  Your browser will open automatically.
echo.
echo  Keep this window open while using the app.
echo  Press Ctrl+C to stop the server.
echo.

:: Open browser after a 2-second delay (gives server time to start)
start /b "" cmd /c "timeout /t 2 >nul && start http://localhost:3000"

node server.js

echo.
echo  Server stopped. Press any key to close.
pause >nul
