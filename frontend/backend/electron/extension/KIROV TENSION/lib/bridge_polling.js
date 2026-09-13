/**
 * lib/bridge_polling.js — KIROV5
 * Gère le polling du bridge local et Vercel depuis le background
 */

class BridgePolling {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.isProcessing = false;
    this.intervalId = null;
    this.lastHash = null;
    this.lastPhase = null;
    
    this.CFG = {
      SERVER_URL: 'http://127.0.0.1:5006',
      VERCEL_URL: 'https://forge-kohl-kappa.vercel.app',
      POLLING_INTERVAL: 2500,
    };
  }

  start() {
    if (this.intervalId) return;
    console.log('[BridgePolling] Démarrage du polling...');
    this.intervalId = setInterval(() => this.poll(), this.CFG.POLLING_INTERVAL);
    this.poll(); // Premier appel immédiat
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async sha256(t) {
    const b = new TextEncoder().encode(t);
    const h = await crypto.subtle.digest('SHA-256', b);
    return Array.from(new Uint8Array(h)).map(x => x.toString(16).padStart(2, '0')).join('');
  }

  async poll() {
    if (this.isProcessing) return;
    
    try {
      let data = null;
      
      // 1. Essayer Vercel
      try {
        const r = await fetch(`${this.CFG.VERCEL_URL}/api/bridge/prompt`);
        if (r.ok) {
          const d = await r.json();
          if (d.status !== 'idle' && d.prompt) data = d;
        }
      } catch (e) {}

      // 2. Essayer Local Bridge
      if (!data) {
        try {
          const r = await fetch(`${this.CFG.SERVER_URL}/v1/bridge/poll`);
          if (r.ok) {
            const d = await r.json();
            if (d.status !== 'idle' && d.prompt) data = d;
          }
        } catch (e) {}
      }

      if (!data) return;

      // 3. Anti race-condition (Hash check)
      const hash = await this.sha256(data.prompt + (data.prompt_id || ''));
      if (hash === this.lastHash && data.phase_num === this.lastPhase) return;
      
      this.isProcessing = true;
      this.lastHash = hash;
      this.lastPhase = data.phase_num;

      console.log(`[BridgePolling] Nouveau prompt reçu: Phase ${data.phase_num}`);

      // 4. Exécuter via l'orchestrateur
      // Note: On adapte le prompt avec les règles KIROV
      const SILENCE = `\nSILENCE ABSOLU — RÈGLE S1:\n- UNIQUEMENT du JSON valide {"files":[{"path":"...","content":"...","language":"..."}]}\n- Aucun texte conversationnel, aucune explication\n`;
      
      let fullPrompt = `[PROJET : ${(data.project_id || 'KIROV5').toUpperCase()}]`;
      if (data.phase_name) fullPrompt += ` - [${data.phase_name}]`;
      fullPrompt += '\n';
      if (parseInt(data.phase_num, 10) >= 2) fullPrompt += SILENCE + '\n\n---\n\n';
      fullPrompt += data.prompt;

      // On utilise l'orchestrateur pour injecter et capturer
      // On simule un pack/step si nécessaire ou on utilise une méthode directe
      const webAi = data.target_ai || 'deepseek';
      
      // Appel à une méthode d'injection directe (à ajouter à l'orchestrateur ou via message)
      const result = await this.orchestrator.runDirectWebAction(fullPrompt, webAi);

      if (result.success) {
        // 5. Envoyer la capture au bridge
        const capturedContent = result.content;
        await fetch(`${this.CFG.SERVER_URL}/v1/bridge/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: capturedContent,
            response: capturedContent,
            is_final: true
          })
        });

        // 6. Consommer le prompt
        try { await fetch(`${this.CFG.SERVER_URL}/v1/bridge/consume`, { method: 'POST' }); } catch (e) {}

        // 7. Auto-pilot advance
        try {
          const r = await fetch(`${this.CFG.SERVER_URL}/v1/g5/autopilot/advance`, { method: 'POST' });
          const d = await r.json();
          if (d.success) console.log(`[BridgePolling] Auto-pilot → Phase ${d.currentPhase}`);
        } catch (e) {}
        
        // 8. GitHub Push si nécessaire (si fichiers code détectés)
        if (result.files && result.files.length >= 2 && result.files.some(f => f.path.includes('App.tsx') || f.path.includes('main.tsx'))) {
           if (typeof GitHubPusher !== 'undefined') {
             await GitHubPusher.push(result.files);
           }
        }
      }

      this.isProcessing = false;
    } catch (e) {
      console.error('[BridgePolling] Erreur polling:', e.message);
      this.isProcessing = false;
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = BridgePolling;
}
