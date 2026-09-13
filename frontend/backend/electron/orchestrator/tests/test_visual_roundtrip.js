"use strict";

const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs/promises");
const os = require("node:os");

const { RuntimeSmokeTest } = require("../runtime/RuntimeSmokeTest");

const MOCK_HTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mock App</title>
</head>
<body>
  <div id="root">
    <main data-screen="home">
      <section data-section="hero">
        <h1 data-component="title">Hello World</h1>
        <button data-interaction-id="btn-login">Login</button>
      </section>
      <section data-section="missing-on-purpose" style="display: none;">
        <!-- Sera manquant dans le rendu testé ci-dessous car on simulera son absence dans actual, ou plutôt on va utiliser un vrai rendu. Le RuntimeSmokeTest cherche les attributs ! -->
      </section>
    </main>
  </div>
</body>
</html>
`;

async function run() {
  console.log("Démarrage du test Round-Trip Visuel...");

  // 1. Démarrer un faux serveur Vite
  const server = http.createServer((req, res) => {
    if (req.url === "/home") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(MOCK_HTML);
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const reportDir = path.join(os.tmpdir(), `kirov5-roundtrip-${Date.now()}`);

  // 2. Définir un contrat source PARFAIT (qui correspond au HTML)
  const sourceContracts = {
    "/home": {
      screens: ["home"],
      sections: ["hero", "missing-on-purpose"],
      components: ["title"],
      interactions: ["btn-login"],
      assets: []
    }
  };

  const runner = new RuntimeSmokeTest({
    baseUrl,
    reportDir,
    routes: ["/home"],
    sourceContracts,
    runtimeTimeoutMs: 5000
  });

  try {
    const report = await runner.run();
    
    // Le test DOIT passer car tous les éléments exigés par le contrat sont dans le MOCK_HTML
    if (report.status !== "passed") {
      console.error("Round-Trip Visuel (Positif): échoué", report.results[0].visual);
      process.exitCode = 1;
    } else {
      console.log("Round-Trip Visuel (Positif): passed");
    }

    // 3. Définir un contrat source IMPOSSIBLE (l'IA a oublié un bouton critique)
    const failingRunner = new RuntimeSmokeTest({
      baseUrl,
      reportDir: path.join(reportDir, "fail"),
      routes: ["/home"],
      sourceContracts: {
        "/home": {
          screens: ["home"],
          sections: ["hero"],
          interactions: ["btn-login", "btn-signup-critical"], // Ce bouton n'est PAS dans le HTML
          assets: []
        }
      },
      runtimeTimeoutMs: 5000
    });

    const failingReport = await failingRunner.run();
    
    if (failingReport.status === "failed" && failingReport.results[0].visual.criticalDiffs > 0) {
      console.log("Round-Trip Visuel (Négatif - élément manquant): rejected (passed)");
    } else {
      console.error("Round-Trip Visuel (Négatif): aurait dû échouer car il manque btn-signup-critical");
      process.exitCode = 1;
    }

  } finally {
    server.close();
  }

  if (process.exitCode !== 1) {
    console.log(`\nVisual round-trip: passed (Rapports dans ${reportDir})`);
  } else {
    console.error(`\nVisual round-trip: FAILED`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
