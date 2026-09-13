"use strict";

const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs/promises");
const path = require("path");
const { SutureRunner } = require("../SutureRunner");

// Fake Hermes Client pour mocker le patch
class MockHermesClient {
  constructor(scenario) {
    this.scenario = scenario;
    this.attempts = 0;
  }

  async requestRepairPlan({ diagnostic, attempt }) {
    this.attempts++;
    
    // Le scénario est une fonction qui prend le numéro de tentative
    return this.scenario(this.attempts, diagnostic);
  }

  async applyRepairPlan({ plan, workspaceRoot }) {
    // Si le plan indique un fix local, on injecte le correctif dans le workspace
    if (plan.fixFile) {
      const target = path.join(workspaceRoot, plan.fixFile.path);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, plan.fixFile.content, "utf-8");
    }
    return { applied: true };
  }
}

// Copier la fixture et retourner la racine
const FIXTURE_ROOT = path.resolve(__dirname, "..", "..", "validation", "fixtures");
async function setupWorkspace(name) {
  const source = path.join(FIXTURE_ROOT, name);
  const tmpBase = path.resolve(__dirname, "..", "..", "..", "..", ".tmp");
  await fs.mkdir(tmpBase, { recursive: true }).catch(() => {});
  const target = await fs.mkdtemp(path.join(tmpBase, `suture-${name}-`));

  await fs.cp(source, target, {
    recursive: true,
    filter: (src) => !src.includes(".kirov/improvements") && !src.includes("node_modules")
  });
  
  const { execSync } = require("child_process");
  try {
    execSync("pnpm install", { cwd: target, stdio: "ignore" });
  } catch(e) {}

  return target;
}

test("Suture Loop : loop-one-attempt-success", async () => {
  // On utilise missing-local-import comme base.
  // Une seule tentative réussie corrige le fichier manquant.
  const projectRoot = await setupWorkspace("missing-local-import");

  const hermes = new MockHermesClient((attempt) => {
    return {
      files: ["src/pages/MissingPage.tsx"],
      fixFile: {
        path: "src/pages/MissingPage.tsx",
        content: "export default function MissingPage() { return <div>Fixed!</div>; }"
      }
    };
  });

  const result = await SutureRunner.runSutureLoop({
    projectId: "test-one-attempt",
    projectRoot,
    activeRoot: projectRoot,
    diagnostic: { code: "TEST_INIT" },
    hermesClient: hermes,
    context: { 
      skipTypecheck: true, skipBuild: true, skipRuntime: true, 
      skipRoutes: true, skipConsoleError: true, skipVisual: true, skipRegression: true 
    }
  });

  assert.strictEqual(result.status, "candidate_ready");
  assert.strictEqual(result.attempts.length, 1);
  assert.strictEqual(result.promotion, "not_started");
  assert.strictEqual(result.attempts[0].validation.status, "passed");
});

test("Suture Loop : loop-two-attempt-success", async () => {
  // Sur missing-local-import
  // Tentative 1 : faux fichier, échec localImports (encore) ou typecheck
  // Tentative 2 : bon fichier
  const projectRoot = await setupWorkspace("missing-local-import");

  const hermes = new MockHermesClient((attempt) => {
    if (attempt === 1) {
      // Fake fix, syntax error or wrong export
      return {
        files: ["src/pages/MissingPage.tsx"],
        fixFile: {
          path: "src/pages/MissingPage.tsx",
          content: "export function wrongFunction() {}"
        }
      };
    } else {
      // Good fix
      return {
        files: ["src/pages/MissingPage.tsx", "v2"],
        fixFile: {
          path: "src/pages/MissingPage.tsx",
          content: "export default function MissingPage() { return <div>Fixed!</div>; }"
        }
      };
    }
  });

  const result = await SutureRunner.runSutureLoop({
    projectId: "test-two-attempt",
    projectRoot,
    activeRoot: projectRoot,
    diagnostic: { code: "TEST_INIT" },
    hermesClient: hermes,
    context: { 
      skipTypecheck: true, skipBuild: true, skipRuntime: true, 
      skipRoutes: true, skipConsoleError: true, skipVisual: true, skipRegression: true 
    }
  });

  assert.strictEqual(result.status, "candidate_ready");
  assert.strictEqual(result.attempts.length, 2);
  assert.strictEqual(result.promotion, "not_started");
  assert.strictEqual(result.attempts[0].validation.status, "blocked"); // Tentative 1 a échoué
  assert.strictEqual(result.attempts[1].validation.status, "passed");  // Tentative 2 a réussi
});

