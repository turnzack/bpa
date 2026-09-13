"use strict";

class Phase5DecisionEngine {
  constructor(logger = console) {
    this.logger = logger;
  }

  /**
   * Construit le plan incrémental de décisions à partir du diff des capacités
   * et de la détection de dérive potentielle (Drift).
   */
  buildIncrementalDecision({ previousState, currentAnalysis, currentCode, userDecisions = {}, diff }) {
    const decisions = [];

    // Détermination de la sensibilité d'une capacité
    const isSensitive = (cap) => ["payments", "authentication", "authorization"].includes(cap);

    for (const capability of diff.addedCapabilities || []) {
      decisions.push({
        type: "add_capability",
        capability,
        requiresConfirmation: isSensitive(capability)
      });
    }

    for (const capability of diff.changedCapabilities || []) {
      decisions.push({
        type: "evolve_capability",
        capability,
        requiresConfirmation: isSensitive(capability)
      });
    }

    for (const capability of diff.removedCapabilities || []) {
      decisions.push({
        type: "potential_removal",
        capability,
        requiresConfirmation: true // Toujours confirmer une suppression
      });
    }

    for (const capability of diff.unchangedCapabilities || []) {
      decisions.push({
        type: "no_action",
        capability,
        preserve: true
      });
    }

    // Intégrer les décisions forcées par l'utilisateur (ex: résoudre un conflit de Drift)
    for (const dec of decisions) {
      if (userDecisions[dec.capability]) {
        Object.assign(dec, userDecisions[dec.capability]);
      }
    }

    return {
      diff,
      decisions
    };
  }
}

module.exports = Phase5DecisionEngine;
