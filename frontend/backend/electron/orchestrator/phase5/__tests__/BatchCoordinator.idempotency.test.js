'use strict';
/**
 * BatchCoordinator.idempotency.test.js — node:test compatible
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const path   = require('path');
const fs     = require('fs');
const os     = require('os');

const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'kirov5-bc-'));

function freshPair(suffix) {
  const sessDir = path.join(tmpBase, suffix);
  fs.mkdirSync(sessDir, { recursive: true });

  // Purge singletons
  delete require.cache[require.resolve('../../state-store')];
  delete require.cache[require.resolve('../../BatchCoordinator')];

  const store = require('../../state-store');
  store.init(sessDir);
  const coordinator = require('../../BatchCoordinator');
  return { store, coordinator };
}

describe('BatchCoordinator — Idempotence & Zero Trust', () => {

  test('1. STALE_SESSION si sessionId incorrect', async () => {
    const { store, coordinator } = freshPair('t1');
    const session = store.initBatchSession('BC1', [{ id: 'b0' }, { id: 'b1' }], 'deepseek', 'test');
    await assert.rejects(
      () => coordinator.acceptCapture({ projectId: 'BC1', sessionId: 'wrong', batchId: 'b0', contractHash: session.contractHash }),
      (err) => { assert.equal(err.code, 'STALE_SESSION'); return true; }
    );
  });

  test('2. CONTRACT_HASH_MISMATCH si hash incorrect', async () => {
    const { store, coordinator } = freshPair('t2');
    const session = store.initBatchSession('BC2', [{ id: 'b0' }], 'deepseek', 'test');
    await assert.rejects(
      () => coordinator.acceptCapture({ projectId: 'BC2', sessionId: session.sessionId, batchId: 'b0', contractHash: 'bad' }),
      (err) => { assert.equal(err.code, 'CONTRACT_HASH_MISMATCH'); return true; }
    );
  });

  test('3. Double capture → duplicate:true, advanced:false', async () => {
    const { store, coordinator } = freshPair('t3');
    const session   = store.initBatchSession('BC3', [{ id: 'b0' }, { id: 'b1' }], 'deepseek', 'test');
    const captureId = 'cap-unique-1';
    const r1 = await coordinator.acceptCapture({ projectId: 'BC3', sessionId: session.sessionId, batchId: 'b0', contractHash: session.contractHash, captureId });
    assert.equal(r1.advanced,  true);
    assert.equal(r1.duplicate, false);
    const r2 = await coordinator.acceptCapture({ projectId: 'BC3', sessionId: session.sessionId, batchId: 'b0', contractHash: session.contractHash, captureId });
    assert.equal(r2.duplicate, true);
    assert.equal(r2.advanced,  false);
    assert.equal(r2.status,    'staged');
  });

  test('4. status est toujours "staged", promoted=0, activeModified=false', async () => {
    const { store, coordinator } = freshPair('t4');
    const session = store.initBatchSession('BC4', [{ id: 'b0' }], 'deepseek', 'test');
    const result  = await coordinator.acceptCapture({ projectId: 'BC4', sessionId: session.sessionId, batchId: 'b0', contractHash: session.contractHash });
    assert.equal(result.status,        'staged');
    assert.equal(result.promoted,       0);
    assert.equal(result.activeModified, false);
  });

  test('5. makeCaptureId stable et reproductible', () => {
    const { coordinator } = freshPair('t5');
    const id1 = coordinator.makeCaptureId('s1', 'b2', 3);
    const id2 = coordinator.makeCaptureId('s1', 'b2', 3);
    assert.equal(id1, id2);
    assert.ok(id1.includes('s1'));
    assert.ok(id1.includes('b2'));
  });

  test('6. currentBatch avance une seule fois même en double appel', async () => {
    const { store, coordinator } = freshPair('t6');
    const session = store.initBatchSession('BC6', [{ id: 'b0' }, { id: 'b1' }, { id: 'b2' }], 'deepseek', 'test');
    const captureId = 'single-cap';
    await coordinator.acceptCapture({ projectId: 'BC6', sessionId: session.sessionId, batchId: 'b0', contractHash: session.contractHash, captureId });
    await coordinator.acceptCapture({ projectId: 'BC6', sessionId: session.sessionId, batchId: 'b0', contractHash: session.contractHash, captureId });
    const updated = store.getBatchSession('BC6');
    assert.equal(updated.currentBatch,          1,    'currentBatch doit être 1, pas 2');
    assert.equal(updated.completedBatchIds.length, 1, 'completedBatchIds ne doit avoir qu\'une entrée');
  });
});
