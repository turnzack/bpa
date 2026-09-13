"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const { analyzeLocalImports } = require("../ImportResolver");

test("bloque les imports locaux manquants", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "missing-local-import-"));

  await fs.mkdir(path.join(root, "src", "pages"), { recursive: true });

  await fs.writeFile(
    path.join(root, "src", "App.tsx"),
    `
      import { FeedPage } from "./pages/FeedPage";
      import { ThreadDetailPage } from "./pages/ThreadDetailPage";
      import { SavedItemsPage } from "./pages/SavedItemsPage";

      export default function App() {
        return null;
      }
    `,
    "utf8"
  );

  await fs.writeFile(
    path.join(root, "src", "pages", "FeedPage.tsx"),
    `
      export function FeedPage() {
        return null;
      }
    `,
    "utf8"
  );

  const result = analyzeLocalImports({ projectRoot: root });

  assert.equal(result.status, "failed");
  assert.equal(result.verified, true);

  assert.ok(
    result.errors.some(
      (error) =>
        error.code === "MISSING_LOCAL_IMPORT" &&
        error.import === "./pages/ThreadDetailPage"
    )
  );

  assert.ok(
    result.errors.some(
      (error) =>
        error.code === "MISSING_LOCAL_IMPORT" &&
        error.import === "./pages/SavedItemsPage"
    )
  );
});
