@echo off
title TPWD Wildlife Management Tool
cd /d "%~dp0"

echo.
echo  TPWD 1-D-1 Wildlife Management Tool
echo  =====================================
echo.

:: --- Locate Node.js ----------------------------------------------------------

where node >nul 2>nul
if not errorlevel 1 goto :node_ready

:: Not on PATH - check for a bundled portable runtime in _runtime\
set "RUNTIME_NODE_DIR="
if exist "_runtime\" (
    for /r "_runtime" %%F in (node.exe) do (
        set "RUNTIME_NODE_DIR=%%~dpF"
        goto :found_runtime
    )
)
goto :no_node

:found_runtime
echo  Using bundled Node.js runtime.
echo.
set "PATH=%RUNTIME_NODE_DIR%;%PATH%"
goto :node_ready

:no_node
echo  Node.js was not found on this computer.
echo.
echo  OPTION A - Install Node.js (recommended)
echo  -----------------------------------------
echo  Download the LTS installer from:
echo    https://nodejs.org/en/download/
echo  Run the installer, then run start.bat again.
echo.
echo  OPTION B - Portable runtime (no install, no admin rights)
echo  ----------------------------------------------------------
echo  1. Open https://nodejs.org/en/download/prebuilt-binaries
echo  2. Select: Windows / x64 / .zip
echo  3. Extract the zip into _runtime\ inside this folder:
echo.
echo       wildlife_mgmt\
echo         _runtime\
echo           node-vXX.X.X-win-x64\
echo             node.exe
echo             npm.cmd
echo         start.bat
echo         server.js
echo.
echo  4. Run start.bat again.
echo.
pause
exit /b 1

:node_ready

:: --- Install dependencies (first run only) -----------------------------------

if not exist "node_modules\" (
    echo  Installing dependencies - this only happens once...
    call npm install --silent
    if errorlevel 1 (
        echo.
        echo  ERROR: npm install failed.
        echo  Check your internet connection and try again.
        echo.
        pause
        exit /b 1
    )
    echo  Done.
    echo.
)

:: --- Stop any existing instance on port 3000 ---------------------------------

call :kill_port
if "%KILLED%"=="1" (
    echo  Restarting server...
    echo.
    timeout /t 1 /nobreak >nul
)

:: --- Start -------------------------------------------------------------------

echo  Server starting at http://localhost:3000
echo  Your browser will open in a moment.
echo.
echo  Keep this window open while using the app.
echo  Press Ctrl+C to stop the server.
echo.

start /b "" cmd /c "timeout /t 2 >nul && start http://localhost:3000"
node server.js

echo.
echo  Server stopped.
pause >nul
exit /b 0

:: --- Subroutine: kill whatever is on port 3000 -------------------------------
:kill_port
set "KILLED=0"
for /f "tokens=5" %%P in ('netstat -ano 2^>nul ^| findstr /C:":3000 "') do (
    echo %%P | findstr /r "^[1-9][0-9]*$" >nul 2>nul
    if not errorlevel 1 (
        taskkill /PID %%P /F >nul 2>nul
        if not errorlevel 1 set "KILLED=1"
    )
)
exit /b 0
