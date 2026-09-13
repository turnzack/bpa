'use strict';

/**
 * ImprovementStateMachine.js
 * Machine d'états stricte — Phase 3
 * Aucune transition directe interdite : requested→promoted, patching_staging→promoted, repair_required→promoted
 */

const IMPROVEMENT_STATES = [
  'requested', 'analyzing', 'plan_ready', 'waiting_approval',
  'design_generating', 'design_validated', 'logic_generating',
  'patching_staging', 'static_validated', 'build_validated',
  'runtime_validated', 'regression_validated', 'promotable',
  'promoted', 'repair_required', 'rejected', 'rolled_back', 'cancelled'
];

// Transitions autorisées
const ALLOWED_TRANSITIONS = {
  requested:             ['analyzing', 'cancelled'],
  analyzing:             ['plan_ready', 'repair_required', 'cancelled'],
  plan_ready:            ['waiting_approval', 'design_generating', 'patching_staging', 'cancelled'],
  waiting_approval:      ['design_generating', 'patching_staging', 'rejected', 'cancelled'],
  design_generating:     ['design_validated', 'repair_required'],
  design_validated:      ['logic_generating', 'patching_staging'],
  logic_generating:      ['patching_staging', 'repair_required'],
  patching_staging:      ['static_validated', 'repair_required'],  // ← PAS promoted ici
  static_validated:      ['build_validated', 'repair_required'],
  build_validated:       ['runtime_validated', 'repair_required'],
  runtime_validated:     ['regression_validated', 'repair_required'],
  regression_validated:  ['promotable', 'repair_required'],
  promotable:            ['promoted', 'rolled_back'],
  promoted:              [],  // État terminal
  repair_required:       ['analyzing', 'rejected'],  // ← PAS promoted ici
  rejected:              [],  // État terminal
  rolled_back:           [],  // État terminal
  cancelled:             [],  // État terminal
};

class ImprovementStateMachine {
  constructor(improvementId) {
    this.improvementId = improvementId;
    this.state = 'requested';
    this.history = [{ state: 'requested', at: new Date().toISOString() }];
    this.repairCount = 0;
  }

  transition(nextState) {
    const allowed = ALLOWED_TRANSITIONS[this.state] || [];
    if (!allowed.includes(nextState)) {
      throw new Error(`[StateMachine] Transition interdite : ${this.state} → ${nextState} (amélioration: ${this.improvementId})`);
    }
    if (nextState === 'repair_required') {
      this.repairCount++;
      if (this.repairCount > 3) {
        console.warn(`[StateMachine] ⚠️ 3 réparations dépassées → rejected`);
        this.state = 'rejected';
        this.history.push({ state: 'rejected', at: new Date().toISOString(), reason: 'max_repairs_exceeded' });
        return;
      }
    }
    this.state = nextState;
    this.history.push({ state: nextState, at: new Date().toISOString() });
    console.log(`[StateMachine] ${this.improvementId}: → ${nextState}`);
  }

  getState() { return this.state; }
  getHistory() { return this.history; }
  getRepairCount() { return this.repairCount; }
  isTerminal() { return ['promoted', 'rejected', 'rolled_back', 'cancelled'].includes(this.state); }
}

module.exports = { ImprovementStateMachine, IMPROVEMENT_STATES, ALLOWED_TRANSITIONS };
