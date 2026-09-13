'use strict';

/**
 * KnowledgeProvider.js
 * Classe de base abstraite pour tous les fournisseurs de méthodologie.
 * Tous les providers doivent hériter de cette classe et implémenter ses méthodes.
 */

class KnowledgeProvider {
  /**
   * Récupère un fichier de méthodologie (prompts, policies, schemas, templates).
   * @param {string} pathname - Chemin relatif dans le bundle (ex: "prompts/phase4-backend-api.md")
   * @returns {Promise<{ content: string, version: string, hash: string, source: string, verified: boolean }>}
   */
  async getMethodology(pathname) {
    throw new Error('METHOD_NOT_IMPLEMENTED: getMethodology must be overridden.');
  }

  /**
   * Récupère un fichier de politique de code.
   * @param {string} pathname - ex: "policies/coding-standards.md"
   * @returns {Promise<{ content: string, version: string, hash: string, source: string, verified: boolean }>}
   */
  async getPolicy(pathname) {
    return this.getMethodology(pathname);
  }

  /**
   * Récupère un fichier de schéma JSON.
   * @param {string} pathname - ex: "schemas/project-structure.json"
   * @returns {Promise<{ content: string, version: string, hash: string, source: string, verified: boolean }>}
   */
  async getSchema(pathname) {
    return this.getMethodology(pathname);
  }

  /**
   * Vérifie que le provider est opérationnel (connectivity check).
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    throw new Error('METHOD_NOT_IMPLEMENTED: isAvailable must be overridden.');
  }
}

module.exports = KnowledgeProvider;
