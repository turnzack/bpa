#!/usr/bin/env python3
"""
Script appelé par Kirov5/Hermes pour poser une question à NotebookLM.
Usage: python ask_notebooklm.py <NOTEBOOK_ID> "<QUERY>"
"""

import sys
import traceback

def main():
    if len(sys.argv) < 3:
        print("Usage: python ask_notebooklm.py <NOTEBOOK_ID> \"<QUERY>\"")
        sys.exit(1)
    
    notebook_id = sys.argv[1]
    query = sys.argv[2]
    
    try:
        import asyncio
        from notebooklm import NotebookLMClient
        
        async def run_query():
            async with NotebookLMClient.from_storage() as client:
                response = await client.chat.ask(notebook_id, query)
                print(response.text)
                
        asyncio.run(run_query())
        sys.exit(0)
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
