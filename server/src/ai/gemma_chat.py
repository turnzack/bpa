import sys
import json
import os
import traceback

# Lecture via stdin (évite les problèmes d'échappement avec argv)
# Le Node.js envoie : {"prompt": "...", "model_path": "..."}
try:
    raw = sys.stdin.read()
    payload = json.loads(raw)
    prompt = payload.get("prompt", "")
    model_path = payload.get("model_path", "")
except Exception as e:
    print(json.dumps({"error": f"Erreur lecture stdin: {str(e)}"}))
    sys.exit(1)

if not model_path or not os.path.exists(model_path):
    print(json.dumps({"error": f"Modèle introuvable: {model_path}"}))
    sys.exit(1)

try:
    from llama_cpp import Llama

    llm = Llama(
        model_path=model_path,
        n_ctx=1024,       # Réduit pour aller plus vite sur CPU
        n_threads=4,      # 4 coeurs CPU
        n_batch=128,      # Taille de batch
        verbose=False     # Pas de spam dans stderr
    )

    # On évite 'create_chat_completion' qui peut poser problème de 'system role' avec Gemma
    # On utilise simplement le format <start_of_turn> gemma
    full_prompt = f"<start_of_turn>user\nTu es un expert en bâtiment (BPA). Réponds de manière concise et technique en français.\n{prompt}<end_of_turn>\n<start_of_turn>model\n"

    output = llm(
        full_prompt,
        temperature=0.3,
        max_tokens=612,
        stop=["<end_of_turn>", "</s>"],
        echo=False
    )

    response_text = output["choices"][0]["text"]
    print(json.dumps({"response": response_text}))

except ImportError:
    print(json.dumps({"error": "llama_cpp non installé. Lancez: pip install llama-cpp-python"}))
    sys.exit(1)
except Exception as e:
    print(json.dumps({"error": f"Erreur Gemma: {str(e)}", "traceback": traceback.format_exc()}))
    sys.exit(1)
