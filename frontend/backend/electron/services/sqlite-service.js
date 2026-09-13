const path = require('path');
const fs = require('fs');

/**
 * Fallback "Zéro-Casse" : Base de données JSON au lieu de SQLite (C++)
 * Permet d'éviter les erreurs de compilation (bindings) dans Electron sur Windows
 * tout en gardant exactement la même structure de données pour le RAG.
 */
class SQLiteService {
  constructor() {
    this.dbDir = path.join(__dirname, '..', '..', 'data');
    if (!fs.existsSync(this.dbDir)) {
      fs.mkdirSync(this.dbDir, { recursive: true });
    }
    this.dbPath = path.join(this.dbDir, 'rag_memory.json');
    this.initDatabase();
  }

  initDatabase() {
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify({ templates: [], template_chunks: [] }, null, 2), 'utf-8');
    }
    console.log('[MEMORY-DB] Base de données RAG (JSON) initialisée avec succès (mode portable sans C++).');
  }

  _readDB() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return { templates: [], template_chunks: [] };
    }
  }

  _writeDB(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  saveTemplate(template) {
    const db = this._readDB();
    const existingIndex = db.templates.findIndex(t => t.id === template.id);
    const newTpl = {
      id: template.id,
      name: template.name || 'Untitled',
      source: template.source || 'stitch',
      raw_html: template.raw_html,
      tokens: template.tokens || {},
      created_at: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      db.templates[existingIndex] = newTpl;
    } else {
      db.templates.push(newTpl);
    }
    
    this._writeDB(db);
  }

  saveChunk(chunk) {
    const db = this._readDB();
    const existingIndex = db.template_chunks.findIndex(c => c.id === chunk.id);
    const newChunk = {
      id: chunk.id,
      template_id: chunk.template_id,
      component_type: chunk.component_type || 'unknown',
      content: chunk.content,
      metadata: chunk.metadata || {}
    };
    
    if (existingIndex >= 0) {
      db.template_chunks[existingIndex] = newChunk;
    } else {
      db.template_chunks.push(newChunk);
    }
    
    this._writeDB(db);
  }

  getAllTemplates() {
    const db = this._readDB();
    // Trie par date décroissante
    return db.templates
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(t => ({ id: t.id, name: t.name, source: t.source, created_at: t.created_at, tokens: t.tokens }));
  }

  getTemplateById(id) {
    const db = this._readDB();
    return db.templates.find(t => t.id === id) || null;
  }

  getAllChunks(templateId) {
    const db = this._readDB();
    const chunks = db.template_chunks || [];
    return templateId ? chunks.filter(c => c.template_id === templateId) : chunks;
  }

  deleteTemplate(id) {
    const db = this._readDB();
    const initialTplCount = db.templates.length;
    db.templates = db.templates.filter(t => t.id !== id);
    db.template_chunks = (db.template_chunks || []).filter(c => c.template_id !== id);
    this._writeDB(db);
    return db.templates.length < initialTplCount;
  }
}

module.exports = new SQLiteService();
