"use strict";

const hermesClient = require("../hermes-client");
const { extractFingerprint } = require("./LogicFingerprint");

class StrictUiPlanner {
  async generatePlan({ activeSource, newDesignHtml, targetFile, mode, baseVersionId }) {
    const fingerprint = extractFingerprint(activeSource);

    const systemPrompt = `Tu es un Expert Architecte React. Ton rôle est de valider et planifier une mise à jour d'interface UI.
MODE: ${mode}
FICHIER CIBLE: ${targetFile}

CONTRAINTES STRICTES:
1. Tu dois préserver 100% de la logique existante.
2. Imports: ${JSON.stringify(fingerprint.imports)}
3. Hooks: ${JSON.stringify(fingerprint.hooks)}
4. Handlers: ${JSON.stringify(fingerprint.handlers)}
5. Appels API: ${JSON.stringify(fingerprint.apiCalls)}

${mode === "strict-ui" ? "ATTENTION MODE STRICT-UI : Tu DOIS mettre à jour les classes Tailwind pour correspondre au design, mais INTERDICTION d'inventer des classes CSS personnalisées non-Tailwind." : "MODE UI-UPDATE : Nouvelles classes CSS autorisées."}

Tu dois répondre UNIQUEMENT par un objet JSON respectant cette structure exacte :
{
  "status": "plan_ready",
  "mode": "${mode}",
  "logicPreserved": true,
  "preserve": {
    "imports": true,
    "hooks": true,
    "stores": true,
    "handlers": true,
    "apiCalls": true,
    "routes": true
  },
  "cssChanges": false,
  "classNameChanges": false,
  "files": [
    {
      "path": "${targetFile}",
      "operation": "update",
      "expectedHash": "sha256:..."
    }
  ],
  "violations": []
}`;

    const userPrompt = `Code Source Actuel:\n\`\`\`tsx\n${activeSource}\n\`\`\`\n\nNouveau HTML Proposé:\n\`\`\`html\n${newDesignHtml}\n\`\`\`\n\nGénère le plan JSON strict.`;

    const result = await hermesClient.generate(systemPrompt, userPrompt);
    let plan;
    try {
      const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*}/);
      plan = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : result);
    } catch (e) {
      throw new Error("L'IA n'a pas renvoyé un plan JSON valide.");
    }

    this.validatePlan(plan, targetFile, mode);
    return plan;
  }

  validatePlan(plan, targetFile, mode) {
    if (plan.logicPreserved !== true) {
      throw new Error("Le plan indique que la logique n'est pas préservée.");
    }
    if (mode === "strict-ui") {
      if (plan.cssChanges === true) {
        throw new Error("Le mode strict-ui interdit l'ajout de CSS personnalisé (mais autorise les modifications de classes Tailwind).");
      }
    }
    if (!plan.preserve.handlers || !plan.preserve.stores || !plan.preserve.apiCalls) {
      throw new Error("Le plan ne préserve pas les handlers, stores ou appels API.");
    }
    if (!plan.files || plan.files.length !== 1 || plan.files[0].path !== targetFile) {
      throw new Error(`Le plan doit cibler uniquement ${targetFile}.`);
    }
    if (!plan.files[0].expectedHash) {
      throw new Error("Le plan doit inclure un expectedHash.");
    }
  }
}

module.exports = new StrictUiPlanner();
