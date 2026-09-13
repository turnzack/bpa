'use strict';
/**
 * response-helper.js — Sprint 5 RC
 * Contrat de réponse standard + middleware de sécurité.
 */
const { v4: uuid } = (() => {
  try { return require('uuid'); }
  catch { return { v4: () => `req-${Date.now()}-${Math.random().toString(36).slice(2,8)}` }; }
})();

// ─── Format de réponse standard ─────────────────────────────────────────────
function ok(res, data = {}, status = 200) {
  return res.status(status).json({
    success: true,
    data,
    error:   null,
    meta:    { requestId: res.locals.requestId, timestamp: new Date().toISOString(), version: 'v5' },
  });
}

function created(res, data = {}) { return ok(res, data, 201); }
function accepted(res, data = {}) { return ok(res, data, 202); }

function fail(res, code, message, status = 400, details = {}) {
  return res.status(status).json({
    success: false,
    data:    null,
    error:   { code, message, details },
    meta:    { requestId: res.locals.requestId, timestamp: new Date().toISOString(), version: 'v5' },
  });
}

// Erreurs sémantiques précises
const E = {
  BAD_REQUEST:    (res, msg, d={}) => fail(res, 'BAD_REQUEST',         msg, 400, d),
  NOT_FOUND:      (res, msg, d={}) => fail(res, 'NOT_FOUND',           msg, 404, d),
  CONFLICT:       (res, msg, d={}) => fail(res, 'CONFLICT',            msg, 409, d),
  UNPROCESSABLE:  (res, msg, d={}) => fail(res, 'UNPROCESSABLE',       msg, 422, d),
  FORBIDDEN:      (res, msg, d={}) => fail(res, 'FORBIDDEN',           msg, 403, d),
  UNAUTHORIZED:   (res, msg, d={}) => fail(res, 'UNAUTHORIZED',        msg, 401, d),
  INTERNAL:       (res, msg, d={}) => fail(res, 'INTERNAL_ERROR',      msg, 500, d),
  PROJECT_NOT_FOUND:  (res, id)   => fail(res, 'PROJECT_NOT_FOUND',    `Job introuvable : ${id}`, 404),
  SPEC_MISSING:       (res)       => fail(res, 'SPEC_MISSING',         'StitchSpec manquante. Appelez /design/import d\'abord.', 400),
  PATH_TRAVERSAL:     (res)       => fail(res, 'PATH_TRAVERSAL',       'Chemin interdit (..)', 403),
};

// ─── Middleware X-Request-Id ─────────────────────────────────────────────────
function requestId(req, res, next) {
  res.locals.requestId = req.headers['x-request-id'] || uuid();
  res.setHeader('X-Request-Id', res.locals.requestId);
  res.setHeader('X-Bridge-Version', 'v5');
  next();
}

// ─── Middleware Bridge-Token (optionnel, activable) ──────────────────────────
function bridgeToken(secret) {
  return (req, res, next) => {
    if (!secret) return next();
    const tok = req.headers['x-bridge-token'] || req.query['bridge_token'];
    if (tok !== secret) return E.UNAUTHORIZED(res, 'X-Bridge-Token invalide ou manquant.');
    next();
  };
}

// ─── Validation de jobId ─────────────────────────────────────────────────────
function assertJobId(jobId) {
  if (!jobId || typeof jobId !== 'string' || !/^[a-z0-9-]+$/.test(jobId)) {
    throw new Error('jobId invalide ou manquant.');
  }
}

// ─── Validation de chemin fichier ────────────────────────────────────────────
const ALLOWED_EXTENSIONS = new Set(['.ts','.tsx','.js','.jsx','.json','.css','.md','.env','.txt','.gitkeep']);
const MAX_FILE_SIZE      = 500_000; // 500 Ko

function assertSafePath(filePath) {
  if (!filePath || typeof filePath !== 'string')  throw Object.assign(new Error('path invalide'), { code: 'BAD_REQUEST' });
  if (filePath.includes('..'))                    throw Object.assign(new Error('Path traversal interdit'), { code: 'PATH_TRAVERSAL' });
  const ext = require('path').extname(filePath).toLowerCase();
  if (ext && !ALLOWED_EXTENSIONS.has(ext))        throw Object.assign(new Error(`Extension non autorisée : ${ext}`), { code: 'FORBIDDEN' });
}

function assertSafeContent(content) {
  if (typeof content !== 'string')                       throw new Error('content doit être une chaîne.');
  if (content.length > MAX_FILE_SIZE)                    throw new Error(`Fichier trop grand (max ${MAX_FILE_SIZE/1000} Ko).`);
  if (content.includes('<WebView') || content.includes('dangerouslySetInnerHTML')) {
    throw Object.assign(new Error('WebView/HTML runtime interdit.'), { code: 'UNPROCESSABLE' });
  }
}

function safeWriteFile(filePath, content, encoding = 'utf-8') {
  const fs = require('fs');
  const path = require('path');
  if (!filePath || typeof filePath !== 'string' || filePath.includes('..') || filePath.includes('\0')) {
    const err = new Error(`WORKSPACE_PATH_ESCAPE : Chemin invalide ou hors workspace (${filePath})`);
    err.code = 'WORKSPACE_PATH_ESCAPE';
    throw err;
  }
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmpPath = path.join(dir, `.${path.basename(filePath)}.${process.pid}.tmp`);
  fs.writeFileSync(tmpPath, content, encoding);
  fs.renameSync(tmpPath, filePath);
}

module.exports = { ok, created, accepted, fail, E, requestId, bridgeToken, assertJobId, assertSafePath, assertSafeContent, safeWriteFile };
