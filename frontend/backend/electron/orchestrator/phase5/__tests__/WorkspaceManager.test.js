'use strict';
/**
 * WorkspaceManager.test.js — node:test compatible
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const path   = require('path');
const fs     = require('fs');
const os     = require('os');

const { WorkspaceManager } = require('../../WorkspaceManager');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kirov5-workspace-'));

describe('WorkspaceManager — Zero Trust v2', () => {

  test('1. paths.active != projectRoot', () => {
    const wm = new WorkspaceManager(tmpDir, 'TEST_PROJ_1', 'run-test');
    assert.notEqual(path.resolve(wm.paths.active), path.resolve(wm.projectRoot));
  });

  test('2. paths.active contient /active', () => {
    const wm = new WorkspaceManager(tmpDir, 'TEST_PROJ_2', 'run-test');
    assert.ok(wm.paths.active.includes('active'));
  });

  test('3. paths.staging != paths.active', () => {
    const wm = new WorkspaceManager(tmpDir, 'TEST_PROJ_3', 'run-test');
    assert.notEqual(path.resolve(wm.paths.staging), path.resolve(wm.paths.active));
  });

  test('4. assertStagingNotActive lève STAGING_ACTIVE_COLLISION', () => {
    const wm = new WorkspaceManager(tmpDir, 'TEST_PROJ_4', 'run-test');
    const original = wm.paths.staging;
    wm.paths.staging = wm.paths.active;
    assert.throws(() => wm.assertStagingNotActive(),
      (err) => { assert.equal(err.code, 'STAGING_ACTIVE_COLLISION'); return true; });
    wm.paths.staging = original;
  });

  test('5. init() crée staging et active', () => {
    const wm = new WorkspaceManager(tmpDir, 'TEST_PROJ_5', 'run-init');
    wm.init();
    assert.ok(fs.existsSync(wm.paths.active));
    assert.ok(fs.existsSync(wm.paths.staging));
  });

  test('6. resolveInside refuse path traversal', () => {
    const wm = new WorkspaceManager(tmpDir, 'TEST_PROJ_6', 'run-test');
    assert.throws(() => wm.resolveInside('../../etc/passwd'));
  });

  test('7. detectLegacyLayout retourne isLegacy=false pour projet vide', () => {
    const wm = new WorkspaceManager(tmpDir, 'EMPTY_PROJ', 'run-test');
    fs.mkdirSync(wm.projectRoot, { recursive: true });
    const result = wm.detectLegacyLayout();
    assert.equal(result.isLegacy, false);
  });
});
