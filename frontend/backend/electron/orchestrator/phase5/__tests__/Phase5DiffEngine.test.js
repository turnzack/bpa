const test = require("node:test");
const assert = require("node:assert/strict");

const Phase5DiffEngine = require("../Phase5DiffEngine");

test("Phase5DiffEngine expose computeDiff", () => {
  const engine = new Phase5DiffEngine();
  assert.equal(typeof engine.computeDiff, "function");
});

test("computeDiff détecte une capacité ajoutée", () => {
  const engine = new Phase5DiffEngine();
  const result = engine.computeDiff({
      capabilities: {
        persistence: {
          required: true
        }
      }
    },
    {
      capabilities: {
        persistence: {
          required: true
        },
        authentication: {
          required: true
        }
      }
    });

  assert.deepEqual(result.addedCapabilities, ["authentication"]);
  assert.deepEqual(result.unchangedCapabilities, ["persistence"]);
});
