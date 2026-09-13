# Installation des Dépendances IA

## Prérequis

1. **Python 3.11** installé
   - Télécharger depuis https://www.python.org/downloads/
   - Cocher "Add Python to PATH" lors de l'installation

2. **pip** à jour
   ```bash
   python -m pip install --upgrade pip
   ```

## Installation des Packages Python

### Étape 1 : Installer PyTorch (requis pour YOLO et ESRGAN)

**Pour GPU NVIDIA (Recommandé si vous avez une carte NVIDIA)** :
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

**Pour CPU uniquement** :
```bash
pip install torch torchvision torchaudio
```

### Étape 2 : Installer YOLOv8 (Détection d'objets)

```bash
pip install ultralytics
```

### Étape 3 : Installer Real-ESRGAN (Super-résolution)

```bash
pip install realesrgan
pip install basicsr
```

### Étape 4 : Installer OpenCV (Traitement d'images)

```bash
pip install opencv-python
```

### Étape 5 : Installer NumPy (Calculs numériques)

```bash
pip install numpy
```

## Installation Complète en Une Commande

```bash
pip install torch torchvision torchaudio ultralytics realesrgan basicsr opencv-python numpy
```

## Téléchargement des Modèles

### YOLOv8

Le modèle `yolov8n.pt` sera téléchargé automatiquement lors de la première utilisation.

### Real-ESRGAN

Télécharger le modèle manuellement :

1. Créer un dossier `models` :
   ```bash
   mkdir models
   cd models
   ```

2. Télécharger le modèle x2 :
   ```bash
   # Windows PowerShell
   Invoke-WebRequest -Uri "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth" -OutFile "RealESRGAN_x2plus.pth"
   ```

   Ou télécharger depuis : https://github.com/xinntao/Real-ESRGAN/releases

3. Placer le fichier `RealESRGAN_x2plus.pth` dans le dossier `src/ai/models/`

## Vérification de l'Installation

### Test YOLOv8

```bash
python src/ai/detect_object.py test_image.jpg
```

Résultat attendu :
```json
{
  "x1": 100,
  "y1": 150,
  "x2": 500,
  "y2": 600,
  "confidence": 0.89,
  "class": 0,
  "class_name": "person",
  "area": 180000
}
```

### Test Détection de Flou

```bash
python src/ai/detect_blur.py test_image.jpg
```

Résultat attendu :
```json
{
  "blur_score": 245.67,
  "mean": 12.34,
  "is_blurry": false,
  "threshold": 100,
  "image_size": {"width": 1920, "height": 1080}
}
```

### Test ESRGAN

```bash
python src/ai/enhance.py test_image.jpg output_enhanced.jpg 2
```

Résultat attendu :
```
Enhancing test_image.jpg...
SUCCESS: Enhanced image saved to output_enhanced.jpg
```

## Résolution des Problèmes

### Erreur : "torch not found"

```bash
pip install torch torchvision
```

### Erreur : "CUDA not available"

C'est normal si vous n'avez pas de GPU NVIDIA. PyTorch utilisera le CPU.

### Erreur : "Model not found"

Télécharger manuellement les modèles (voir section ci-dessus).

### Erreur : "Permission denied"

Exécuter PowerShell en tant qu'administrateur.

## Configuration Recommandée

### GPU NVIDIA

- **VRAM** : 4 GB minimum, 8 GB recommandé
- **CUDA** : Version 11.8 ou supérieure
- **Drivers** : Dernière version

### CPU

- **RAM** : 8 GB minimum, 16 GB recommandé
- **Processeur** : Intel i5/AMD Ryzen 5 ou supérieur

## Temps de Traitement Estimés

| Opération | GPU (RTX 3060) | CPU (i7) |
|-----------|----------------|----------|
| YOLO (1 image) | 0.1s | 0.5s |
| Détection flou | 0.05s | 0.1s |
| ESRGAN (1 image) | 2s | 15s |

## Support

En cas de problème, vérifier :
1. Version de Python : `python --version` (doit être 3.11+)
2. Version de pip : `pip --version`
3. Packages installés : `pip list`
