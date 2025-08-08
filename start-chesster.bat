@echo off
echo ♔ Chesster - Starting Complete Chess Game Environment ♔
echo =====================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pnpm is not installed. Please install pnpm first.
    echo Run: npm install -g pnpm
    pause
    exit /b 1
)

REM Run the startup script
echo Starting Chesster...
node start-chesster.js

pause 