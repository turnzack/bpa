"use strict";

const { execFile } = require("child_process");

function terminateProcessTree(child) {
  if (!child || !child.pid) {
    return new Promise(resolve => resolve());
  }

  return new Promise((resolve) => {
    if (process.platform === "win32") {
      execFile(
        "taskkill",
        ["/pid", String(child.pid), "/T", "/F"],
        () => { resolve(); }
      );
      return;
    }

    try {
      process.kill(-child.pid, "SIGTERM");
      resolve();
    } catch {
      try {
        child.kill("SIGTERM");
      } catch (e) {
        // Ignorer si déjà tué
      }
      resolve();
    }
  });
}

module.exports = { terminateProcessTree };
