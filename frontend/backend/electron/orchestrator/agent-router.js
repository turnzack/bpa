const path = require('path');
const fs = require('fs');
const { validate, getSchemaInfo } = require('./intent-validator');

/**
 * AgentRouter (v0.10.0 - EPIC-17)
 * Cerveau de routage : transforme une intention (Intent) en action (Skill).
 */
class AgentRouter {
  constructor() {
    this.skillsPath = path.join(__dirname, '..', 'skills');
    
    // Mapping Intention -> Skill (Fichier)
    this.intentMap = {
      'INDEX_STITCH': 'stitch-indexer',
      'PATCH_UI': 'design-patcher',
      'SEARCH_TEMPLATE': 'rag-query',
      'INSPECT_PROJECT': 'react-project-introspector',
      'APPLY_PATCH': 'patch-applier'
    };
  }

  /**
   * Traite une HandoffRequest venant de l'interface ou du DSL
   */
  async executeIntent(intent, payload, context) {
    console.log(`\n🤖 [AGENT-ROUTER] Réception de l'Intent : ${intent}`);

    // ✅ Validation du payload (Contrats v0.10.0)
    const validation = validate(intent, payload);
    if (!validation.ok) {
      console.error(`[AGENT-ROUTER] ❌ Payload invalide : ${validation.error}`);
      return { success: false, error: validation.error };
    }
    const sanitizedPayload = validation.sanitized || payload;
    console.log(`[AGENT-ROUTER] ✅ Payload validé pour l'intent "${intent}"`);

    const skillName = this.intentMap[intent];
    if (!skillName) {
      console.error(`[AGENT-ROUTER] ❌ Intent inconnu : ${intent}`);
      return { success: false, error: `Intent inconnu ou non supporté : ${intent}` };
    }

    console.log(`[AGENT-ROUTER] 🔀 Routage vers le skill : ${skillName}`);
    
    try {
      const skillFile = path.join(this.skillsPath, `${skillName}.js`);
      
      // Si le skill n'existe pas encore (on est au Sprint 1), on mock
      if (!fs.existsSync(skillFile)) {
        console.log(`[AGENT-ROUTER] ⚠️ Le skill "${skillName}.js" n'existe pas encore. Bouchon (Mock) activé.`);
        return {
          success: true,
          mock: true,
          message: `Le routage vers ${skillName} fonctionne ! (Le code du skill sera implémenté aux sprints suivants)`,
          intent,
          skillName,
          receivedPayload: payload
        };
      }

      // Si le skill existe, on l'exécute avec le payload sanitized
      const skill = require(skillFile);
      if (typeof skill.execute !== 'function') {
        throw new Error(`Le skill ${skillName} doit exporter une méthode "execute(payload, context)"`);
      }
      
      return await skill.execute(sanitizedPayload, context);
      
    } catch (error) {
      console.error(`[AGENT-ROUTER] ❌ Erreur lors de l'exécution du skill ${skillName}:`, error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new AgentRouter();

// Export utilitaire pour debug
module.exports.getSchemaInfo = getSchemaInfo;