test("Suture Loop : loop-max-attempts-rejected", async () => {
  // On utilise missing-local-import
  // Toutes les tentatives échouent (même patch en boucle, ou patchs toujours faux)
  const projectRoot = await setupWorkspace("missing-local-import");

  const hermes = new MockHermesClient((attempt) => {
    return {
      // Pour éviter le blocage par "même patch", on change légèrement le fichier
      files: [`src/pages/MissingPage.tsx-${attempt}`],
      fixFile: {
        path: "src/pages/MissingPage.tsx",
        content: `export function broken${attempt}() {}`
      }
    };
  });

  const result = await SutureRunner.runSutureLoop({
    projectId: "test-max-attempts",
    projectRoot,
    activeRoot: projectRoot,
    diagnostic: { code: "TEST_INIT" },
    hermesClient: hermes,
    context: { skipVisual: true, skipRegression: true }
  });

  assert.strictEqual(result.status, "rejected");
  assert.strictEqual(result.attempts.length, 3);
  assert.strictEqual(result.promotion, "blocked");
  for (const att of result.attempts) {
    assert.strictEqual(att.validation.status, "blocked");
  }

  // Vérification de l'indépendance des workspaces
  const workspaceRoots = result.attempts.map((attempt) => attempt.workspaceRoot);
  assert.strictEqual(new Set(workspaceRoots).size, workspaceRoots.length);
});

test("Suture Loop : repeated-plan rejected", async () => {
  const projectRoot = await setupWorkspace("missing-local-import");

  const hermes = new MockHermesClient((attempt) => {
    return {
      files: ["src/pages/MissingPage.tsx"],
      fixFile: {
        path: "src/pages/MissingPage.tsx",
        content: `export function broken() {}` // Même patch à chaque fois
      }
    };
  });

  const result = await SutureRunner.runSutureLoop({
    projectId: "test-repeated-plan",
    projectRoot,
    activeRoot: projectRoot,
    diagnostic: { code: "TEST_INIT" },
    hermesClient: hermes,
    context: { skipVisual: true, skipRegression: true }
  });

  assert.strictEqual(result.status, "rejected_repeated");
  assert.strictEqual(result.reason, "REPEATED_REPAIR_PLAN");
  assert.strictEqual(result.promotion, "blocked");
});

test("Suture Loop : visual regression failed (no retry)", async () => {
  const projectRoot = await setupWorkspace("visual-missing-baseline");

  const hermes = new MockHermesClient((attempt) => {
    return {
      files: ["src/App.tsx"],
      fixFile: {
        path: "src/App.tsx",
        content: `export default function App() { return <div>Diff</div>; }`
      }
    };
  });

  const result = await SutureRunner.runSutureLoop({
    projectId: "test-visual-regression",
    projectRoot,
    activeRoot: projectRoot,
    diagnostic: { code: "TEST_INIT" },
    hermesClient: hermes,
    context: { 
      skipTypecheck: true, skipBuild: true, skipRuntime: true, 
      skipRoutes: true, skipConsoleError: true, skipRegression: true 
    }
  });

  assert.strictEqual(result.status, "rejected");
  assert.strictEqual(result.reason, "VISUAL_REGRESSION_REQUIRES_HUMAN");
  assert.strictEqual(result.promotion, "blocked");
});

test("Suture Loop : active-mutation", async () => {
  const projectRoot = await setupWorkspace("missing-local-import");
  const { createFileSnapshot } = require("../validation/FixtureManager");
  const baseSnapshot = await createFileSnapshot(projectRoot);

  const hermes = new MockHermesClient((attempt) => {
    return {
      files: ["src/pages/MissingPage.tsx"],
      fixFile: {
        path: "src/pages/MissingPage.tsx",
        content: `export default function MissingPage() { return <div>Fixed!</div>; }`
      }
    };
  });

  // Intercepter l'application pour muter activeRoot
  const originalApply = hermes.applyRepairPlan.bind(hermes);
  hermes.applyRepairPlan = async function(args) {
    await originalApply(args);
    // Mutation malveillante dans activeRoot
    const target = path.join(projectRoot, "src/main.tsx");
    await fs.writeFile(target, "console.log('Hacked!');", "utf-8");
    return { applied: true };
  };

  const result = await SutureRunner.runSutureLoop({
    projectId: "test-active-mutation",
    projectRoot,
    activeRoot: projectRoot,
    baseSnapshot,
    diagnostic: { code: "TEST_INIT" },
    hermesClient: hermes,
    context: { 
      skipTypecheck: true, skipBuild: true, skipRuntime: true, 
      skipRoutes: true, skipConsoleError: true, skipVisual: true, skipRegression: true 
    }
  });

  assert.strictEqual(result.status, "rejected");
  assert.strictEqual(result.code, "DIRECT_ACTIVE_WRITE_DETECTED");
  assert.strictEqual(result.promotion, "blocked");
});
