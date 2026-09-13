const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const DriftDetector = require("../DriftDetector");

async function hashFile(filePath) {
  const buffer = await fs.readFile(filePath);
  return `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
}

async function createTempProject() {
  const os = require("node:os");
  return fs.mkdtemp(path.join(os.tmpdir(), "drift-test-"));
}

test("détecte une modification manuelle", async () => {
  const root = await createTempProject();
  try {
    const file = path.join(root, "src/services/payment.ts");
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, "original", "utf8");

    const oldHash = await hashFile(file);

    const manifest = {
      files: [
        {
          path: "src/services/payment.ts",
          sha256: oldHash
        }
      ]
    };

    await fs.writeFile(file, "modified", "utf8");

    const detector = new DriftDetector();
    const result = await detector.detectDrift(root, manifest, {
      preserve: [],
      modify: [],
      delete: []
    });

    assert.equal(result.status, "failed");
    assert.equal(result.conflicts[0].code, "DRIFT_DETECTED");
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
