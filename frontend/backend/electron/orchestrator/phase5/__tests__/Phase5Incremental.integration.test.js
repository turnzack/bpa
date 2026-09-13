const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const Phase5Service = require('../Phase5Service');

async function createTestRoot() {
  return fsPromises.mkdtemp(path.join(os.tmpdir(), "kirov5-phase5-"));
}

async function createFixtureV1(root) {
  // V1 Fixture
  const files = [
    { path: 'src/services/payment/stripePaymentService.ts', content: 'v1' },
    { path: 'server/webhooks/stripe.ts', content: 'v1' },
    { path: 'src/services/cart/CartRepository.ts', content: 'v1' },
    { path: 'contracts/phase5-industrialization.json', content: JSON.stringify({ capabilities: ['persistence', 'payments'] }) }
  ];

  for (const f of files) {
    const full = path.join(root, f.path);
    await fsPromises.mkdir(path.dirname(full), { recursive: true });
    await fsPromises.writeFile(full, f.content);
  }

  // Create current.json
  const kirovDir = path.join(root, '.kirov', 'phase5');
  await fsPromises.mkdir(kirovDir, { recursive: true });

  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update('v1').digest('hex');

  await fsPromises.writeFile(path.join(kirovDir, 'current.json'), JSON.stringify({
    lastSuccessfulVersion: 1,
    contract: { capabilities: ['persistence', 'payments'] },
    implementationManifest: {
      managedFiles: [
        { path: 'src/services/payment/stripePaymentService.ts', implementationHash: `sha256:${hash}` },
        { path: 'server/webhooks/stripe.ts', implementationHash: `sha256:${hash}` }
      ]
    }
  }));
}

test("Test 1: V1 initiale", async () => {
  const root = await createTestRoot();
  try {
    const service = new Phase5Service();
    // Setup contract but no current.json
    await fsPromises.mkdir(path.join(root, 'contracts'), { recursive: true });
    await fsPromises.writeFile(path.join(root, 'contracts', 'phase5-industrialization.json'), JSON.stringify({ capabilities: ['persistence'] }));
    
    const result = await service.runIncrementalPhase5({
      projectRoot: root,
      projectId: "test_initial",
      pushDir: path.join(root, "push"),
      options: {}
    });

    assert.equal(result.status, "passed");
    assert.equal(result.stateCommitted, true);
    
    const currentJson = JSON.parse(await fsPromises.readFile(path.join(root, '.kirov', 'phase5', 'current.json'), 'utf8'));
    assert.equal(currentJson.lastSuccessfulVersion, 1);
  } finally {
    await fsPromises.rm(root, { recursive: true, force: true });
  }
});

test("Test 2: V2 additive", async () => {
  const root = await createTestRoot();
  try {
    await createFixtureV1(root);
    
    // update contract to simulate V2
    await fsPromises.writeFile(path.join(root, 'contracts', 'phase5-industrialization.json'), JSON.stringify({ capabilities: ['persistence', 'payments', 'authentication'] }));

    const service = new Phase5Service();
    const result = await service.runIncrementalPhase5({
      projectRoot: root,
      projectId: "test_v2",
      pushDir: path.join(root, "push"),
      options: {}
    });

    assert.equal(result.status, "passed");
    assert.equal(result.stateCommitted, true);
    
    // Check plan has auth files created and payments preserved
    console.log("[DEBUG] PLAN:", JSON.stringify(result.plan, null, 2));
    assert.ok(result.plan.create.includes('src/services/auth/AuthService.ts'));
    assert.ok(result.plan.preserve.includes('src/services/payment/stripePaymentService.ts'));
    assert.equal(result.plan.delete.length, 0);

    const currentJson = JSON.parse(await fsPromises.readFile(path.join(root, '.kirov', 'phase5', 'current.json'), 'utf8'));
    assert.equal(currentJson.lastSuccessfulVersion, 2);
  } finally {
    await fsPromises.rm(root, { recursive: true, force: true });
  }
});

test("Test 3: V2 sans changement", async () => {
  const root = await createTestRoot();
  try {
    await createFixtureV1(root);
    
    const service = new Phase5Service();
    const result = await service.runIncrementalPhase5({
      projectRoot: root,
      projectId: "test_no_change",
      pushDir: path.join(root, "push"),
      options: {}
    });

    assert.equal(result.status, "passed");
    assert.equal(result.stateCommitted, false);
    assert.equal(result.activeModified, false);
    
    assert.equal(result.plan.create.length, 0);
    assert.equal(result.plan.modify.length, 0);
    assert.equal(result.plan.steps ? result.plan.steps.length : 0, 0);
    
    const currentJson = JSON.parse(await fsPromises.readFile(path.join(root, '.kirov', 'phase5', 'current.json'), 'utf8'));
    assert.equal(currentJson.lastSuccessfulVersion, 1);
  } finally {
    await fsPromises.rm(root, { recursive: true, force: true });
  }
});

test("Test 4: drift pertinent", async () => {
  const root = await createTestRoot();
  try {
    await createFixtureV1(root);
    
    // Simulate manual edit (drift)
    await fsPromises.writeFile(path.join(root, 'src/services/payment/stripePaymentService.ts'), 'v1_modified_manually');
    
    // Update contract so idempotence check passes and it actually runs the gates
    await fsPromises.writeFile(path.join(root, 'contracts', 'phase5-industrialization.json'), JSON.stringify({ capabilities: ['persistence', 'payments', 'authentication'] }));
    
    const service = new Phase5Service();
    const result = await service.runIncrementalPhase5({
      projectRoot: root,
      projectId: "test_drift",
      pushDir: path.join(root, "push"),
      options: {}
    });

    assert.equal(result.status, "blocked");
    assert.equal(result.failedGate, "drift");
    assert.equal(result.mutationsStarted, false);
    assert.equal(result.stateCommitted, false);

    // Ensure version is not incremented
    const currentJson = JSON.parse(await fsPromises.readFile(path.join(root, '.kirov', 'phase5', 'current.json'), 'utf8'));
    assert.equal(currentJson.lastSuccessfulVersion, 1);
  } finally {
    await fsPromises.rm(root, { recursive: true, force: true });
  }
});

test("Test 7: collision preserve", async () => {
  const root = await createTestRoot();
  try {
    await createFixtureV1(root);
    
    const service = new Phase5Service();
    
    // Force a conflict by messing with the planBuilder
    const originalBuild = service.planBuilder.build.bind(service.planBuilder);
    service.planBuilder.build = (ctx) => {
      const plan = originalBuild(ctx);
      plan.preserve.push('src/conflict.ts');
      plan.modify.push('src/conflict.ts');
      return plan;
    };
    
    const result = await service.runIncrementalPhase5({
      projectRoot: root,
      projectId: "test_conflict",
      pushDir: path.join(root, "push"),
      options: {}
    });

    assert.equal(result.status, "blocked");
    assert.equal(result.failedGate, "plan_safety");
    assert.equal(result.mutationsStarted, false);
    assert.equal(result.stateCommitted, false);
  } finally {
    await fsPromises.rm(root, { recursive: true, force: true });
  }
});
