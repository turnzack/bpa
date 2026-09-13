@echo off
echo ========================================
echo   BPA - Demarrage des services
echo ========================================
echo.

:: Tuer tous les processus Node.js existants
echo [1/3] Nettoyage des processus Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

:: Tuer les processus existants sur les ports 4000 et 8081
echo [2/3] Nettoyage des ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4000" ^| findstr LISTENING') do (
    echo   Killing PID %%a (port 4000)
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8081" ^| findstr LISTENING') do (
    echo   Killing PID %%a (port 8081)
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

:: Démarrer le backend
echo.
echo [3/3] Demarrage du backend (port 4000)...
start "BPA Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul

:: Démarrer l'app mobile
echo.
echo [4/3] Demarrage de l'app mobile...
start "BPA Mobile" cmd /k "cd mobile && npx expo start -c"

echo.
echo ========================================
echo   Services demarres !
echo ========================================
echo.
echo Backend: http://localhost:4000
echo Mobile:  http://localhost:8081
echo.
echo Appuyez sur une touche pour fermer cette fenetre
pause >nul
