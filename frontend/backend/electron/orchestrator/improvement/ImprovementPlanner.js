'use strict';
/**
 * ImprovementPlanner.js — Phase 3
 * Analyse la requête et génère un plan d'action structuré
 */

const IMPROVEMENT_TYPES = ['page', 'animation', 'responsive', 'accessibility', 'refactoring', 'bugfix', 'optimization', 'pack', 'logic', 'store', 'api', 'free'];

async function plan({ projectId, request, packs, improvementTypes, strategy, targetFiles, targetRoutes, snapshot }) {
  console.log(`[PLANNER] 🗺️ Planification pour ${projectId}: "${request.substring(0, 80)}..."`);

  const detectedTypes = improvementTypes.length > 0
    ? improvementTypes
    : _detectTypes(request);

  const tasks = _buildTaskList(detectedTypes, packs, targetFiles, targetRoutes, request);

  const plan = {
    planId: `plan-${Date.now()}`,
    projectId,
    request,
    strategy,
    detectedTypes,
    packs,
    tasks,
    targetFiles: targetFiles.length > 0 ? targetFiles : _inferTargetFiles(detectedTypes, snapshot),
    targetRoutes,
    estimatedComplexity: _estimateComplexity(tasks),
    createdAt: new Date().toISOString(),
  };

  console.log(`[PLANNER] ✅ Plan généré : ${tasks.length} tâches, complexité: ${plan.estimatedComplexity}`);
  return plan;
}

function _detectTypes(request) {
  const lower = request.toLowerCase();
  return IMPROVEMENT_TYPES.filter(t => {
    const keywords = {
      page: ['page', 'écran', 'route', 'vue'],
      animation: ['animation', 'transition', 'motion', 'effet'],
      responsive: ['responsive', 'mobile', 'tablette', 'breakpoint'],
      accessibility: ['accessibilité', 'aria', 'a11y', 'contraste'],
      refactoring: ['refactoring', 'refactor', 'nettoyer', 'restructurer'],
      bugfix: ['bug', 'erreur', 'correction', 'fix'],
      optimization: ['optimis', 'performance', 'speed', 'perf'],
      pack: ['pack', 'template', 'module'],
      logic: ['logique', 'logic', 'backend', 'service'],
      store: ['store', 'état', 'state', 'zustand', 'redux'],
      api: ['api', 'endpoint', 'fetch', 'http'],
      free: ['ajoute', 'améliore', 'change'],
    };
    return (keywords[t] || []).some(kw => lower.includes(kw));
  });
}

function _buildTaskList(types, packs, targetFiles, targetRoutes, request) {
  const tasks = [
    { id: 'snapshot', type: 'infrastructure', name: 'Snapshot version active', dependsOn: [] },
    { id: 'analyze-architecture', type: 'analysis', name: 'Analyse AST architecture', dependsOn: ['snapshot'] },
    { id: 'analyze-visual', type: 'analysis', name: 'Analyse visuelle', dependsOn: ['snapshot'] },
  ];

  if (types.includes('page') || types.includes('animation')) {
    tasks.push({ id: 'stitch-extension', type: 'design', name: 'Génération design Stitch', dependsOn: ['analyze-visual'] });
    tasks.push({ id: 'convert-new-pages', type: 'design', name: 'Conversion HTML→TSX', dependsOn: ['stitch-extension'] });
  }

  tasks.push({ id: 'generate-patches', type: 'patch', name: 'Génération des patches', dependsOn: ['analyze-architecture'] });
  tasks.push({ id: 'apply-patches', type: 'patch', name: 'Application des patches sur staging', dependsOn: ['generate-patches', ...(types.includes('page') ? ['convert-new-pages'] : [])] });
  tasks.push({ id: 'static-validation', type: 'gate', name: 'Validation statique (AST/Import)', dependsOn: ['apply-patches'] });
  tasks.push({ id: 'typecheck', type: 'gate', name: 'TypeScript check', dependsOn: ['static-validation'] });
  tasks.push({ id: 'build', type: 'gate', name: 'Build production', dependsOn: ['typecheck'] });
  tasks.push({ id: 'runtime', type: 'gate', name: 'Runtime staging', dependsOn: ['build'] });
  tasks.push({ id: 'visual', type: 'gate', name: 'Visual round-trip (Playwright)', dependsOn: ['runtime'] });
  tasks.push({ id: 'regression', type: 'gate', name: 'Régression', dependsOn: ['visual'] });
  tasks.push({ id: 'promotion', type: 'promotion', name: 'Promotion atomique CURRENT', dependsOn: ['regression'] });

  return tasks;
}

function _inferTargetFiles(types, snapshot) {
  const files = Object.keys(snapshot.files || {});
  if (types.includes('store')) return files.filter(f => f.includes('store'));
  if (types.includes('api'))   return files.filter(f => f.includes('service') || f.includes('api'));
  return files.filter(f => f.endsWith('.tsx') || f.endsWith('.ts')).slice(0, 5);
}

function _estimateComplexity(tasks) {
  if (tasks.length <= 8)  return 'low';
  if (tasks.length <= 12) return 'medium';
  return 'high';
}

module.exports = { plan };
