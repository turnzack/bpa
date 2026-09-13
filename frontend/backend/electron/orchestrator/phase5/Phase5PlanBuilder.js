"use strict";

/**
 * Mappe un nom de capacité vers les fichiers canoniques à créer.
 * Convention : src/services/<cap>/<CapName>Service.ts
 */
const CAPABILITY_FILE_MAP = {
  authentication: ['src/services/auth/AuthService.ts', 'src/api/auth.ts'],
  auth:           ['src/services/auth/AuthService.ts', 'src/api/auth.ts'],
  persistence:    ['src/services/db/DatabaseService.ts', 'src/api/client.ts'],
  database:       ['src/services/db/DatabaseService.ts'],
  payments:       ['src/services/payment/PaymentService.ts', 'src/api/payment.ts'],
  payment:        ['src/services/payment/PaymentService.ts'],
  catalog:        ['src/services/catalog/CatalogService.ts', 'src/api/catalog.ts'],
  media:          ['src/services/media/MediaService.ts', 'src/api/media.ts'],
  community:      ['src/services/community/CommunityService.ts', 'src/api/community.ts'],
  orders:         ['src/services/orders/OrderService.ts', 'src/api/order.ts'],
  order:          ['src/services/orders/OrderService.ts', 'src/api/order.ts'],
};

/**
 * Dérive les chemins de fichiers standards pour une capacité donnée.
 * Utilisé quand le contrat ne précise pas filesToCreate explicitement.
 */
function deriveFilesForCapability(capId) {
  const key = String(capId).toLowerCase().replace(/-/g, '_');
  if (CAPABILITY_FILE_MAP[key]) return CAPABILITY_FILE_MAP[key];
  for (const [k, v] of Object.entries(CAPABILITY_FILE_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  const safe   = key.replace(/[^a-z0-9]/g, '');
  const pascal = safe.charAt(0).toUpperCase() + safe.slice(1);
  return [`src/services/${safe}/${pascal}Service.ts`];
}

class Phase5PlanBuilder {
  constructor(logger = console) {
    this.logger = logger;
  }

  build({ previousState, currentState, diff, decisions }) {
    const plan = {
      preserve:     [],
      modify:       [],
      create:       [],
      delete:       [],
      capabilities: []
    };

    if (!currentState) return plan;

    // 1. Capacités du contrat actuel
    const caps = currentState.capabilities || [];
    for (const cap of caps) {
      if (typeof cap === 'string') {
        plan.capabilities.push({ id: cap, required: true });
      } else if (cap && cap.id) {
        plan.capabilities.push({ id: cap.id, required: cap.required !== false });
      }
    }

    // 2. Fichiers explicites depuis le contrat (priorité absolue)
    if (Array.isArray(currentState.filesToCreate)) {
      for (const file of currentState.filesToCreate) {
        if (file && file.path) plan.create.push(file.path);
        else if (typeof file === 'string') plan.create.push(file);
      }
    }

    if (Array.isArray(currentState.filesToModify)) {
      for (const file of currentState.filesToModify) {
        if (file && file.path) plan.modify.push(file.path);
        else if (typeof file === 'string') plan.modify.push(file);
      }
    }

    if (Array.isArray(currentState.filesToPreserve)) {
      for (const file of currentState.filesToPreserve) {
        if (file && file.path) plan.preserve.push(file.path);
        else if (typeof file === 'string') plan.preserve.push(file);
      }
    }

    // 3. Dérivation automatique depuis le diff
    //    Si le contrat ne liste pas filesToCreate, on génère les fichiers canoniques
    //    pour chaque nouvelle capacité détectée dans le diff.
    if (diff && Array.isArray(diff.addedCapabilities) && plan.create.length === 0) {
      for (const capId of diff.addedCapabilities) {
        const derived = deriveFilesForCapability(capId);
        for (const filePath of derived) {
          if (!plan.create.includes(filePath)) plan.create.push(filePath);
        }
      }
    }

    // 4. Fichiers des capacités précédentes → preserve
    if (previousState && Array.isArray(previousState.implementationManifest?.managedFiles)) {
      for (const mf of previousState.implementationManifest.managedFiles) {
        const p = mf.path || mf;
        if (p && !plan.modify.includes(p) && !plan.create.includes(p) && !plan.preserve.includes(p)) {
          plan.preserve.push(p);
        }
      }
    }

    return plan;
  }
}

module.exports = Phase5PlanBuilder;
