@echo off
title uDiscovery - Launch Dev Server
echo ========================================================
echo        uDiscovery - Avvio Automatico App Web
echo ========================================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo [INFO] Installazione dipendenze in corso...
    call npm install
)

echo [INFO] Apertura del browser su http://localhost:5173/ ...
start http://localhost:5173/

echo [INFO] Avvio dev server Vite...
call npm run dev
pause
