#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  🚀 DÉPLOIEMENT AUTOMATIQUE TIGER IA SOUVERAIN (VPS)"
echo "  📍 Serveur : Contabo Cloud VPS (109.205.182.17)"
echo "=========================================================="

# 1. Mise à jour du système Ubuntu
echo "[1/7] Mise à jour des paquets système..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"

# 2. Installation des dépendances Linux essentielles
echo "[2/7] Installation des dépendances (Nginx, Git, Unzip, Xvfb, Chromium, Build-Essential)..."
apt-get install -y git curl wget unzip nginx certbot python3-certbot-nginx build-essential python3     xvfb libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2     libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2     libgbm1 libpango-1.0-0 libcairo2 libasound2 chromium-browser || true

# 3. Installation de Node.js 20 LTS & Outils globaux (pnpm, pm2)
echo "[3/7] Installation de Node.js 20 LTS et PM2..."
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'.' -f1)" != "v20" ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
npm install -g pnpm pm2

# 4. Préparation des répertoires d'application
echo "[4/7] Préparation des répertoires d'application..."
mkdir -p /var/www/tiger
mkdir -p /var/projects
chmod -R 777 /var/projects

TARGET_DIR="/var/www/tiger"
if [ ! -d "$TARGET_DIR/.git" ]; then
    echo "[*] Clonage du dépôt Git turnzack/v0-reponse..."
    git clone https://github.com/turnzack/v0-reponse.git "$TARGET_DIR"
else
    echo "[*] Mise à jour du dépôt Git..."
    cd "$TARGET_DIR"
    git fetch --all
    git reset --hard origin/main
fi

# 5. Compilation de l'interface Frontend (Vite)
echo "[5/7] Compilation de l'interface Web (Vite)..."
cd "$TARGET_DIR"
pnpm install
pnpm run build

# 6. Installation des dépendances du Moteur Backend et démarrage PM2
echo "[6/7] Démarrage du Moteur Backend sous PM2..."
cd "$TARGET_DIR/backend"
npm install --omit=dev || npm install

# Démarrage ou rechargement du service PM2
pm2 stop tiger-engine 2>/dev/null || true
pm2 delete tiger-engine 2>/dev/null || true
WORKSPACE_DIR="/var/projects" PORT=5006 pm2 start server.js --name "tiger-engine"
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

# 7. Configuration de Nginx
echo "[7/7] Configuration du serveur Nginx..."
cp "$TARGET_DIR/nginx/tiger-vps.conf" /etc/nginx/sites-available/tiger.conf
rm -f /etc/nginx/sites-enabled/default || true
ln -sf /etc/nginx/sites-available/tiger.conf /etc/nginx/sites-enabled/tiger.conf
nginx -t
systemctl restart nginx

echo ""
echo "=========================================================="
echo "  ✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"
echo "  🌐 Accès Web : http://109.205.182.17"
echo "  🔌 API Moteur : http://109.205.182.17/api/health"
echo "  📊 Statut PM2 : pm2 status"
echo "=========================================================="
