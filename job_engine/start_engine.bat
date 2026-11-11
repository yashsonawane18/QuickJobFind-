@echo off
title QuickJob Job Discovery & Excel Engine (Port 5055)
cd /d "%~dp0"
echo ======================================================================
echo    Starting QuickJob Job Discovery & Excel Exporter Engine (Port 5055)...
echo ======================================================================
python api_server.py
pause
