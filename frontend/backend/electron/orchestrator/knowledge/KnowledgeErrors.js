'use strict';

/**
 * KnowledgeErrors.js
 * Erreurs typées pour le module KnowledgeProvider.
 * Permet une gestion d'erreur exhaustive et traçable dans les gates.
 */

class KnowledgeError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'KnowledgeError';
    this.code = code;
    this.details = details;
  }
}

const KnowledgeErrors = {
  PROVIDER_UNAVAILABLE: (resource) =>
    new KnowledgeError(
      'KNOWLEDGE_PROVIDER_UNAVAILABLE',
      `Le KnowledgeProvider est indisponible pour la ressource : ${resource}`,
      { resource }
    ),

  SIGNATURE_INVALID: (resource) =>
    new KnowledgeError(
      'KNOWLEDGE_SIGNATURE_INVALID',
      `La signature du bundle de méthodologie est invalide ou corrompue : ${resource}`,
      { resource }
    ),

  HASH_MISMATCH: (resource, expected, received) =>
    new KnowledgeError(
      'KNOWLEDGE_HASH_MISMATCH',
      `Le hash du fichier de méthodologie ne correspond pas : ${resource}`,
      { resource, expected, received }
    ),

  RESOURCE_NOT_FOUND: (resource) =>
    new KnowledgeError(
      'KNOWLEDGE_RESOURCE_NOT_FOUND',
      `Ressource de méthodologie introuvable dans le bundle : ${resource}`,
      { resource }
    ),

  PATH_TRAVERSAL: (resource) =>
    new KnowledgeError(
      'KNOWLEDGE_PATH_TRAVERSAL',
      `Tentative de path traversal bloquée : ${resource}`,
      { resource }
    ),

  BUNDLE_CORRUPTED: (details) =>
    new KnowledgeError(
      'KNOWLEDGE_BUNDLE_CORRUPTED',
      'Le bundle local de méthodologie est corrompu ou absent.',
      { details }
    ),

  VERSION_INCOMPATIBLE: (expected, received) =>
    new KnowledgeError(
      'KNOWLEDGE_VERSION_INCOMPATIBLE',
      `Version de méthodologie incompatible. Attendu: ${expected}, Reçu: ${received}`,
      { expected, received }
    ),
};

module.exports = { KnowledgeError, KnowledgeErrors };
