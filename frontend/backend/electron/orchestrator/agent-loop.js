const hermesClient = require('./hermes-client');
const toolRegistry = require('./tool-registry');
const stateStore = require('./state-store');

const memoryStore = require('./memory-store');
const logStore = require('./log-store');

async function runAgent(jobId) {
  console.log(`[AGENT] Démarrage de la boucle pour le job ${jobId}`);

  for (let iteration = 0; iteration < 50; iteration++) {
    const state = await stateStore.load(jobId);
    
    // Protection basique : si le job n'est plus en cours, on arrête
    if (state.status !== 'running') {
      console.log(`[AGENT] Job ${jobId} arrêté (statut: ${state.status})`);
      break;
    }

    state.iterations = iteration;
    const memory = await memoryStore.search(state.projectId);
    const logs = await logStore.latest(jobId);

    console.log(`[AGENT] Itération ${iteration+1}/50 - Demande de décision à Hermes...`);
    
    try {
      const decision = await hermesClient.decide({
        state,
        memory,
        logs,
        tools: toolRegistry.schemas(),
      });

      console.log(`[AGENT] Décision reçue : ${decision.action || decision.tool}`);

      if (decision.action === 'finish') {
        return stateStore.complete(jobId, decision.reason);
      }

      if (decision.action === 'stop') {
        return stateStore.block(jobId, decision.reason);
      }

      // Exécution de l'outil choisi par Hermes
      if (decision.tool) {
        console.log(`[AGENT] Exécution de l'outil : ${decision.tool}`);
        const result = await toolRegistry.execute(
          decision.tool,
          decision.arguments || {},
        );

        await logStore.save(jobId, result);
        await memoryStore.saveObservation(
          state.projectId,
          result,
        );
      }
    } catch (error) {
      console.error(`[AGENT ERROR] Erreur lors de l'itération ${iteration} :`, error.message);
      return stateStore.block(jobId, `Erreur fatale: ${error.message}`);
    }
  }

  return stateStore.block(
    jobId,
    'Limite de 50 itérations atteinte'
  );
}

module.exports = {
  runAgent
};
