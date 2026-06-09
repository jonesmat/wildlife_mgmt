@echo off
cd /d "%~dp0"

set "KILLED=0"
for /f "tokens=5" %%P in ('netstat -aon 2^>nul ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /PID %%P /F >nul 2>nul
    if not errorlevel 1 set "KILLED=1"
)

if "%KILLED%"=="1" (
    echo  Server stopped.
) else (
    echo  Server is not running.
)
