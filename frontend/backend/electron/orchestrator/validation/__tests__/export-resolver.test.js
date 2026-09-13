"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const { analyzeExports } = require("../ExportResolver");

test("bloque un export nommé manquant", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "export-resolver-"));

  await fs.mkdir(path.join(root, "src", "pages"), { recursive: true });

  await fs.writeFile(
    path.join(root, "src", "App.tsx"),
    `
      import { ThreadView } from "./pages/ThreadView";
      export default function App() { return null; }
    `,
    "utf8"
  );

  await fs.writeFile(
    path.join(root, "src", "pages", "ThreadView.tsx"),
    `
      export default function ThreadView() { return null; }
    `,
    "utf8"
  );

  const result = analyzeExports({ projectRoot: root });

  assert.equal(result.status, "failed");
  assert.equal(result.verified, true);

  assert.ok(
    result.errors.some(
      (error) =>
        error.code === "NAMED_EXPORT_MISSING" &&
        error.symbol === "ThreadView" &&
        error.targetFile.includes("ThreadView.tsx")
    )
  );
});
