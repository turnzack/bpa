"use strict";

const allowedModes = new Set([
  "strict-ui",
  "ui-update"
]);

function validateDesignHtml(html) {
  if (typeof html !== "string" || html.trim().length === 0) {
    throw new Error("Design HTML vide.");
  }

  if (html.length > 500000) {
    throw Object.assign(new Error("Design HTML trop volumineux."), { code: "DESIGN_HTML_TOO_LARGE" });
  }

  // Vérifications basiques de sécurité XSS
  if (
    /<script\b/i.test(html) ||
    /\bon(click|load|error)\s*=/i.test(html) ||
    /javascript:/i.test(html)
  ) {
    throw Object.assign(new Error("HTML design non sécurisé."), { code: "DESIGN_HTML_UNSAFE" });
  }

  return true;
}

function validatePushRequest(body) {
  if (typeof body?.projectId !== "string") {
    throw new Error("projectId requis");
  }

  if (body.targetFile !== "ALL_PAGES" && !body.targetFile.match(/^src\/.+\.(tsx|jsx|ts|js)$/)) {
    throw new Error("targetFile invalide : doit être un chemin src/*.tsx ou 'ALL_PAGES'");
  }

  if (!allowedModes.has(body.mode)) {
    throw new Error("Mode UI invalide");
  }

  if (body.mode === "strict-ui" && !body.baseVersionId) {
    throw new Error("baseVersionId requis");
  }

  if (typeof body?.zipFileName !== "string" || body.zipFileName.trim() === "" || !body.zipFileName.endsWith(".zip")) {
    throw new Error("zipFileName requis et doit être un fichier .zip");
  }

  // Optionnel: On peut garder une trace si l'utilisateur passe du HTML direct
  if (body.newDesignHtml) {
    validateDesignHtml(body.newDesignHtml);
  }

  return body;
}

module.exports = {
  validatePushRequest,
  validateDesignHtml,
  allowedModes
};
