const fs = require('fs');
const sqliteService = require('../services/sqlite-service');
const { embed, checkOllamaAvailable } = require('../services/ollama-embeddings');

class StitchIndexerSkill {
  async execute(payload, context) {
    console.log(`[STITCH-INDEXER] 📥 Démarrage de l'indexation de la maquette...`);
    
    let { htmlContent, filePath, templateId, templateName } = payload;
    
    if (!htmlContent && filePath) {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Le fichier HTML est introuvable : ${filePath}`);
      }
      htmlContent = fs.readFileSync(filePath, 'utf8');
    }

    if (!htmlContent) {
      throw new Error("htmlContent ou filePath est requis pour l'indexation Stitch.");
    }

    const id = templateId || `stitch_${Date.now()}`;
    const name = templateName || `Maquette Stitch ${new Date().toLocaleTimeString()}`;

    // 1. Extraction des Tokens Tailwind
    const classMatches = [...htmlContent.matchAll(/class="([^"]+)"/gi)]
      .map(m => m[1].split(/\s+/))
      .flat()
      .filter((v, i, a) => v.trim() !== '' && a.indexOf(v) === i);

    const tokens = {
      classes_trouvees: classMatches.length,
      echantillon: classMatches.slice(0, 15)
    };

    // 2. Génération de l'embedding du template (si Ollama disponible)
    const ollamaOk = await checkOllamaAvailable();
    let templateEmbedding = null;

    if (ollamaOk) {
      console.log(`[STITCH-INDEXER] 🧠 Ollama disponible — génération des embeddings...`);
      const tplText = `${name} ${classMatches.slice(0, 50).join(' ')} ${htmlContent.slice(0, 3000)}`;
      templateEmbedding = await embed(tplText);
      if (templateEmbedding) {
        console.log(`[STITCH-INDEXER] ✅ Embedding du template généré (${templateEmbedding.length} dims)`);
      }
    } else {
      console.log(`[STITCH-INDEXER] ℹ️ Ollama absent — indexation sans embeddings (fallback textuel actif)`);
    }

    // 3. Sauvegarde du Template Global
    sqliteService.saveTemplate({
      id: id,
      name: name,
      source: 'stitch-html',
      raw_html: htmlContent,
      tokens: tokens,
      embedding: templateEmbedding  // null si Ollama absent
    });

    // 4. Chunking sémantique + embeddings par chunk
    let chunksCount = 0;
    const sectionMatches = htmlContent.match(/<(section|main|nav|header|footer|aside)[^>]*>[\s\S]*?<\/\1>/gi) || [];
    
    const chunkSources = sectionMatches.length > 0 ? sectionMatches : [htmlContent];
    const isFallback = sectionMatches.length === 0;

    for (let index = 0; index < chunkSources.length; index++) {
      const sectionHtml = chunkSources[index];
      const tagMatch = sectionHtml.match(/^<([a-z0-9]+)/i);
      const tag = isFallback ? 'full_page' : (tagMatch ? tagMatch[1].toLowerCase() : 'unknown');

      // Embedding du chunk (si Ollama dispo)
      let chunkEmbedding = null;
      if (ollamaOk) {
        chunkEmbedding = await embed(sectionHtml.slice(0, 2000));
      }

      sqliteService.saveChunk({
        id: `${id}_chunk_${index}`,
        template_id: id,
        component_type: tag,
        content: sectionHtml,
        metadata: { index, tag, isFallback },
        embedding: chunkEmbedding
      });
      chunksCount++;
    }

    console.log(`[STITCH-INDEXER] ✅ Indexation terminée pour '${name}'. (${chunksCount} chunks, ${classMatches.length} classes Tailwind, embeddings: ${ollamaOk ? '✅' : '❌ fallback textuel'})`);

    return {
      success: true,
      message: `Template '${name}' indexé avec succès.`,
      templateId: id,
      embeddingsGenerated: ollamaOk,
      stats: {
        totalClasses: classMatches.length,
        chunksCreated: chunksCount,
        ollamaUsed: ollamaOk
      }
    };
  }
}

module.exports = new StitchIndexerSkill();


