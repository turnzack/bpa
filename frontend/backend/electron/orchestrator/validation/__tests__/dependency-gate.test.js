"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const DependencyGate = require("../../gates/DependencyGate");

test("DependencyGate bloque un package manquant", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "dependency-gate-"));

  await fs.mkdir(path.join(root, "src"), { recursive: true });

  await fs.writeFile(
    path.join(root, "package.json"),
    JSON.stringify({ dependencies: {} }),
    "utf8"
  );

  await fs.writeFile(
    path.join(root, "src", "App.tsx"),
    `import { z } from "zod";\nexport default function App() { return null; }`,
    "utf8"
  );

  const result = await DependencyGate.run("test", { projectRoot: root });

  assert.equal(result.status, "failed");
  assert.equal(result.verified, true);
  assert.ok(
    result.errors.some(
      (err) => err.code === "MISSING_DEPENDENCY" && err.package === "zod"
    )
  );
});

test("DependencyGate passe si le package est déclaré", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "dependency-gate-ok-"));
  await fs.mkdir(path.join(root, "src"), { recursive: true });

  await fs.writeFile(
    path.join(root, "package.json"),
    JSON.stringify({ dependencies: { zod: "^3.0.0" } }),
    "utf8"
  );

  await fs.writeFile(
    path.join(root, "src", "App.tsx"),
    `import { z } from "zod";\nexport default function App() { return null; }`,
    "utf8"
  );

  const result = await DependencyGate.run("test", { projectRoot: root });
  assert.equal(result.status, "passed");
});

