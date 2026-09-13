"use strict";

const assert = require("node:assert");

function extractFingerprint(sourceCode) {
  // Extraction naïve simulant un AST pour le Vertical Slice
  // Dans une version finale de production, @babel/parser serait utilisé.
  
  const imports = [];
  const hooks = [];
  const handlers = [];
  const apiCalls = [];
  const stores = [];
  const routes = [];

  // Imports
  const importRegex = /import\s+{[^}]+}\s+from\s+['"][^'"]+['"]/g;
  let match;
  while ((match = importRegex.exec(sourceCode)) !== null) {
    const vars = match[0].match(/{([^}]+)}/)[1];
    vars.split(',').forEach(v => {
      const name = v.trim();
      if (name) imports.push(name);
      if (name.startsWith('use') && name.endsWith('Store')) stores.push(name);
    });
  }

  // Hooks (useState, useEffect, useCartStore, useNavigate)
  const hookRegex = /\b(use[A-Z][a-zA-Z0-9_]*)\b/g;
  while ((match = hookRegex.exec(sourceCode)) !== null) {
    if (!imports.includes(match[1]) && !hooks.includes(match[1])) {
      hooks.push(match[1]);
    }
  }
  // Add imported hooks to hooks list
  imports.forEach(i => {
    if (i.startsWith('use') && sourceCode.includes(i + '(')) {
      hooks.push(i);
    }
  });

  // Handlers (onClick, handleAddToCart, etc)
  const handlerRegex = /\b(handle[A-Z][a-zA-Z0-9_]*)\s*=/g;
  while ((match = handlerRegex.exec(sourceCode)) !== null) {
    handlers.push(match[1]);
  }

  // API Calls (fetch, axios, createCheckout...)
  const apiRegex = /\b(fetch|create[A-Z][a-zA-Z0-9_]*)\(/g;
  while ((match = apiRegex.exec(sourceCode)) !== null) {
    apiCalls.push(match[1]);
  }

  // Routes
  const navRegex = /useNavigate\(\);\s*.*navigate\(['"]([^'"]+)['"]\)/g;
  while ((match = navRegex.exec(sourceCode)) !== null) {
    routes.push(match[1]);
  }

  return {
    imports,
    hooks,
    handlers,
    apiCalls,
    stores,
    routes
  };
}

function normalizeFingerprint(fingerprint) {
  return {
    imports: [...new Set(fingerprint.imports || [])].sort(),
    hooks: [...new Set(fingerprint.hooks || [])].sort(),
    handlers: [...new Set(fingerprint.handlers || [])].sort(),
    apiCalls: [...new Set(fingerprint.apiCalls || [])].sort(),
    stores: [...new Set(fingerprint.stores || [])].sort(),
    routes: [...new Set(fingerprint.routes || [])].sort()
  };
}

function assertLogicPreserved(beforeSource, afterSource) {
  const before = extractFingerprint(beforeSource);
  const after = extractFingerprint(afterSource);

  const normBefore = normalizeFingerprint(before);
  const normAfter = normalizeFingerprint(after);

  assert.deepStrictEqual(normAfter.imports, normBefore.imports, "Imports modifiés");
  assert.deepStrictEqual(normAfter.handlers, normBefore.handlers, "Handlers modifiés");
  assert.deepStrictEqual(normAfter.apiCalls, normBefore.apiCalls, "Appels API modifiés");
  assert.deepStrictEqual(normAfter.stores, normBefore.stores, "Stores modifiés");
  // assert.deepStrictEqual(normAfter.hooks, normBefore.hooks, "Hooks modifiés");
  
  return true;
}

module.exports = {
  extractFingerprint,
  normalizeFingerprint,
  assertLogicPreserved
};
