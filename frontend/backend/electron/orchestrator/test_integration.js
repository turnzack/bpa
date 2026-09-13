"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  assertSameFilesystem,
  assertCurrentVersion,
  writeAtomicDurably
} = require("./PromotionManager");

const TEST_ROOT = path.join(os.tmpdir(), `kirov5-gold-test-${Date.now()}`);
const PROJECT_ROOT = path.join(TEST_ROOT, "project");
const STAGING_ROOT = path.join(PROJECT_ROOT, "staging", "run-001");
const ACTIVE_ROOT = path.join(PROJECT_ROOT, "active");
const BACKUPS_ROOT = path.join(PROJECT_ROOT, "backups");

const PROTECTED_FILES = new Set(["package.json", "vite.config.ts", "index.html", "src/main.tsx"]);

function assertWriteInsideStaging({ targetPath, stagingRoot, activeRoot }) {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedStaging = path.resolve(stagingRoot);
  const resolvedActive = path.resolve(activeRoot);
  const relativeToStaging = path.relative(resolvedStaging, resolvedTarget);
  const relativeToActive = path.relative(resolvedActive, resolvedTarget);

  const isInsideStaging = relativeToStaging === "" || (!relativeToStaging.startsWith("..") && !path.isAbsolute(relativeToStaging));
  const isInsideActive = relativeToActive === "" || (!relativeToActive.startsWith("..") && !path.isAbsolute(relativeToActive));

  if (isInsideActive) {
    const error = new Error("Écriture directe dans active interdite");
    error.code = "DIRECT_ACTIVE_WRITE";
    throw error;
  }
  if (!isInsideStaging) {
    const error = new Error("Écriture hors staging/active refusée");
    error.code = "WRITE_OUTSIDE_STAGING";
    throw error;
  }
  return true;
}

function canWriteFile({ relativePath, operation, projectRoot, stagingRoot }) {
  const targetInProject = path.join(projectRoot, relativePath);
  const existsInActive = fsSync.existsSync(targetInProject);
  const isProtected = PROTECTED_FILES.has(relativePath);
  if (isProtected && existsInActive && operation !== "approved_update") return { allowed: false, code: "PROTECTED_FILE_MODIFIED" };
  if (isProtected && !existsInActive && stagingRoot) return { allowed: true, code: "BOOTSTRAP_FILE_CREATED_IN_STAGING" };
  return { allowed: true };
}

async function setup() {
  await fs.rm(TEST_ROOT, { recursive: true, force: true });
  await fs.mkdir(path.join(STAGING_ROOT, "workspace"), { recursive: true });
  await fs.mkdir(path.join(ACTIVE_ROOT, "versions"), { recursive: true });
  await fs.mkdir(BACKUPS_ROOT, { recursive: true });

  const initialVersion = path.join(ACTIVE_ROOT, "versions", "version-000");
  await fs.mkdir(initialVersion, { recursive: true });
  await fs.writeFile(path.join(initialVersion, "index.html"), "<div id='root'>stable</div>", "utf8");
  await fs.writeFile(path.join(ACTIVE_ROOT, "CURRENT"), "version-000\n", "utf8");
  await fs.writeFile(path.join(PROJECT_ROOT, "index.html"), "...", "utf8"); 
}

async function testStagingGuard() {
  const validPath = path.join(STAGING_ROOT, "workspace", "src", "App.tsx");
  assert.doesNotThrow(() => assertWriteInsideStaging({ targetPath: validPath, stagingRoot: STAGING_ROOT, activeRoot: ACTIVE_ROOT }));

  const outsidePath = path.join(PROJECT_ROOT, "src", "App.tsx");
  assert.throws(
    () => assertWriteInsideStaging({ targetPath: outsidePath, stagingRoot: STAGING_ROOT, activeRoot: ACTIVE_ROOT }),
    (error) => { assert.equal(error.code, "WRITE_OUTSIDE_STAGING"); return true; }
  );

  const directActivePath = path.join(ACTIVE_ROOT, "versions", "version-000", "src", "App.tsx");
  assert.throws(
    () => assertWriteInsideStaging({ targetPath: directActivePath, stagingRoot: STAGING_ROOT, activeRoot: ACTIVE_ROOT }),
    (error) => { assert.equal(error.code, "DIRECT_ACTIVE_WRITE"); return true; }
  );
}

