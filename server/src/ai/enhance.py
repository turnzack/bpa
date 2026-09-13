#!/usr/bin/env python3
"""
enhance.py
Super-résolution avec Real-ESRGAN pour SolarScan
Upscale les images 2x avec amélioration de qualité
"""

import sys
import os
import cv2

try:
    from basicsr.archs.rrdbnet_arch import RRDBNet
    from realesrgan import RealESRGANer
except ImportError:
    print("ERROR: realesrgan or basicsr not installed")
    print("Install with: pip install realesrgan")
    sys.exit(1)

def enhance_image(input_path, output_path, scale=2, model_path=None):
    """
    Améliore une image avec Real-ESRGAN
    
    Args:
        input_path: Chemin de l'image d'entrée
        output_path: Chemin de l'image de sortie
        scale: Facteur d'upscaling (2 ou 4)
        model_path: Chemin du modèle (optionnel)
    
    Returns:
        bool: True si succès, False sinon
    """
    try:
        # Vérifier que l'image existe
        if not os.path.exists(input_path):
            print(f"ERROR: Input image not found: {input_path}")
            return False
        
        # Définir le modèle
        if scale == 2:
            model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2)
            if model_path is None:
                model_path = 'RealESRGAN_x2plus.pth'
        elif scale == 4:
            model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
            if model_path is None:
                model_path = 'RealESRGAN_x4plus.pth'
        else:
            print(f"ERROR: Unsupported scale: {scale}. Use 2 or 4.")
            return False
        
        # Créer l'upsampler
        upsampler = RealESRGANer(
            scale=scale,
            model_path=model_path,
            model=model,
            tile=400,  # Taille des tuiles pour économiser la mémoire
            tile_pad=10,
            pre_pad=0,
            half=False  # Utiliser FP32 (plus lent mais plus précis)
        )
        
        # Charger l'image
        img = cv2.imread(input_path, cv2.IMREAD_COLOR)
        if img is None:
            print(f"ERROR: Failed to load image: {input_path}")
            return False
        
        # Améliorer l'image
        print(f"Enhancing {os.path.basename(input_path)}...")
        output, _ = upsampler.enhance(img, outscale=scale)
        
        # Sauvegarder le résultat
        cv2.imwrite(output_path, output)
        print(f"SUCCESS: Enhanced image saved to {output_path}")
        
        return True
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python enhance.py <input_image> <output_image> [scale] [model_path]")
        print("Example: python enhance.py input.jpg output.jpg 2")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    scale = int(sys.argv[3]) if len(sys.argv) > 3 else 2
    model_path = sys.argv[4] if len(sys.argv) > 4 else None
    
    success = enhance_image(input_path, output_path, scale, model_path)
    
    sys.exit(0 if success else 1)
