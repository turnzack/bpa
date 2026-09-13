#!/usr/bin/env python3
"""
detect_object.py
Détection d'objets avec YOLOv8 pour SolarScan
Retourne le bounding box de l'objet le plus grand
"""

import sys
import json
import os

try:
    from ultralytics import YOLO
    import cv2
except ImportError:
    print(json.dumps({"error": "ultralytics or opencv-python not installed"}))
    sys.exit(1)

def detect_largest_object(image_path, model_name='yolov8n.pt'):
    """
    Détecte l'objet le plus grand dans une image
    
    Args:
        image_path: Chemin vers l'image
        model_name: Nom du modèle YOLO (yolov8n.pt par défaut)
    
    Returns:
        dict: Bounding box de l'objet le plus grand ou None
    """
    try:
        # Charger le modèle YOLO
        model = YOLO(model_name)
        
        # Effectuer la détection
        results = model(image_path, verbose=False)
        
        # Trouver l'objet le plus grand
        largest_box = None
        largest_area = 0
        
        for result in results:
            if result.boxes is None or len(result.boxes) == 0:
                continue
                
            for box in result.boxes:
                # Extraire les coordonnées
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                # Calculer l'aire
                area = (x2 - x1) * (y2 - y1)
                
                if area > largest_area:
                    largest_area = area
                    largest_box = {
                        'x1': int(x1),
                        'y1': int(y1),
                        'x2': int(x2),
                        'y2': int(y2),
                        'confidence': float(box.conf[0]),
                        'class': int(box.cls[0]),
                        'class_name': model.names[int(box.cls[0])],
                        'area': int(area)
                    }
        
        return largest_box
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python detect_object.py <image_path>"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({"error": f"Image not found: {image_path}"}))
        sys.exit(1)
    
    # Détecter l'objet
    result = detect_largest_object(image_path)
    
    # Retourner le résultat en JSON
    print(json.dumps(result))
