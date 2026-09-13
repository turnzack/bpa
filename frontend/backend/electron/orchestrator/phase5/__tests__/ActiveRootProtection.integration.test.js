'use strict';
/**
 * ActiveRootProtection.integration.test.js — node:test compatible
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const path   = require('path');
const fs     = require('fs');
const os     = require('os');

const ArtifactWriter = require('../../ArtifactWriter');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kirov5-aw-'));

function makeWriter(stagingPath, activePath) {
  fs.mkdirSync(stagingPath, { recursive: true });
  fs.mkdirSync(activePath,  { recursive: true });
  return new ArtifactWriter({ projectId: 'TEST', runId: 'run-1', stagingRoot: stagingPath, activeRoot: activePath, audit: [], policy: null });
}

describe('ArtifactWriter — activeRoot Protection', () => {

  test('1. Écriture dans staging → OK + fichier créé', () => {
    const staging = path.join(tmpDir, 'staging-ok');
    const active  = path.join(tmpDir, 'active-ok');
    const writer  = makeWriter(staging, active);
    assert.doesNotThrow(() => writer.write('src/test.ts', 'export {};', { operation: 'create', source: 'test' }));
    assert.ok(fs.existsSync(path.join(staging, 'src', 'test.ts')));
  });

  test('2. staging === active → STAGING_ACTIVE_COLLISION', () => {
    const same = path.join(tmpDir, 'same-dir');
    fs.mkdirSync(same, { recursive: true });
    const writer = makeWriter(same, same);
    assert.throws(() => writer.write('src/test.ts', 'content'),
      (err) => { assert.equal(err.code, 'STAGING_ACTIVE_COLLISION'); return true; });
  });

  test('3. Path traversal → erreur levée', () => {
    const staging = path.join(tmpDir, 'staging-pt');
    const active  = path.join(tmpDir, 'active-pt');
    const writer  = makeWriter(staging, active);
    assert.throws(() => writer.write('../../../etc/passwd', 'evil'));
  });

  test('4. activeRoot inchangé après écriture staging', () => {
    const staging = path.join(tmpDir, 'staging-integrity');
    const active  = path.join(tmpDir, 'active-integrity');
    const writer  = makeWriter(staging, active);
    const before  = fs.readdirSync(active);
    writer.write('src/safe.ts', '// safe', { operation: 'create', source: 'test' });
    const after   = fs.readdirSync(active);
    assert.deepEqual(before, after);
  });

  test('5. Chemin retourné est dans stagingRoot', () => {
    const staging = path.join(tmpDir, 'staging-loc');
    const active  = path.join(tmpDir, 'active-loc');
    const writer  = makeWriter(staging, active);
    const written = writer.write('components/Button.tsx', 'export default () => null;');
    assert.ok(written.startsWith(path.resolve(staging)));
  });
});
