@echo off
title ChromaLab - Avvio & Push Automatico
echo ========================================================
echo       ChromaLab - Avvio App + Push Automatico
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Esecuzione del Push Automatico su GitHub...
call auto_push.bat

echo.
echo [2/2] Avvio dell'App Web...
call start.bat
