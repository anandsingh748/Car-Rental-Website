@echo off
title BharatDrive - Car Rental Web Portal
echo ===================================================
echo   BharatDrive - Premium Car Rental Portal (India)
echo ===================================================
echo.
echo Launching services...
echo.
npm run dev
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Failed to start services. Ensure Node.js is installed.
  pause
)