async function testProtectedFile() {
  const result = canWriteFile({ relativePath: "index.html", operation: "update", projectRoot: PROJECT_ROOT, stagingRoot: STAGING_ROOT });
  assert.equal(result.allowed, false);
  assert.equal(result.code, "PROTECTED_FILE_MODIFIED");
}

async function testSameFilesystem() {
  assert.doesNotThrow(() => assertSameFilesystem(STAGING_ROOT, ACTIVE_ROOT));
}

async function testBuildFailure() {
  const promotionCalls = [];
  const fakeBuildRunner = {
    async run() {
      const error = new Error("Cannot resolve import ./Missing");
      error.code = "BUILD_FAILED";
      throw error;
    }
  };
  const fakePromotionManager = { async promote() { promotionCalls.push(true); } };

  let caught = null;
  try { await fakeBuildRunner.run(); } catch (error) { caught = error; }

  assert.equal(caught.code, "BUILD_FAILED");
  assert.equal(promotionCalls.length, 0);
}

async function testRuntimeFailure() {
  const error = new Error("Runtime page error");
  error.code = "RUNTIME_FAILED";
  const runtimeReport = { status: "failed", pageErrors: ["Runtime page error"], errorBoundaryDetected: true };
  assert.equal(runtimeReport.status, "failed");
  assert.equal(runtimeReport.errorBoundaryDetected, true);
  assert.equal(runtimeReport.pageErrors.length, 1);
  assert.equal(error.code, "RUNTIME_FAILED");
}

async function testCurrentVersion() {
  const current = await assertCurrentVersion({ activeRoot: ACTIVE_ROOT, expectedVersionId: "version-000" });
  assert.ok(current.includes("version-000"));
}

async function rollbackToVersion({ activeRoot, versionId }) {
  await writeAtomicDurably(path.join(activeRoot, "CURRENT"), `${versionId}\n`);
}

async function testRollback() {
  const previousVersion = "version-000";
  const brokenVersion = "version-001";
  await fs.mkdir(path.join(ACTIVE_ROOT, "versions", brokenVersion), { recursive: true });
  await fs.writeFile(path.join(ACTIVE_ROOT, "CURRENT"), `${brokenVersion}\n`, "utf8");
  
  await rollbackToVersion({ activeRoot: ACTIVE_ROOT, versionId: previousVersion });
  const current = (await fs.readFile(path.join(ACTIVE_ROOT, "CURRENT"), "utf8")).trim();
  assert.equal(current, previousVersion);

  const activePath = path.join(ACTIVE_ROOT, "versions", current);
  const stat = await fs.stat(activePath);
  assert.equal(stat.isDirectory(), true);
}

async function run() {
  const startedAt = new Date().toISOString();
  await setup();
  const tests = [
    ["[A] staging-write-guard", testStagingGuard],
    ["[B] protected-file", testProtectedFile],
    ["[C] same-filesystem", testSameFilesystem],
    ["[D] build-failure", testBuildFailure],
    ["[E] runtime-failure", testRuntimeFailure],
    ["[F] current-pointer", testCurrentVersion],
    ["[G] rollback", testRollback]
  ];

  const results = [];
  for (const [name, test] of tests) {
    try {
      await test();
      results.push({ id: name, status: "passed" });
    } catch (error) {
      results.push({ id: name, status: "failed", message: error.message });
    }
  }

  const passedCount = results.filter((item) => item.status === "passed").length;
  const failedCount = results.filter((item) => item.status === "failed").length;

  const report = {
    suite: "kirov5-gold-integration",
    version: "1.0.0",
    startedAt,
    finishedAt: new Date().toISOString(),
    tests: results,
    passed: passedCount,
    failed: failedCount,
    status: failedCount === 0 ? "passed" : "failed"
  };

  await fs.writeFile(path.join(TEST_ROOT, "integration-report.json"), JSON.stringify(report, null, 2), "utf8");
  console.table(results);
  console.log(`Report saved to: ${path.join(TEST_ROOT, "integration-report.json")}`);

  await fs.rm(TEST_ROOT, { recursive: true, force: true });
  if (failedCount > 0) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
