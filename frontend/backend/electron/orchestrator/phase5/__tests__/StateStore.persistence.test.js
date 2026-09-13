'use strict';
/**
 * StateStore.persistence.test.js — node:test compatible
 */
const { test, describe, before } = require('node:test');
const assert  = require('node:assert/strict');
const path    = require('path');
const fs      = require('fs');
const os      = require('os');

const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'kirov5-ss-'));

function freshStore(suffix) {
  // Purge le singleton du cache Node
  const key = require.resolve('../../state-store');
  delete require.cache[key];
  const store = require('../../state-store');
  // Appel synchrone de init (init retourne une Promise mais mkdirSync est sync)
  const sessDir = path.join(tmpBase, suffix);
  fs.mkdirSync(sessDir, { recursive: true });
  store.init(sessDir); // async ignoré volontairement pour les tests sync
  return store;
}

describe('StateStore — Zero Trust v2', () => {

  test('1. initBatchSession génère sessionId + contractHash + completedBatchIds vide', () => {
    const store   = freshStore('t1');
    const batches = [{ id: 'b0' }, { id: 'b1' }];
    const session = store.initBatchSession('PROJ_A', batches, 'deepseek', 'test');
    assert.ok(session.sessionId,   'sessionId doit exister');
    assert.ok(session.contractHash, 'contractHash doit exister');
    assert.deepEqual(session.completedBatchIds, []);
    assert.equal(session.currentBatchId, 'b0');
  });

  test('2. advanceBatch refuse STALE_SESSION', () => {
    const store   = freshStore('t2');
    const batches = [{ id: 'b0' }, { id: 'b1' }];
    const session = store.initBatchSession('PROJ_B', batches, 'deepseek', 'test');
    assert.throws(
      () => store.advanceBatch({ projectId: 'PROJ_B', sessionId: 'bad', batchId: 'b0', contractHash: session.contractHash }),
      (err) => { assert.equal(err.code, 'STALE_SESSION'); return true; }
    );
  });

  test('3. advanceBatch refuse CONTRACT_HASH_MISMATCH', () => {
    const store   = freshStore('t3');
    const batches = [{ id: 'b0' }];
    const session = store.initBatchSession('PROJ_C', batches, 'deepseek', 'test');
    assert.throws(
      () => store.advanceBatch({ projectId: 'PROJ_C', sessionId: session.sessionId, batchId: 'b0', contractHash: 'bad' }),
      (err) => { assert.equal(err.code, 'CONTRACT_HASH_MISMATCH'); return true; }
    );
  });

  test('4. advanceBatch refuse UNEXPECTED_BATCH', () => {
    const store   = freshStore('t4');
    const batches = [{ id: 'b0' }, { id: 'b1' }];
    const session = store.initBatchSession('PROJ_D', batches, 'deepseek', 'test');
    assert.throws(
      () => store.advanceBatch({ projectId: 'PROJ_D', sessionId: session.sessionId, batchId: 'b99', contractHash: session.contractHash }),
      (err) => { assert.equal(err.code, 'UNEXPECTED_BATCH'); return true; }
    );
  });

  test('5. Double captureId → duplicate:true, advanced:false', () => {
    const store   = freshStore('t5');
    const batches = [{ id: 'b0' }, { id: 'b1' }];
    const session = store.initBatchSession('PROJ_E', batches, 'deepseek', 'test');
    const r1 = store.advanceBatch({ projectId: 'PROJ_E', sessionId: session.sessionId, batchId: 'b0', contractHash: session.contractHash, captureId: 'cap-1' });
    assert.equal(r1.advanced, true);
    const r2 = store.advanceBatch({ projectId: 'PROJ_E', sessionId: session.sessionId, batchId: 'b0', contractHash: session.contractHash, captureId: 'cap-1' });
    assert.equal(r2.duplicate, true);
    assert.equal(r2.advanced,  false);
  });

  test('6. phase5AutoTriggered posé quand dernier lot traité', () => {
    const store   = freshStore('t6');
    const batches = [{ id: 'b0' }];
    const session = store.initBatchSession('PROJ_G', batches, 'deepseek', 'test');
    store.advanceBatch({ projectId: 'PROJ_G', sessionId: session.sessionId, batchId: 'b0', contractHash: session.contractHash });
    const updated = store.getBatchSession('PROJ_G');
    assert.equal(updated.status,             'completed');
    assert.equal(updated.phase5AutoTriggered, true);
  });

  test('7. setBatchSession ajoute sessionId/contractHash si absents', () => {
    const store = freshStore('t7');
    store.setBatchSession('PROJ_H', { batches: [{ id: 'b0' }], totalBatches: 1 });
    const s = store.getBatchSession('PROJ_H');
    assert.ok(s.sessionId);
    assert.ok(s.contractHash);
    assert.deepEqual(s.completedBatchIds, []);
  });
});
