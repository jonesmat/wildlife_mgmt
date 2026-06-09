@echo off
cd /d "%~dp0"

set "KILLED=0"
for /f "tokens=5" %%P in ('netstat -ano 2^>nul ^| findstr /C:":3000 "') do (
    echo %%P | findstr /r "^[1-9][0-9]*$" >nul 2>nul
    if not errorlevel 1 (
        taskkill /PID %%P /F >nul 2>nul
        if not errorlevel 1 set "KILLED=1"
    )
)

if "%KILLED%"=="1" (
    echo  Server stopped.
) else (
    echo  Server is not running.
)
