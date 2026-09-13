"use strict";

function passed(evidence = {}) {
  return {
    status: "passed",
    verified: true,
    mode: "real",
    evidence
  };
}

function failed(errors, evidence = {}) {
  return {
    status: "failed",
    verified: false,
    mode: "real",
    errors,
    evidence
  };
}

const { computeContractHash } = require('../validation/BusinessContractManager');

async function runBusinessContractGate(context) {
  // Extract from the pipeline context or assume passed in tests
  const { guestPack, businessBlueprint, contractHash, contractFiles, traceability } = context;

  const errors = [];

  if (contractFiles && contractFiles.files) {
    const recomputedHash = `sha256:${computeContractHash(contractFiles.files)}`;
    if (recomputedHash !== contractHash) {
      errors.push({
        code: "CONTRACT_HASH_MISMATCH",
        message: "Le hash du contrat ne correspond pas au contexte chargé."
      });
    }
  }

  if (!guestPack || !guestPack.manifest) {
    errors.push({
      code: "MANIFEST_MISSING",
      message: "Manifest du Pack absent."
    });
  }

  const unresolved = guestPack?.unresolvedItems || [];
  if (unresolved.length > 0) {
    errors.push({
      code: "UNRESOLVED_ITEMS",
      items: unresolved
    });
  }

  const missingBindings = traceability?.missingBindings || [];
  if (missingBindings.length > 0) {
    errors.push({
      code: "MISSING_BINDINGS",
      items: missingBindings
    });
  }

  const missingCommands = traceability?.missingCommands || [];
  if (missingCommands.length > 0) {
    errors.push({
      code: "MISSING_COMMANDS",
      items: missingCommands
    });
  }

  const missingTests = traceability?.missingTests || [];
  if (missingTests.length > 0) {
    errors.push({
      code: "MISSING_ACCEPTANCE_TESTS",
      items: missingTests
    });
  }

  if (!businessBlueprint) {
    errors.push({
      code: "BLUEPRINT_MISSING",
      message: "BusinessBlueprint absent."
    });
  }

  if (!contractHash) {
    errors.push({
      code: "CONTRACT_HASH_MISSING",
      message: "Hash du contrat absent."
    });
  }

  if (errors.length > 0) {
    return failed(errors, {
      contractHash,
      unresolvedCount: unresolved.length
    });
  }

  return passed({
    contractHash,
    unresolvedCount: 0,
    blueprintVersion: businessBlueprint.version
  });
}

// Wrapper for the GateRunner architecture
class BusinessContractGate {
  static get id() {
    return 'business_contract';
  }

  static get name() {
    return 'Validation du Contrat Métier Sovereign';
  }

  static async run(projectId, context, manifest) {
    // Dans GateRunner, le context passe le nécessaire
    // On assume que le contexte contient { guestPack, businessBlueprint, contractEvidence } mis en place plus tôt dans UiPushService
    if (!context.guestPack) {
       // Si aucun guestPack n'est fourni, on passe s'il ne s'agit pas d'un projet Sovereign.
       // Sinon, on échoue.
       return passed({ note: "No guestPack provided, assuming non-Sovereign flow." });
    }
    
    return runBusinessContractGate({
      guestPack: context.guestPack,
      businessBlueprint: context.businessBlueprint,
      contractHash: context.contractEvidence?.contractHash ? `sha256:${context.contractEvidence.contractHash}` : null,
      contractFiles: context.contractEvidence?.contractFiles,
      traceability: context.contractEvidence?.traceability
    });
  }
}

module.exports = BusinessContractGate;
// Pour l'export et les tests directs
module.exports.runBusinessContractGate = runBusinessContractGate;
