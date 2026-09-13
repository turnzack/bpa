@echo off
echo ========================================
echo   BPA - Nettoyage complet
echo ========================================
echo.

:: Tuer tous les processus Node.js
echo [1/4] Arret des processus Node.js...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo   Tous les processus Node.js ont ete tues
) else (
    echo   Aucun processus Node.js en cours
)
timeout /t 3 /nobreak >nul

:: Supprimer les node_modules
echo [2/4] Suppression des node_modules...
if exist "node_modules" (
    echo   Suppression de node_modules root...
    rmdir /s /q node_modules
    if %errorlevel% equ 0 (
        echo   OK
    ) else (
        echo   ERREUR: Impossible de supprimer node_modules root
        echo   Essayez d'executer ce script en tant qu'administrateur
    )
) else (
    echo   node_modules root n'existe pas
)

if exist "server\node_modules" (
    echo   Suppression de server\node_modules...
    rmdir /s /q server\node_modules
)

if exist "mobile\node_modules" (
    echo   Suppression de mobile\node_modules...
    rmdir /s /q mobile\node_modules
)
timeout /t 2 /nobreak >nul

:: Nettoyer le cache pnpm
echo [3/4] Nettoyage du cache pnpm...
call pnpm store prune --force
timeout /t 1 /nobreak >nul

:: Réinstaller les dépendances
echo [4/4] Installation des dependances...
call pnpm install --no-frozen-lockfile

echo.
echo ========================================
echo   Nettoyage termine !
echo ========================================
echo.
echo Vous pouvez maintenant lancer start-all.bat
echo.
pause
