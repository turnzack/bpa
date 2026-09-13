"use strict";

const fs = require("fs");
const path = require("path");
const { collectSourceFiles, extractImports } = require("../validation/ImportResolver");
const ts = require("typescript");

class DependencyGate {
  static async run(projectId, context = {}) {
    const projectRoot = context.projectRoot || path.join(__dirname, "..", "..", "..", "..", "v0saveprojets", projectId);
    
    if (!fs.existsSync(projectRoot)) {
      return { status: "blocked", verified: false, mode: "real", errors: [{ code: "PROJECT_NOT_FOUND", file: "" }] };
    }

    const packagePath = path.join(projectRoot, "package.json");
    if (!fs.existsSync(packagePath)) {
      return { status: "blocked", verified: false, mode: "real", errors: [{ code: "MISSING_PACKAGE_JSON", file: "package.json" }] };
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const declared = new Set([
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.devDependencies || {})
    ]);

    // Built-in modules node
    const builtins = new Set(["fs", "path", "crypto", "child_process", "http", "https", "os", "events", "stream", "util", "url", "assert", "querystring", "buffer", "zlib", "net", "tls", "vm", "dns", "readline", "string_decoder"]);

    const errors = [];
    const files = collectSourceFiles(projectRoot);

    for (const filePath of files) {
      const source = fs.readFileSync(filePath, "utf8");
      const sourceFile = ts.createSourceFile(
        filePath,
        source,
        ts.ScriptTarget.Latest,
        true,
        filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
      );

      const imports = extractImports(sourceFile);

      for (const item of imports) {
        // Ignorer les imports locaux
        if (item.specifier.startsWith("./") || item.specifier.startsWith("../") || item.specifier.startsWith("@/")) {
          continue;
        }

        // Extraire le nom du package (gère les packages scoped comme @types/react)
        let packageName = item.specifier;
        if (packageName.startsWith("@")) {
          const parts = packageName.split("/");
          if (parts.length >= 2) {
            packageName = `${parts[0]}/${parts[1]}`;
          }
        } else {
          packageName = packageName.split("/")[0];
        }

        if (!builtins.has(packageName) && !declared.has(packageName)) {
          errors.push({
            code: "MISSING_DEPENDENCY",
            file: path.relative(projectRoot, filePath).replace(/\\/g, "/"),
            package: packageName
          });
        }
      }
    }

    return {
      status: errors.length === 0 ? "passed" : "failed",
      verified: true,
      mode: "real",
      errors,
      durationMs: 0
    };
  }
}

module.exports = DependencyGate;
