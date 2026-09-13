"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

function loadGuestPack(projectRoot, projectId) {
  const engineDir = path.dirname(path.dirname(projectRoot));
  const rootReponsesDir = path.dirname(engineDir);
  const guestProjectDir = path.join(rootReponsesDir, "v0-guest", `guest_${projectId}`);

  if (!fs.existsSync(guestProjectDir)) {
    return null;
  }

  const manifestPath = path.join(guestProjectDir, "manifest.json");
  let manifest = null;
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch (e) {
      console.warn("[BusinessContractManager] manifest.json invalide");
    }
  }

  const files = {};
  const standardFiles = [
    "README.md",
    "domain/entities.json",
    "domain/invariants.json",
    "domain/state-machines.json",
    "contracts/state-contract.json",
    "contracts/api-contract.json",
    "contracts/ui-bindings.json",
    "workflows/workflows.json",
    "tests/acceptance.json",
    "validation/pack-report.json"
  ];

  for (const file of standardFiles) {
    const filePath = path.join(guestProjectDir, ...file.split("/"));
    if (fs.existsSync(filePath)) {
      files[file] = fs.readFileSync(filePath, "utf8");
    }
  }

  return {
    manifest,
    unresolvedItems: manifest ? manifest.unresolvedItems : [],
    files
  };
}

function compileBusinessBlueprint(guestPack) {
  if (!guestPack || !guestPack.manifest) return null;
  // Compilation simplifiée pour l'instant
  return {
    version: guestPack.manifest.schemaVersion || "1.0.0",
    projectName: guestPack.manifest.projectName,
    entities: guestPack.files["domain/entities.json"] ? JSON.parse(guestPack.files["domain/entities.json"]) : [],
    bindings: guestPack.files["contracts/ui-bindings.json"] ? JSON.parse(guestPack.files["contracts/ui-bindings.json"]) : []
  };
}

function buildContractEvidence(guestPack, businessBlueprint) {
  if (!guestPack) return null;

  const fileHashes = [];
  let businessContext = "";
  const contextId = crypto.randomUUID();

  if (guestPack.manifest) {
    businessContext += `\n\n=== SOVEREIGN PACK MANIFEST ===\n${JSON.stringify(guestPack.manifest, null, 2)}\n`;
    fileHashes.push({
      path: "manifest.json",
      sha256: crypto.createHash("sha256").update(JSON.stringify(guestPack.manifest), "utf8").digest("hex")
    });
  }

  for (const [filePath, content] of Object.entries(guestPack.files)) {
    businessContext += `\n\n=== CONTRACT ${filePath} ===\n${content}`;
    fileHashes.push({
      path: filePath,
      sha256: crypto.createHash("sha256").update(content, "utf8").digest("hex")
    });
  }

  const canonical = fileHashes
    .sort((a, b) => a.path.localeCompare(b.path))
    .map(file => `${file.path}\0${file.sha256}`)
    .join("\n");

  const contractHash = crypto.createHash("sha256").update(canonical, "utf8").digest("hex");

  return {
    contextId,
    contractHash,
    businessContext,
    contractFiles: {
      contextId,
      algorithm: "sha256",
      files: fileHashes,
      aggregateHash: contractHash
    },
    traceability: {
      missingBindings: [],
      missingCommands: [],
      missingTests: []
    }
  };
}

function computeContractHash(contractFilesArray) {
  const canonical = contractFilesArray
    .sort((a, b) => a.path.localeCompare(b.path))
    .map(file => `${file.path}\0${file.sha256}`)
    .join("\n");

  return crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
}

function writeContractArtifacts(push, contractEvidence, businessBlueprint) {
  if (!contractEvidence) return;

  const contextPath = path.join(push.pushDir, "business-context.txt");
  const blueprintPath = path.join(push.pushDir, "business-blueprint.json");
  const hashPath = path.join(push.pushDir, "contract-hash.txt");
  const filesPath = path.join(push.pushDir, "contract-files.json");

  // Include Context ID in the text evidence
  const finalContext = `=== CONTEXT_ID: ${contractEvidence.contextId} ===\n=== CONTRACT_HASH: sha256:${contractEvidence.contractHash} ===\n${contractEvidence.businessContext}`;

  fs.writeFileSync(contextPath, finalContext, "utf8");
  fs.writeFileSync(blueprintPath, JSON.stringify({ contextId: contractEvidence.contextId, ...businessBlueprint }, null, 2), "utf8");
  fs.writeFileSync(hashPath, `sha256:${contractEvidence.contractHash}\n`, "utf8");
  fs.writeFileSync(filesPath, JSON.stringify(contractEvidence.contractFiles, null, 2), "utf8");
  
  // Ecriture de l'audit append-only avec chaînage cryptographique
  const kirovDir = path.dirname(path.dirname(push.pushDir));
  const auditPath = path.join(kirovDir, "audit.log");
  
  let previousAuditHash = null;
  if (fs.existsSync(auditPath)) {
    const lines = fs.readFileSync(auditPath, "utf8").split("\n").filter(l => l.trim().length > 0);
    if (lines.length > 0) {
      try {
        const lastEntry = JSON.parse(lines[lines.length - 1]);
        previousAuditHash = lastEntry.entryHash || null;
      } catch (e) {
        // Ignorer si corrompu
      }
    }
  }

  const entry = {
    event: "business_contract_loaded",
    pushId: push.pushId,
    projectId: push.projectId,
    contractHash: `sha256:${contractEvidence.contractHash}`,
    previousAuditHash: previousAuditHash,
    timestamp: new Date().toISOString()
  };

  const entryHash = crypto.createHash("sha256").update(JSON.stringify(entry), "utf8").digest("hex");
  entry.entryHash = `sha256:${entryHash}`;

  fs.appendFileSync(auditPath, JSON.stringify(entry) + "\n", "utf8");
}

module.exports = {
  loadGuestPack,
  compileBusinessBlueprint,
  buildContractEvidence,
  computeContractHash,
  writeContractArtifacts
};
