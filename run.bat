@echo off
title QuickJob (QuickJob)
cd /d "%~dp0"

echo ==========================================================
echo    Starting QuickJob System
echo ==========================================================

echo [1/2] Starting QuickJob Job Engine & Excel Service (Port 5055)...
start "QuickJob Job Engine" cmd /c "cd job_engine && python api_server.py"

echo [2/2] Starting QuickJob React Frontend (Port 5173)...
start http://localhost:5173/
npm run dev
pause
