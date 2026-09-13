/**
 * RAG Query Skill — Recherche Sémantique dans la mémoire RAG (v0.10.0)
 *
 * Stratégie hybride :
 *  1. Si Ollama est disponible → Similarité cosinus sur embeddings nomic-embed-text
 *  2. Sinon → Fallback sur recherche textuelle (BM25-like, token matching)
 *
 * Retourne les N meilleurs templates/chunks classés par score de pertinence.
 */

'use strict';

const sqliteService = require('../services/sqlite-service');
const { embed, checkOllamaAvailable, cosineSimilarity } = require('../services/ollama-embeddings');

class RagQuerySkill {

  /**
   * execute(payload, context)
   * @param {{ query: string, topK?: number, threshold?: number }} payload
   */
  async execute(payload, context) {
    const { query, topK = 3, threshold = 0.0 } = payload;

    if (!query || typeof query !== 'string') {
      throw new Error('[RAG-QUERY] query est obligatoire');
    }

    console.log(`[RAG-QUERY] 🔍 Recherche pour : "${query.slice(0, 80)}..."`);
    console.log(`[RAG-QUERY] Params → topK=${topK}, threshold=${threshold}`);

    // Charger tous les templates et leurs chunks
    const allTemplates = sqliteService.getAllTemplates();

    if (!allTemplates || allTemplates.length === 0) {
      console.warn('[RAG-QUERY] ⚠️ Aucun template dans la mémoire RAG.');
      return {
        success: false,
        message: 'Mémoire RAG vide. Indexez d\'abord une maquette Stitch via INDEX_STITCH.',
        results: [],
      };
    }

    const allChunks = sqliteService.getAllChunks();

    // ─────────────────────────────────────────────────────────
    // Stratégie 1 : Embeddings sémantiques (si Ollama dispo)
    // ─────────────────────────────────────────────────────────
    const ollamaOk = await checkOllamaAvailable();

    if (ollamaOk) {
      console.log('[RAG-QUERY] 🧠 Ollama disponible — Recherche sémantique par embeddings...');
      const results = await this._semanticSearch(query, allTemplates, allChunks, topK, threshold);
      return { success: true, mode: 'semantic', results };
    }

    // ─────────────────────────────────────────────────────────
    // Stratégie 2 : Fallback recherche textuelle (BM25-like)
    // ─────────────────────────────────────────────────────────
    console.log('[RAG-QUERY] 📝 Ollama absent — Fallback sur recherche textuelle (token matching)...');
    const results = this._textSearch(query, allTemplates, allChunks, topK, threshold);
    return { success: true, mode: 'text_fallback', results };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Recherche sémantique par embeddings Ollama
  // ─────────────────────────────────────────────────────────────────────────

  async _semanticSearch(query, templates, chunks, topK, threshold) {
    // Embedding de la requête
    const queryVec = await embed(query);
    if (!queryVec) {
      console.warn('[RAG-QUERY] ⚠️ Embedding de la requête échoué — bascule sur textuel');
      return this._textSearch(query, templates, chunks, topK, threshold);
    }

    const scored = [];

    for (const tpl of templates) {
      // Embedding du template (concaténation nom + classes trouvées)
      const tplFull = sqliteService.getTemplateById(tpl.id);
      if (!tplFull) continue;

      const tplText = [
        tpl.name || '',
        tplFull.tokens?.echantillon?.join(' ') || '',
        (tplFull.raw_html || '').slice(0, 3000),
      ].join(' ');

      const tplVec = await embed(tplText);
      const score = tplVec ? cosineSimilarity(queryVec, tplVec) : 0;

      if (score >= threshold) {
        scored.push({
          type: 'template',
          id: tpl.id,
          name: tpl.name,
          score: Math.round(score * 1000) / 1000,
          snippet: (tplFull.raw_html || '').slice(0, 200),
          tokens: tplFull.tokens,
        });
      }
    }

    // Tri décroissant par score
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, topK);

    console.log(`[RAG-QUERY] ✅ Résultats sémantiques : ${top.length} template(s) trouvé(s)`);
    top.forEach(r => console.log(`   → [${r.score}] ${r.name}`));

    return top;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Recherche textuelle (BM25-like fallback)
  // ─────────────────────────────────────────────────────────────────────────

  _textSearch(query, templates, chunks, topK, threshold) {
    const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    const scored = templates.map(tpl => {
      const fullTpl = sqliteService.getTemplateById(tpl.id);
      if (!fullTpl) return null;

      const corpus = [
        (tpl.name || '').toLowerCase(),
        (fullTpl.tokens?.echantillon || []).join(' ').toLowerCase(),
        (fullTpl.raw_html || '').slice(0, 5000).toLowerCase(),
      ].join(' ');

      // Score = nombre de tokens de la requête trouvés dans le corpus
      let hits = 0;
      for (const token of queryTokens) {
        if (corpus.includes(token)) hits++;
      }

      const score = queryTokens.length > 0 ? hits / queryTokens.length : 0;

      return {
        type: 'template',
        id: tpl.id,
        name: tpl.name,
        score: Math.round(score * 1000) / 1000,
        snippet: (fullTpl.raw_html || '').slice(0, 200),
        tokens: fullTpl.tokens,
      };
    }).filter(r => r !== null && r.score >= threshold);

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, topK);

    console.log(`[RAG-QUERY] ✅ Résultats textuels : ${top.length} template(s) trouvé(s)`);
    top.forEach(r => console.log(`   → [${r.score}] ${r.name}`));

    return top;
  }
}

module.exports = new RagQuerySkill();
