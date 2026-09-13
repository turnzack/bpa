@echo off
echo ============================================
echo   Test de connexion au backend
echo ============================================
echo.

echo [1] Verification de l'adresse IP locale...
ipconfig | findstr /i "IPv4"
echo.

echo [2] Test du endpoint health...
curl http://localhost:4000/health
echo.
echo.

echo [3] Test avec l'IP locale...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    set "IP=%%a"
    goto :found
)
:found
set "IP=%IP: =%"
echo IP detectee : %IP%
echo.
echo Test avec l'IP : http://%IP%:4000/health
curl http://%IP%:4000/health
echo.
echo.

echo [4] Verification que le port 4000 ecoute...
netstat -ano | findstr :4000
echo.

echo ============================================
echo Instructions :
echo 1. Si le test [3] echoue, votre firewall bloque les connexions
echo 2. Ouvrez PowerShell en Admin et executez :
echo    netsh advfirewall firewall add rule name="Node.js Port 4000" dir=in action=allow protocol=TCP localport=4000
echo ============================================
pause
