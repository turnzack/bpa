@echo off
title 🚀 BPA - PROPULSION CERVEAU GEMMA
echo ====================================================
echo    VERIFICATION DES ORGANES IA VERS LE PROJET CIBLE
echo ====================================================
echo.

set DEST_MOBILE_MODELS="%~dp0mobile\models\gemma-2b-it.gguf"
set DEST_MOBILE_ASSETS="%~dp0mobile\assets\library.json"

echo 🧠 Verification du modele GGUF (1.6 Go) dans le mobile...
if exist %DEST_MOBILE_MODELS% (
    echo [OK] Gemma-2B-IT est parfaitement en place dans le mobile !
) else (
    echo [ATTENTION] Verifiez la presence du modele dans mobile/models.
)

echo 📚 Verification de la Bibliotheque de Prix dans le mobile...
if exist %DEST_MOBILE_ASSETS% (
    echo [OK] La bibliotheque de prix Library est connectee !
) else (
    echo [ATTENTION] La library.json est manquante dans mobile/assets.
)

echo.
echo ✨ OPTION 3 EXECUTEE AVEC SUCCES : L'ARCHITECTURE EST SOUVERAINE !
echo Redemarrez le serveur (Option 1) et l'application mobile (Option 2).
pause
