"use strict";

const fs = require("fs");
const path = require("path");

function exists(root, fileOrFolder) {
  return fs.existsSync(path.join(root, fileOrFolder));
}

function readPackageJson(projectRoot) {
  try {
    const content = fs.readFileSync(path.join(projectRoot, "package.json"), "utf8");
    return JSON.parse(content);
  } catch (e) {
    return {};
  }
}

function detectProjectStack(projectRoot) {
  const packageJson = readPackageJson(projectRoot);

  const dependencies = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {})
  };

  const hasVite =
    Boolean(dependencies.vite) ||
    exists(projectRoot, "vite.config.ts") ||
    exists(projectRoot, "vite.config.js");

  const hasReact =
    Boolean(dependencies.react) ||
    exists(projectRoot, "src");

  const hasNext =
    Boolean(dependencies.next) ||
    exists(projectRoot, "next.config.js") ||
    exists(projectRoot, "next.config.ts");

  const hasExpo = Boolean(dependencies.expo);

  if (hasExpo) {
    return {
      framework: "expo",
      bundler: "metro",
      runtime: "mobile",
      language: "typescript"
    };
  }

  if (hasNext) {
    return {
      framework: "next",
      bundler: "webpack", // Defaulting to webpack for generic Next.js
      runtime: "browser",
      language: "typescript"
    };
  }

  if (hasVite && hasReact) {
    return {
      framework: "react",
      bundler: "vite",
      runtime: "browser",
      language: "typescript"
    };
  }

  if (exists(projectRoot, "index.html") && !hasReact) {
    return {
      framework: "vanilla",
      bundler: "none",
      runtime: "browser",
      language: "javascript"
    };
  }

  return {
    framework: "unknown",
    bundler: "unknown",
    runtime: "unknown",
    language: "unknown"
  };
}

module.exports = { detectProjectStack };
