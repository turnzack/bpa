@echo off
echo ========================================
echo   Redemarrage du Backend BPA
echo ========================================
echo.

:: 1. Tuer tout processus sur le port 4000
echo [1/3] Liberation du port 4000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000 ^| findstr LISTENING') do (
    echo   - Processus PID %%a termine
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

:: 2. Verifier que le port est libre
netstat -ano | findstr :4000 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [ERREUR] Impossible de liberer le port 4000
    echo Fermez manuellement l'application qui l'utilise
    pause
    exit /b 1
)
echo   - Port 4000 libre

:: 3. Demarrer le backend
echo.
echo [2/3] Demarrage du backend...
cd /d "%~dp0server"
start "Backend BPA" cmd /k "npx ts-node --transpile-only src/server.ts"

:: 4. Attendre le demarrage
echo.
echo [3/3] Attente du demarrage (5 secondes)...
timeout /t 5 /nobreak >nul

:: 5. Verifier le demarrage
curl -s http://localhost:4000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Backend demarre avec succes !
    echo   URL: http://localhost:4000
    echo ========================================
) else (
    echo.
    echo [ATTENTION] Le backend n'est pas encore pret
    echo Consultez la fenetre du serveur pour les erreurs
)

echo.
pause
