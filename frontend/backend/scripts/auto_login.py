import os
import sys
from pathlib import Path
import json

try:
    import rookiepy
    from notebooklm._auth.cookies import convert_rookiepy_cookies_to_storage_state
    
    # 1. Extraire les cookies de Chrome
    print("Extraction des cookies depuis Chrome local...")
    try:
        cookies = rookiepy.chrome()
    except Exception as e:
        print(f"Erreur avec Chrome: {e}. Essai avec Edge...")
        cookies = rookiepy.edge()
        
    # 2. Convertir au format Playwright
    storage_state = convert_rookiepy_cookies_to_storage_state(cookies)
    
    # 3. Sauvegarder dans le bon dossier
    profile_dir = Path.home() / ".notebooklm" / "profiles" / "default"
    profile_dir.mkdir(parents=True, exist_ok=True)
    
    storage_path = profile_dir / "storage_state.json"
    with open(storage_path, "w", encoding="utf-8") as f:
        json.dump(storage_state, f, indent=2)
        
    print(f"✅ Succès ! Session sauvegardée dans {storage_path}")
    print("Vous pouvez maintenant cliquer sur le bouton d'export dans Kirov5.")
    
except Exception as e:
    print(f"❌ Erreur critique : {e}")
    import traceback
    traceback.print_exc()
