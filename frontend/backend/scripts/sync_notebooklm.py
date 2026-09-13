#!/usr/bin/env python3
"""
Script appelé par Kirov5 pour uploader les exports Markdown vers NotebookLM.
Usage: python sync_notebooklm.py <EXPORT_DIR> <NOTEBOOK_ID> <AUTH_COOKIE>
"""

import sys
import os
import traceback
from pathlib import Path

def main():
    if len(sys.argv) < 3:
        print("Usage: python sync_notebooklm.py <EXPORT_DIR> <NOTEBOOK_ID> [AUTH_COOKIE]")
        sys.exit(1)
    
    export_dir = Path(sys.argv[1])
    notebook_id = sys.argv[2]
    auth_cookie = sys.argv[3] if len(sys.argv) > 3 else ""
    
    if not export_dir.exists():
        print(f"ERROR: Dossier introuvable : {export_dir}")
        sys.exit(1)
    files = list(export_dir.rglob("*.md"))
    if not files:
        print(f"WARNING: Aucun fichier .md dans {export_dir}")
        sys.exit(0)
    
    print(f"Starting upload of {len(files)} files to NotebookLM...")
    
    try:
        import asyncio
        from notebooklm import NotebookLMClient
        
        async def run_upload():
            print("Tentative de connexion via from_storage()...")
            # This should automatically extract cookies from the local browser
            # or from the storage file if the user ran the CLI.
            async with NotebookLMClient.from_storage() as client:
                for file_path in files:
                    await client.sources.add_file(notebook_id=notebook_id, file_path=str(file_path))
                    print(f"  [OK] Uploaded: {file_path.name}")
                print("SUCCESS: All files uploaded to NotebookLM.")
                
        asyncio.run(run_upload())
        sys.exit(0)
        

        sys.exit(0)
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        traceback.print_exc(file=sys.stdout)
        sys.exit(1)

if __name__ == "__main__":
    main()
