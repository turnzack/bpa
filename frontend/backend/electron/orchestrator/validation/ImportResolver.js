"use strict";

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

function normalize(value) {
  return String(value || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");
}

function isLocalImport(specifier) {
  return (
    specifier.startsWith("./") ||
    specifier.startsWith("../") ||
    specifier.startsWith("@/")
  );
}

function resolveCandidates({ importerPath, specifier, projectRoot }) {
  const basePath = specifier.startsWith("@/")
    ? path.join(projectRoot, "src", specifier.slice(2))
    : path.resolve(path.dirname(importerPath), specifier);

  const candidates = [];

  for (const extension of SOURCE_EXTENSIONS) {
    candidates.push(`${basePath}${extension}`);
  }

  for (const extension of SOURCE_EXTENSIONS) {
    candidates.push(path.join(basePath, `index${extension}`));
  }

  return candidates;
}

function resolveLocalImport({ importerPath, specifier, projectRoot }) {
  const candidates = resolveCandidates({ importerPath, specifier, projectRoot });

  const resolved = candidates.find(
    (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()
  );

  return {
    resolved: resolved || null,
    candidates
  };
}

function extractImports(sourceFile) {
  const imports = [];

  function visit(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      imports.push({
        specifier: node.moduleSpecifier.text,
        node
      });
    }

    if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      imports.push({
        specifier: node.moduleSpecifier.text,
        node,
        kind: "re-export"
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return imports;
}

function collectSourceFiles(root) {
  const result = [];

  function walk(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (["node_modules", "dist", "build", ".git", ".kirov"].includes(entry.name)) {
        continue;
      }

      const absolute = path.join(current, entry.name);

      if (entry.isDirectory()) {
        walk(absolute);
        continue;
      }

      if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        result.push(absolute);
      }
    }
  }

  walk(root);
  return result;
}

function analyzeLocalImports({ projectRoot }) {
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
      if (!isLocalImport(item.specifier)) {
        continue;
      }

      const result = resolveLocalImport({
        importerPath: filePath,
        specifier: item.specifier,
        projectRoot
      });

      if (!result.resolved) {
        const position = sourceFile.getLineAndCharacterOfPosition(item.node.getStart(sourceFile));

        errors.push({
          code: "MISSING_LOCAL_IMPORT",
          severity: "critical",
          file: normalize(path.relative(projectRoot, filePath)),
          import: item.specifier,
          line: position.line + 1,
          column: position.character + 1,
          candidates: result.candidates.map((candidate) =>
            normalize(path.relative(projectRoot, candidate))
          )
        });
      }
    }
  }

  return {
    status: errors.length === 0 ? "passed" : "failed",
    verified: true,
    mode: "real",
    errors
  };
}

module.exports = {
  analyzeLocalImports,
  resolveLocalImport,
  extractImports,
  collectSourceFiles
};
