"use strict";

class UiPushReport {
  generateReport(pushId, gatesResults) {
    return {
      pushId,
      timestamp: new Date().toISOString(),
      gates: gatesResults,
      status: Object.values(gatesResults).every(v => v === 'passed') ? 'passed' : 'failed'
    };
  }
}

module.exports = new UiPushReport();
