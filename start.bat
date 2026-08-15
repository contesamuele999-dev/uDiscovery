@echo off
title ChromaLab - Launch Dev Server
echo ========================================================
echo        ChromaLab - Avvio Automatico App Web
echo ========================================================
echo.

cd /d "%~dp0"

IF NOT EXIST "node_modules" (
    echo [INFO] Installazione dipendenze npm in corso...
    call npm install
)

echo [INFO] Apertura del browser su http://localhost:5173/ ...
start http://localhost:5173/

echo [INFO] Avvio del server di sviluppo Vite...
call npm run dev
pause
