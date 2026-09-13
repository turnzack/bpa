const fs = require('fs');
const path = require('path');
const sqliteService = require('../services/sqlite-service');
const introspector = require('./react-project-introspector');
const hermesClient = require('../orchestrator/hermes-client');
const patchApplier = require('./patch-applier');
const ragQuery = require('./rag-query');

class DesignPatcherSkill {
  async execute(payload, context) {
    console.log(`[DESIGN-PATCHER] 🛠️ Démarrage du pipeline de Patch UI...`);
    
    const { targetFile, templateId } = payload;
    
    if (!targetFile || !fs.existsSync(targetFile)) {
      throw new Error(`Fichier cible introuvable : ${targetFile}`);
    }

    // 1. RAG Query Sémantique : Trouver le meilleur template pour ce fichier cible
    console.log(`[DESIGN-PATCHER] 🧠 Recherche RAG sémantique pour : ${templateId || 'meilleure correspondance'}`);
    
    let targetTemplate = null;
    let ragHtml = '';

    try {
      // On utilise le nom du fichier cible comme requête de recherche si pas de templateId
      const ragSearchQuery = templateId || path.basename(targetFile, path.extname(targetFile));
      const ragResult = await ragQuery.execute({
        query: ragSearchQuery,
        topK: 1,
        threshold: 0.0
      });

      if (ragResult.success && ragResult.results && ragResult.results.length > 0) {
        const bestMatch = ragResult.results[0];
        console.log(`[DESIGN-PATCHER] ✅ Template trouvé par RAG : '${bestMatch.name}' (score: ${bestMatch.score}, mode: ${ragResult.mode})`);
        
        // Charger le HTML complet du template
        const fullTpl = sqliteService.getTemplateById(bestMatch.id);
        targetTemplate = fullTpl || bestMatch;
        ragHtml = fullTpl ? fullTpl.raw_html : (bestMatch.snippet || '');
      } else {
        // Fallback : prendre le dernier template indexé
        console.log(`[DESIGN-PATCHER] ⚠️ Aucune correspondance RAG. Fallback sur le dernier template indexé.`);
        const allTemplates = sqliteService.getAllTemplates();
        if (allTemplates.length > 0) {
          const fallbackMeta = allTemplates[0];
          const fullTpl = sqliteService.getTemplateById(fallbackMeta.id);
          targetTemplate = fullTpl || fallbackMeta;
          ragHtml = fullTpl ? fullTpl.raw_html : '';
        }
      }
    } catch (ragErr) {
      console.warn(`[DESIGN-PATCHER] ⚠️ Erreur RAG (${ragErr.message}). Fallback.`);
      const allTemplates = sqliteService.getAllTemplates();
      if (allTemplates.length > 0) {
        const fullTpl = sqliteService.getTemplateById(allTemplates[0].id);
        targetTemplate = fullTpl || allTemplates[0];
        ragHtml = fullTpl ? fullTpl.raw_html : '';
      }
    }

    if (!targetTemplate) {
      throw new Error(`Aucune maquette Stitch n'a été trouvée dans la mémoire RAG. Veuillez d'abord indexer une maquette.`);
    }

    // 2. Introspection du projet (Isoler la logique métier)
    console.log(`[DESIGN-PATCHER] 🔬 Introspection AST du fichier cible...`);
    const introspectionResult = await introspector.execute({ targetFile }, context);
    
    // 3. Sécurité : Création du Backup automatique (.bak)
    const backupPath = `${targetFile}.backup-${Date.now()}.bak`;
    fs.copyFileSync(targetFile, backupPath);
    console.log(`[DESIGN-PATCHER] 🛡️ Backup de sécurité créé : ${path.basename(backupPath)}`);

    // 4. Génération de la consigne (Patch Plan)
    const patchPlan = {
      action: "PATCH_UI",
      targetFile: targetFile,
      backupPath: backupPath,
      designTemplate: {
        name: targetTemplate.name,
        html: ragHtml,
        css: targetTemplate.css || '',
        tokens: targetTemplate.tokens || {}
      },
      preservedLogic: introspectionResult.analysis,
      instruction: `Tu es un expert React. Remplace l'UI du fichier cible en utilisant le design HTML/CSS fourni, SANS altérer les hooks (useState, useEffect) ou la logique métier identifiée. Renvoie UNIQUEMENT le code complet du fichier .tsx modifié.`
    };

    console.log(`[DESIGN-PATCHER] 🚀 Plan de Patch généré. Appel de l'Agent Hermes...`);

    let hermesResponse;
    try {
      // On lit le code source original pour le donner à Hermes
      const originalCode = fs.readFileSync(targetFile, 'utf8');

      hermesResponse = await hermesClient.decide({
        state: { 
          intent: "APPLY_DESIGN_PATCH", 
          patchPlan, 
          originalCode 
        },
        memory: {},
        logs: [],
        tools: [] 
      });
      
      console.log(`[DESIGN-PATCHER] 🤖 Réponse de Hermes reçue avec succès.`);
    } catch (error) {
      console.error(`[DESIGN-PATCHER] ❌ Erreur critique lors de l'appel à Hermes :`, error.message);
      throw new Error(`Hermes indisponible : ${error.message}`);
    }

    // Extraction du code généré par Hermes (on suppose que Hermes renvoie le code dans un champ 'code' ou 'response' ou 'content')
    let generatedCode = hermesResponse.code || hermesResponse.content || hermesResponse.response || hermesResponse;
    
    // Nettoyage markdown si Hermes a mis des backticks
    if (typeof generatedCode === 'string') {
      generatedCode = generatedCode.replace(/^```(tsx|typescript|javascript|jsx|js)?\n/i, '').replace(/```$/i, '').trim();
    } else if (hermesResponse.choices && hermesResponse.choices[0] && hermesResponse.choices[0].message) {
      // Cas où Hermes relaie directement le format OpenAI
      generatedCode = hermesResponse.choices[0].message.content;
      generatedCode = generatedCode.replace(/^```(tsx|typescript|javascript|jsx|js)?\n/i, '').replace(/```$/i, '').trim();
    } else {
      console.error("[DESIGN-PATCHER] ⚠️ Format de réponse Hermes inattendu :", hermesResponse);
      generatedCode = JSON.stringify(hermesResponse); // Fallback debug
    }

    // 5. Exécution du Patch Applier
    const applierResult = await patchApplier.execute({
      targetFile,
      updatedCode: generatedCode,
      backupPath
    }, context);

    return {
      success: true,
      message: "Analyse terminée, backup créé, et patch appliqué par Hermes !",
      patchPlan,
      applierResult
    };
  }
}

module.exports = new DesignPatcherSkill();
