export interface Env {
  AI: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // En-têtes CORS pour Vercel et le Web
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'BPA Cloudflare AI Sovereign Worker',
        model: '@cf/meta/llama-3.1-8b-instruct',
        daily_quota: 'Free tier Cloudflare Workers AI'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const prompt = body.prompt || body.message || 'Analyse ce devis TCE.';
        const systemPrompt = body.systemPrompt || `Tu es un expert métreur et vérificateur de devis bâtiment BTP / TCE (Tous Corps d'État).
Analyse les prestations du devis, compare les prix aux tarifs moyens du marché en France, détecte les anomalies ou surcoûts, et attribue un score de conformité sur 100.
IMPORTANT : Retourne UNIQUEMENT un objet JSON valide suivant cette structure exacte, sans texte avant ou après :
{
  "analyse": {
    "score_conformite": 85,
    "total_ht": 1500.00,
    "articles": [
      {
        "designation": "Nom de la prestation",
        "quantite": 1,
        "unite": "m²",
        "prix_devis": 45.00,
        "prix_ref": 38.00,
        "ecart_pourcent": 18.4,
        "statut": "vert",
        "emoji": "🟢",
        "commentaire": "Conforme aux prix du marché"
      }
    ],
    "anomalies": [
      {
        "type": "Surcoût",
        "gravite": "ATTENTION",
        "article": "Désignation",
        "description": "Écart constaté",
        "impact": "Impact financier"
      }
    ],
    "resume": "Synthèse globale de l'analyse du devis"
  }
}`;

        // Appel direct au modèle LLM Cloudflare Workers AI gratuit
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 2048
        });

        const rawText = aiResponse?.response || '';
        
        let parsed: any = null;
        try {
          const jsonMatch = rawText.match(/```json\n?([\s\S]*?)\n?```/) || rawText.match(/(\{[\s\S]*\})/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[1]);
          }
        } catch (e) {
          // Ignorer si parse échoue
        }

        const analyseObj = parsed?.analyse || parsed;

        return new Response(JSON.stringify({
          success: true,
          response: rawText,
          analyse: analyseObj,
          model: '@cf/meta/llama-3.1-8b-instruct'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || 'Erreur Workers AI' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};
