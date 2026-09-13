# Script PowerShell pour lancer backend et mobile
# Ouvre deux consoles parallèles
Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd 'e:/PJS/bpa/server'; pnpm install; pnpm start"
Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd 'e:/PJS/bpa/mobile'; pnpm install; npx expo start"
