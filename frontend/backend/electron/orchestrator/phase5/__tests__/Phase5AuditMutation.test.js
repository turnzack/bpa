'use strict';
/**
 * Phase5AuditMutation.test.js — node:test compatible
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

function assertAuditMode(body) {
  if (body.mode === 'audit_only' && body.mutate === true) {
    throw Object.assign(new Error('AUDIT_MUTATION_FORBIDDEN'), { code: 'AUDIT_MUTATION_FORBIDDEN' });
  }
}
function assertApplyMode(body) {
  if (body.mode === 'incremental_apply') {
    if (!body.confirmationId || !body.decisionHash || body.mutate !== true) {
      throw Object.assign(new Error('PHASE5_CONFIRMATION_REQUIRED'), { code: 'PHASE5_CONFIRMATION_REQUIRED' });
    }
  }
}

describe('Phase5 — Audit vs Mutation guards', () => {

  test('1. audit_only + mutate:false → OK', () => {
    assert.doesNotThrow(() => assertAuditMode({ mode: 'audit_only', mutate: false }));
  });

  test('2. audit_only + mutate:true → AUDIT_MUTATION_FORBIDDEN', () => {
    assert.throws(() => assertAuditMode({ mode: 'audit_only', mutate: true }),
      (err) => { assert.equal(err.code, 'AUDIT_MUTATION_FORBIDDEN'); return true; });
  });

  test('3. audit_only sans mutate → OK', () => {
    assert.doesNotThrow(() => assertAuditMode({ mode: 'audit_only' }));
  });

  test('4. incremental_apply sans confirmationId → PHASE5_CONFIRMATION_REQUIRED', () => {
    assert.throws(() => assertApplyMode({ mode: 'incremental_apply', mutate: true, decisionHash: 'abc' }),
      (err) => { assert.equal(err.code, 'PHASE5_CONFIRMATION_REQUIRED'); return true; });
  });

  test('5. incremental_apply sans decisionHash → PHASE5_CONFIRMATION_REQUIRED', () => {
    assert.throws(() => assertApplyMode({ mode: 'incremental_apply', mutate: true, confirmationId: 'abc' }),
      (err) => { assert.equal(err.code, 'PHASE5_CONFIRMATION_REQUIRED'); return true; });
  });

  test('6. incremental_apply sans mutate:true → PHASE5_CONFIRMATION_REQUIRED', () => {
    assert.throws(() => assertApplyMode({ mode: 'incremental_apply', confirmationId: 'abc', decisionHash: 'abc' }),
      (err) => { assert.equal(err.code, 'PHASE5_CONFIRMATION_REQUIRED'); return true; });
  });

  test('7. incremental_apply complet → OK', () => {
    assert.doesNotThrow(() => assertApplyMode({
      mode: 'incremental_apply', mutate: true,
      confirmationId: 'confirm-123',
      decisionHash:   crypto.createHash('sha256').update('test').digest('hex')
    }));
  });

  test('8. Mode absent → aucune erreur', () => {
    assert.doesNotThrow(() => assertAuditMode({}));
    assert.doesNotThrow(() => assertApplyMode({}));
  });
});
