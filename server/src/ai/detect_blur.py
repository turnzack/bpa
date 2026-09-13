#!/usr/bin/env python3
"""
detect_blur.py
Détection de flou avec variance du Laplacian pour SolarScan
Retourne un score de netteté (plus élevé = plus net)
"""

import sys
import json
import os
import cv2
import numpy as np

def calculate_blur_score(image_path):
    """
    Calcule le score de netteté d'une image
    
    Args:
        image_path: Chemin vers l'image
    
    Returns:
        dict: Score de netteté et métadonnées
    """
    try:
        # Charger l'image
        img = cv2.imread(image_path)
        if img is None:
            return {"error": f"Failed to load image: {image_path}"}
        
        # Convertir en niveaux de gris
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Calculer le Laplacian
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        
        # Calculer la variance (mesure de netteté)
        variance = laplacian.var()
        
        # Calculer aussi la moyenne pour contexte
        mean = laplacian.mean()
        
        # Déterminer si l'image est floue
        # Seuil typique : variance < 100 = flou
        is_blurry = variance < 100
        
        return {
            "blur_score": float(variance),
            "mean": float(mean),
            "is_blurry": bool(is_blurry),
            "threshold": 100,
            "image_size": {
                "width": img.shape[1],
                "height": img.shape[0]
            }
        }
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python detect_blur.py <image_path>"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({"error": f"Image not found: {image_path}"}))
        sys.exit(1)
    
    # Calculer le score de flou
    result = calculate_blur_score(image_path)
    
    # Retourner le résultat en JSON
    print(json.dumps(result))
