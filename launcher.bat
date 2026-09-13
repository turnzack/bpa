@echo off
title 🐯 FACTURESCAN - LANCEUR DIAMOND G5
echo ====================================================
echo    STATION DE CONTROLE - FACTURESCAN SOUVERAIN
echo ====================================================
echo.

:MENU
echo [1] Demarrer le BACKEND (Port 4000)
echo [2] Demarrer le MOBILE (Expo SDK 54)
echo [3] Transférer le CERVEAU GEMMA (Propulsion)
echo [4] Nettoyer le cache Metro/NPM
echo [5] Quitter
echo.
set /p choice="Selectionnez une option : "

if "%choice%"=="1" goto BACKEND
if "%choice%"=="2" goto MOBILE
if "%choice%"=="3" goto GEMMA
if "%choice%"=="4" goto CLEAN
if "%choice%"=="5" exit
goto MENU

:BACKEND
echo.
echo 🚀 Lancement du Reacteur Backend...
start "⚙️ BPA BACKEND" cmd /c "cd /d "%~dp0server" && npm run dev"
goto MENU

:MOBILE
echo.
echo 📱 Lancement du Reacteur Mobile...
start "📱 BPA MOBILE" cmd /c "cd /d "%~dp0mobile" && npx expo start --clear"
goto MENU

:GEMMA
echo.
echo 🧠 Activation de la Propulsion Cerveau...
call "%~dp0PROPULSION_CERVEAU.bat"
goto MENU

:CLEAN
echo.
echo 🧹 Nettoyage des scories...
cd /d "%~dp0mobile"
rmdir /s /q .expo
rmdir /s /q node_modules\.cache
echo ✨ Nettoyage termine.
pause
goto MENU
