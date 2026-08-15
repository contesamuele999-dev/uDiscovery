@echo off
title ChromaLab - Push Automatico e Setup Repository
echo ========================================================
echo    ChromaLab - Push Automatico e Creazione Repository
echo ========================================================
echo.

cd /d "%~dp0"

REM 1. Inizializza Git se non e' ancora un repository
if not exist ".git" (
    echo [1/4] Inizializzazione repository Git locale...
    git init
    git branch -M main
    echo [OK] Repository Git inizializzato.
) else (
    echo [1/4] Repository Git gia' presente.
)

REM 2. Configura remote GitHub se non presente
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [2/4] Remote origin non trovato. Creazione repository GitHub in corso...
    
    gh --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo [INFO] Creazione repository su GitHub tramite GitHub CLI (gh)...
        call gh repo create ChromaLab-Discovery-App --public --source=. --remote=origin
    ) else (
        echo [ATTENZIONE] GitHub CLI (gh) non trovato.
        echo Per favore crea prima una repository su https://github.com/new e poi esegui:
        echo git remote add origin URL_REPOSITORY
    )
) else (
    echo [2/4] Remote origin gia' configurato.
)

REM 3. Staging e Commit
echo.
echo [3/4] Aggiunta file e creazione commit...
git add .
git commit -m "Auto-update ChromaLab %date% %time%"

REM 4. Push su GitHub
echo.
echo [4/4] Invio modifiche su GitHub (git push)...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] Push completato con successo su GitHub!
    echo ========================================================
) else (
    echo.
    echo [INFO] Operazione completata o in attesa di autorizzazione remote.
)

echo.
pause
