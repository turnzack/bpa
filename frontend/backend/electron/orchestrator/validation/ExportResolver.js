"use strict";

const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { collectSourceFiles, extractImports, resolveLocalImport } = require("./ImportResolver");

function extractExports(sourceFile) {
  const named = new Set();
  let hasDefault = false;

  function visit(node) {
    if (node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      const isDefault = node.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword);
      
      if (!isDefault) {
        if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
          if (node.name) {
            named.add(node.name.text);
          }
        }

        if (ts.isVariableStatement(node)) {
          for (const declaration of node.declarationList.declarations) {
            if (ts.isIdentifier(declaration.name)) {
              named.add(declaration.name.text);
            }
          }
        }
      } else {
        hasDefault = true;
      }
    }

    if (ts.isExportAssignment(node)) {
      hasDefault = true;
    }

    if (ts.isExportDeclaration(node)) {
      for (const element of node.exportClause?.elements || []) {
        named.add(element.name.text);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  const text = sourceFile.getFullText();
  if (/export\s+default\s+/.test(text)) {
    hasDefault = true;
  }

  return {
    named: [...named],
    default: hasDefault
  };
}

function analyzeExports({ projectRoot }) {
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

    // Extraction des imports pour vérifier les clauses d'import par rapport aux exports du fichier cible
    const imports = extractImports(sourceFile);

    function visitImportClauses(node) {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const specifier = node.moduleSpecifier.text;
        
        if (specifier.startsWith("./") || specifier.startsWith("../") || specifier.startsWith("@/")) {
          const importClause = {
            defaultImport: node.importClause?.name ? node.importClause.name.text : null,
            named: []
          };
          
          if (node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
            importClause.named = node.importClause.namedBindings.elements.map(e => e.name.text);
          }

          if (importClause.defaultImport || importClause.named.length > 0) {
            const resolved = resolveLocalImport({ importerPath: filePath, specifier, projectRoot });
            if (resolved.resolved) {
              const targetSource = fs.readFileSync(resolved.resolved, "utf8");
              const targetSourceFile = ts.createSourceFile(
                resolved.resolved, targetSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX
              );
              const targetExports = extractExports(targetSourceFile);

              if (importClause.defaultImport && !targetExports.default) {
                errors.push({
                  code: "DEFAULT_EXPORT_MISSING",
                  file: path.relative(projectRoot, filePath).replace(/\\/g, "/"),
                  targetFile: path.relative(projectRoot, resolved.resolved).replace(/\\/g, "/"),
                  symbol: importClause.defaultImport
                });
              }

              for (const name of importClause.named) {
                if (!targetExports.named.includes(name)) {
                  errors.push({
                    code: "NAMED_EXPORT_MISSING",
                    file: path.relative(projectRoot, filePath).replace(/\\/g, "/"),
                    targetFile: path.relative(projectRoot, resolved.resolved).replace(/\\/g, "/"),
                    symbol: name
                  });
                }
              }
            }
          }
        }
      }
      ts.forEachChild(node, visitImportClauses);
    }

    visitImportClauses(sourceFile);
  }

  return {
    status: errors.length === 0 ? "passed" : "failed",
    verified: true,
    mode: "real",
    errors
  };
}

module.exports = {
  extractExports,
  analyzeExports
};
