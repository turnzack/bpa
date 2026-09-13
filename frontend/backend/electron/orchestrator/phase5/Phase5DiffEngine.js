"use strict";

class Phase5DiffEngine {
  constructor(logger = console) {
    this.logger = logger;
  }

  /**
   * Compare les capacités entre l'ancien contrat et le nouveau contrat.
   * Ne compare pas aveuglément du JSON, mais trie/analyse l'état des composants.
   */
  diffCapabilities(previous = {}, current = {}) {
    const added = [];
    const removed = [];
    const changed = [];
    const unchanged = [];

    const names = new Set([
      ...Object.keys(previous),
      ...Object.keys(current)
    ]);

    for (const name of names) {
      const before = previous[name] || null;
      const after = current[name] || null;

      if (!before && after) {
        added.push(name);
        continue;
      }

      if (before && !after) {
        removed.push(name);
        continue;
      }

      // Normalisation rudimentaire pour éviter les faux positifs d'ordre des clés
      const beforeStr = JSON.stringify(this.sortObject(before));
      const afterStr = JSON.stringify(this.sortObject(after));

      if (beforeStr !== afterStr) {
        changed.push(name);
      } else {
        unchanged.push(name);
      }
    }

    return {
      added,
      removed,
      changed,
      unchanged
    };
  }

  /**
   * Trie récursivement les clés d'un objet pour la comparaison JSON.
   */
  sortObject(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObject(item)).sort();
    }
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = this.sortObject(obj[key]);
        return result;
      }, {});
  }

  /**
   * Compare deux contrats complets.
   */
  computeDiff(previousContract = {}, currentContract = {}) {
    const prevCaps = previousContract.capabilities || [];
    const currCaps = currentContract.capabilities || [];

    const prevMap = {};
    const currMap = {};

    // Gère le cas où capabilities est un tableau de strings, un tableau d'objets, ou un dictionnaire
    if (Array.isArray(prevCaps)) {
      for (const cap of prevCaps) {
        if (typeof cap === 'string') prevMap[cap] = {};
        else if (cap && cap.id) prevMap[cap.id] = cap;
      }
    } else {
      Object.assign(prevMap, prevCaps);
    }

    if (Array.isArray(currCaps)) {
      for (const cap of currCaps) {
        if (typeof cap === 'string') currMap[cap] = {};
        else if (cap && cap.id) currMap[cap.id] = cap;
      }
    } else {
      Object.assign(currMap, currCaps);
    }

    const { added, removed, changed, unchanged } = this.diffCapabilities(prevMap, currMap);

    return {
      addedCapabilities: added,
      removedCapabilities: removed,
      changedCapabilities: changed,
      unchangedCapabilities: unchanged
    };
  }
}

module.exports = Phase5DiffEngine;
