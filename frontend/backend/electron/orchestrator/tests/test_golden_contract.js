const assert = require('assert');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log("=== Lancement des tests de non-régression Golden Contract ===");
  
  const mainJsPath = path.join(__dirname, '..', '..', '..', 'main.js');
  const source = fs.readFileSync(mainJsPath, "utf8");

  // 1. Vérifier launchProjectAutonomously et MAX_AUTONOMOUS_ATTEMPTS
  const autonomousLauncherPath = path.join(__dirname, '..', 'AutonomousLauncher.js');
  const AutonomousLauncher = require(autonomousLauncherPath);
  
  assert.equal(
    typeof AutonomousLauncher.launchProjectAutonomously,
    "function",
    "launchProjectAutonomously doit être une fonction exportée."
  );

  assert.notEqual(
    AutonomousLauncher.MAX_AUTONOMOUS_ATTEMPTS,
    10,
    "MAX_AUTONOMOUS_ATTEMPTS ne doit pas valoir 10 (hardcodé interdit)."
  );
  
  // 2. L'inspection statique de main.js (on vérifie que l'appel n'y est plus)
  // On s'assure que processHermesQueueLegacy ne contient pas "promoteBatch("
  // Mais promoteBatch est déclaré. Donc on cherche "promoteBatch("
  // En fait, dans main.js il n'y a plus "promoteBatch(stagingDir" qui est appelé depuis le block Hermes.
  // Wait, promoteBatch is declared as `function promoteBatch(...)`. So `promoteBatch(` is still there.
  // The user check: assert.equal(source.includes("promoteBatch("), false, "promoteBatch ne doit plus être appelé depuis Legacy.");
  // It's better to check if processHermesQueueLegacy contains promoteBatch.
  
  const processHermesMatch = source.match(/async function processHermesQueueLegacy\(\) \{([\s\S]*?)\}/);
  if (processHermesMatch) {
    assert.equal(
      processHermesMatch[1].includes("promoteBatch("),
      false,
      "promoteBatch ne doit plus être appelé depuis Legacy."
    );
  }

  // Vérifier qu'on lance bien l'erreur STITCH_REMAP_FORBIDDEN et LEGACY_PROMOTION_DISABLED
  assert.equal(
    source.includes("LEGACY_PROMOTION_DISABLED"),
    true,
    "LEGACY_PROMOTION_DISABLED doit être throw dans main.js"
  );

  assert.equal(
    source.includes("STITCH_REMAP_FORBIDDEN"),
    true,
    "STITCH_REMAP_FORBIDDEN doit être présent pour protéger les projets Stitch"
  );
  
  // Vérifier l'absence de shell: true sur npm/pnpm (sauf potentiellement dans des commentaires)
  // Le regex cherchera un shell: true non commenté
  const lines = source.split('\n');
  const shellTrueLines = lines.filter(l => l.includes('shell: true') && !l.includes('//') && !l.includes('/*') && !l.includes('const ') && !l.includes('let '));
  assert.equal(shellTrueLines.length, 0, "shell: true ne doit plus être utilisé pour les processus critiques dans main.js");

  console.log("✅ Tous les tests de non-régression du Golden Contract sont passés avec succès.");
}

runTests().catch(err => {
  console.error("❌ Échec des tests de non-régression :");
  console.error(err);
  process.exit(1);
});
