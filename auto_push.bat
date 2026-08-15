@echo off
title uDiscovery - Auto Push Git
echo ========================================================
echo        uDiscovery - Auto Push su GitHub
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Aggiunta file al staging (git add .)...
git add .

echo.
echo [2/3] Creazione commit...
git commit -m "Auto update uDiscovery"

echo.
echo [3/3] Push su GitHub (git push)...
git push

echo.
echo ========================================================
echo  Operazione completata! Codice sincronizzato su GitHub.
echo ========================================================
echo.
pause
