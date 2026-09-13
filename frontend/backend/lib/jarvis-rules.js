/* Jarvis Rules — Constitution G50+ Diamond Code Validation Engine
   Exported as self.JarvisRules for Chrome extension service worker */

(function () {
  'use strict';

  /* ── Rule definitions ── */

  var ALL_RULES = [
    {
      id: 'R1',
      label: 'index.html lowercase + id="root"',
      description: 'index.html must be lowercase filename and contain id="root" on the mount element.',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'R2',
      label: 'vite.config.ts has react() plugin',
      description: 'vite.config.ts must include plugins:[react()] in its configuration.',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'R3',
      label: 'package.json has type:"module"',
      description: 'package.json must declare "type": "module" for ESM support.',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'R4',
      label: 'HashRouter required, BrowserRouter forbidden',
      description: 'Must use HashRouter for Chrome extension compatibility. BrowserRouter is forbidden.',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'R5',
      label: 'tsconfig.json has jsx:"react-jsx"',
      description: 'tsconfig.json must set "jsx": "react-jsx" for the new JSX transform.',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'X1',
      label: 'No package.js / tsconfig.js (wrong extension)',
      description: 'Files must use correct extensions: package.json (not .js), tsconfig.json (not .js).',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'X2',
      label: 'No App.ts / main.js (wrong extension)',
      description: 'React files must use .tsx extension: App.tsx, main.tsx. Not .ts or .js.',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'X3',
      label: 'No .vue files in React project',
      description: 'Vue single-file components (.vue) are forbidden in React projects.',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'X4',
      label: 'No .txt source files',
      description: 'Source code files must never use .txt extension. Use proper language extensions.',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'X6',
      label: 'All JSX tags must be closed',
      description: 'Every JSX opening tag must have a corresponding closing tag or self-close (e.g. <br />).',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'X7',
      label: 'No language prefix in file content',
      description: 'File content must not start with markdown code fences like "```typescript\n" or "```javascript\n".',
      severity: 'error',
      version: 'G50+',
    },
    {
      id: 'X8',
      label: 'No explicit import React from react',
      description: 'With jsx:"react-jsx", React is auto-imported. Explicit "import React from react" is forbidden.',
      severity: 'warning',
      version: 'G50+',
    },
    {
      id: 'X9',
      label: 'No console.log in production',
      description: 'Remove all console.log statements from production code.',
      severity: 'warning',
      version: 'G50+',
    },
    {
      id: 'X10',
      label: 'No conversational text in code output',
      description: 'Code output must not contain conversational text like "Here is the code" or "I have created".',
      severity: 'warning',
      version: 'G50+',
    },
    {
      id: 'X11',
      label: 'No unimplemented TODOs',
      description: 'All TODO comments must have an associated implementation or be removed.',
      severity: 'warning',
      version: 'G50+',
    },
    {
      id: 'X12',
      label: 'No unused dependencies in package.json',
      description: 'All dependencies listed in package.json must be imported/used in the codebase.',
      severity: 'warning',
      version: 'G50+',
    },
    {
      id: 'S1',
      label: 'Silence Absolu — codegen JSON only',
      description: 'Code generation must output only valid JSON. No conversational text, explanations, or markdown wrappers.',
      severity: 'error',
      version: 'G50+',
    },
  ];

  /* Version → rule sets */
  var VERSION_RULES = {
    'G50+': ALL_RULES.map(function (r) { return r.id; }),
    'G50':  ['R1','R2','R3','R4','R5','X1','X2','X3','X4','X6','X7','X8','X9','X10','S1'],
    'G40':  ['R1','R2','R3','R4','R5','X1','X2','X3','X4','X6'],
  };

  /* ── Helper utilities ── */

  function findFile(files, name) {
    for (var i = 0; i < files.length; i++) {
      var p = files[i].path.replace(/\\/g, '/');
      var n = p.split('/').pop().toLowerCase();
      if (n === name.toLowerCase()) return files[i];
    }
    return null;
  }

  function findFileByExt(files, ext) {
    return files.filter(function (f) {
      return f.path.toLowerCase().endsWith('.' + ext);
    });
  }

  function getLines(content) {
    return content.split('\n');
  }

  function issue(ruleId, severity, message, file, line) {
    return {
      ruleId: ruleId,
      severity: severity,
      message: message,
      file: file || null,
      line: line || null,
    };
  }

  function findRule(id) {
    for (var i = 0; i < ALL_RULES.length; i++) {
      if (ALL_RULES[i].id === id) return ALL_RULES[i];
    }
    return null;
  }

  /* ── Individual rule checks ── */

  function checkR1(files) {
    var issues = [];
    // Check filename case
    for (var i = 0; i < files.length; i++) {
      var p = files[i].path.replace(/\\/g, '/');
      var parts = p.split('/');
      var fname = parts[parts.length - 1];
      if (fname.toLowerCase() === 'index.html' && fname !== 'index.html') {
        issues.push(issue('R1', 'error', 'index.html filename must be lowercase. Found: ' + fname, files[i].path));
      }
    }
    // Check id="root"
    var indexFile = findFile(files, 'index.html');
    if (indexFile) {
      if (indexFile.content.indexOf('id="root"') === -1 && indexFile.content.indexOf("id='root'") === -1) {
        issues.push(issue('R1', 'error', 'index.html must contain a root element with id="root"', indexFile.path));
      }
    }
    return issues;
  }

  function checkR2(files) {
    var issues = [];
    var viteFile = findFile(files, 'vite.config.ts');
    if (!viteFile) {
      // Also check vite.config.js
      viteFile = findFile(files, 'vite.config.js');
    }
    if (viteFile) {
      if (viteFile.content.indexOf('react()') === -1 && viteFile.content.indexOf('React()') === -1) {
        issues.push(issue('R2', 'error', 'vite.config must include plugins:[react()]', viteFile.path));
      }
    }
    return issues;
  }

  function checkR3(files) {
    var issues = [];
    var pkgFile = findFile(files, 'package.json');
    if (pkgFile) {
      if (pkgFile.content.indexOf('"type"') !== -1 && pkgFile.content.indexOf('"module"') === -1) {
        issues.push(issue('R3', 'error', 'package.json must have "type": "module"', pkgFile.path));
      } else if (pkgFile.content.indexOf('"type"') === -1) {
        issues.push(issue('R3', 'error', 'package.json is missing "type": "module"', pkgFile.path));
      }
    }
    return issues;
  }

  function checkR4(files) {
    var issues = [];
    var tsxFiles = findFileByExt(files, 'tsx');
    var jsFiles = findFileByExt(files, 'jsx');
    var allReact = tsxFiles.concat(jsFiles);
    for (var i = 0; i < allReact.length; i++) {
      var content = allReact[i].content;
      if (content.indexOf('BrowserRouter') !== -1) {
        issues.push(issue('R4', 'error', 'BrowserRouter is forbidden. Use HashRouter instead.', allReact[i].path));
      }
    }
    return issues;
  }

  function checkR5(files) {
    var issues = [];
    var tsconfig = findFile(files, 'tsconfig.json');
    if (tsconfig) {
      if (tsconfig.content.indexOf('"react-jsx"') === -1) {
        issues.push(issue('R5', 'error', 'tsconfig.json must set "jsx": "react-jsx"', tsconfig.path));
      }
    }
    return issues;
  }

  function checkX1(files) {
    var issues = [];
    var badNames = ['package.js', 'tsconfig.js'];
    for (var i = 0; i < files.length; i++) {
      var p = files[i].path.replace(/\\/g, '/');
      var fname = p.split('/').pop().toLowerCase();
      for (var j = 0; j < badNames.length; j++) {
        if (fname === badNames[j]) {
          issues.push(issue('X1', 'error', 'Wrong file extension: ' + fname + ' should be ' + badNames[j].replace('.js', '.json'), files[i].path));
        }
      }
    }
    return issues;
  }

  function checkX2(files) {
    var issues = [];
    var badNames = ['app.ts', 'main.js'];
    for (var i = 0; i < files.length; i++) {
      var p = files[i].path.replace(/\\/g, '/');
      var fname = p.split('/').pop().toLowerCase();
      for (var j = 0; j < badNames.length; j++) {
        if (fname === badNames[j]) {
          var correct = badNames[j] === 'app.ts' ? 'App.tsx' : 'main.tsx';
          issues.push(issue('X2', 'error', 'Wrong extension: ' + fname + ' should be ' + correct, files[i].path));
        }
      }
    }
    return issues;
  }

  function checkX3(files) {
    var issues = [];
    var vueFiles = findFileByExt(files, 'vue');
    for (var i = 0; i < vueFiles.length; i++) {
      issues.push(issue('X3', 'error', 'Vue file found in React project: ' + vueFiles[i].path, vueFiles[i].path));
    }
    return issues;
  }

  function checkX4(files) {
    var issues = [];
    var txtFiles = findFileByExt(files, 'txt');
    for (var i = 0; i < txtFiles.length; i++) {
      issues.push(issue('X4', 'error', 'Source file has .txt extension: ' + txtFiles[i].path + '. Use proper language extension.', txtFiles[i].path));
    }
    return issues;
  }

  function checkX6(files) {
    var issues = [];
    var tsxFiles = findFileByExt(files, 'tsx');
    var jsxFiles = findFileByExt(files, 'jsx');
    var allJsx = tsxFiles.concat(jsxFiles);
    // Regex to find unclosed JSX tags (heuristic)
    var selfClosing = /^\s*<(br|hr|img|input|meta|link|area|base|col|embed|source|track|wbr)[\s>\/]/i;
    var htmlTag = /<(\w[\w-]*)[^>]*(?<!\/)>/g;
    var closingTag = /<\/([\w-]+)>/g;
    for (var i = 0; i < allJsx.length; i++) {
      var content = allJsx[i].content;
      // Simple heuristic: find lines with < that look like JSX (not strings, not comments)
      var lines = getLines(content);
      for (var ln = 0; ln < lines.length; ln++) {
        var line = lines[ln];
        // Skip import lines and comment lines
        if (line.trim().indexOf('//') === 0) continue;
        if (line.trim().indexOf('import ') === 0) continue;
        if (line.trim().indexOf('*') === 0) continue;
        // Look for JSX-like patterns that are not self-closing and have no matching close on the same line
        var matches = line.match(/<([A-Z][\w]*)[^>]*(?<!\/)>/g);
        if (matches) {
          for (var m = 0; m < matches.length; m++) {
            var tag = matches[m].match(/<([A-Z][\w]*)/);
            if (tag) {
              var tagName = tag[1];
              // Check if self-closing (ends with />)
              if (matches[m].trim().endsWith('/>')) continue;
              // Check for HTML void elements
              if (selfClosing.test(matches[m])) continue;
              // Check if there's a closing tag on the same line
              if (line.indexOf('</' + tagName + '>') !== -1) continue;
              // Potentially unclosed — report as warning-level issue
              // We do a multi-line check below
            }
          }
        }
      }
      // Multi-line check: count opening vs closing for capital-letter component tags
      var openCount = 0;
      var closeCount = 0;
      var openRe = /<(div|span|section|header|footer|main|nav|article|aside|button|form|label|input|select|option|textarea|table|thead|tbody|tr|td|th|ul|ol|li|a|p|h[1-6]|details|summary|dialog|figure|figcaption|picture|video|audio|canvas|svg)[\s>]/gi;
      var closeRe = /<\/(div|span|section|header|footer|main|nav|article|aside|button|form|label|select|option|textarea|table|thead|tbody|tr|td|th|ul|ol|li|a|p|h[1-6]|details|summary|dialog|figure|figcaption|picture|video|audio|canvas|svg)>/gi;
      // Also count self-closing to subtract
      var selfCloseRe = /<(div|span|section|header|footer|main|nav|article|aside|button|form|label|input|select|option|textarea|table|thead|tbody|tr|td|th|ul|ol|li|a|p|h[1-6]|details|summary|dialog|figure|figcaption|picture|video|audio|canvas|svg)[^>]*\/>/gi;

      var o; while ((o = openRe.exec(content)) !== null) openCount++;
      var c; while ((c = closeRe.exec(content)) !== null) closeCount++;
      var s; while ((s = selfCloseRe.exec(content)) !== null) openCount++;

      if (openCount > closeCount) {
        issues.push(issue('X6', 'error', 'Potentially unclosed JSX tags detected (opened: ' + openCount + ', closed: ' + closeCount + ')', allJsx[i].path));
      }
    }
    return issues;
  }

  function checkX7(files) {
    var issues = [];
    for (var i = 0; i < files.length; i++) {
      var content = files[i].content.trim();
      if (/^```(?:typescript|javascript|tsx|jsx|python|css|html|json|yaml|bash|sh|sql|rust|go|java)\s*$/im.test(content)) {
        issues.push(issue('X7', 'error', 'File content starts with a language-prefixed code fence (```typescript etc). Remove it.', files[i].path, 1));
      }
    }
    return issues;
  }

  function checkX8(files) {
    var issues = [];
    var tsxFiles = findFileByExt(files, 'tsx');
    var jsxFiles = findFileByExt(files, 'jsx');
    var allReact = tsxFiles.concat(jsxFiles);
    for (var i = 0; i < allReact.length; i++) {
      var lines = getLines(allReact[i].content);
      for (var ln = 0; ln < lines.length; ln++) {
        if (/^\s*import\s+React\s+from\s+['"]react['"];?\s*$/.test(lines[ln])) {
          issues.push(issue('X8', 'warning', 'Unnecessary "import React from react" with jsx:"react-jsx" transform.', allReact[i].path, ln + 1));
        }
      }
    }
    return issues;
  }

  function checkX9(files) {
    var issues = [];
    for (var i = 0; i < files.length; i++) {
      var path = files[i].path;
      // Skip config files and test files
      if (/\.(config|test|spec)\.(ts|js|tsx|jsx)$/i.test(path)) continue;
      if (path.toLowerCase().indexOf('node_modules') !== -1) continue;
      var lines = getLines(files[i].content);
      for (var ln = 0; ln < lines.length; ln++) {
        if (/console\.log\s*\(/.test(lines[ln])) {
          issues.push(issue('X9', 'warning', 'console.log found in production code', path, ln + 1));
        }
      }
    }
    return issues;
  }

  function checkX10(files) {
    var issues = [];
    var conversational = [
      /here\s+(is|are|\'s)\s+(the\s+)?(code|implementation|solution|component)/i,
      /i\s+(have|\'ve)\s+(created|written|built|generated|implemented)/i,
      /let\s+me\s+(know|explain|walk|show)/i,
      /hope\s+(this|that)\s+(helps|works)/i,
      /sure,?\s+(here|i\'ll|let)/i,
      /of\s+course/i,
      /below\s+(is|are)\s+(the\s+)?(complete|full|the)/i,
    ];
    for (var i = 0; i < files.length; i++) {
      var path = files[i].path;
      if (/\.(json|md|yaml|yml|html|css)$/i.test(path)) continue;
      if (path.toLowerCase().indexOf('node_modules') !== -1) continue;
      var lines = getLines(files[i].content);
      for (var ln = 0; ln < lines.length; ln++) {
        var line = lines[ln];
        // Skip comments
        if (/^\s*(\/\/|\/\*|\*)/.test(line)) continue;
        if (/^\s*['"`]/.test(line)) {
          // Check if it's a string literal with conversational text
          for (var c = 0; c < conversational.length; c++) {
            if (conversational[c].test(line)) {
              issues.push(issue('X10', 'warning', 'Conversational text found in code output', path, ln + 1));
              break;
            }
          }
        }
      }
    }
    return issues;
  }

  function checkX11(files) {
    var issues = [];
    for (var i = 0; i < files.length; i++) {
      var path = files[i].path;
      if (/\.(json|md|yaml|yml|html|css)$/i.test(path)) continue;
      if (path.toLowerCase().indexOf('node_modules') !== -1) continue;
      var lines = getLines(files[i].content);
      for (var ln = 0; ln < lines.length; ln++) {
        var line = lines[ln];
        // Match TODO comments that are not followed by implementation markers
        if (/\/\/\s*TODO(?![\s:]*\[.*\])/.test(line)) {
          // Check if it's a descriptive TODO (likely unimplemented)
          if (/\/\/\s*TODO:?[\s]+.{10,}/i.test(line)) {
            issues.push(issue('X11', 'warning', 'Unimplemented TODO comment found', path, ln + 1));
          }
        }
      }
    }
    return issues;
  }

  function checkX12(files) {
    var issues = [];
    var pkgFile = findFile(files, 'package.json');
    if (!pkgFile) return issues;
    try {
      var pkg = JSON.parse(pkgFile.content);
      var deps = {};
      if (pkg.dependencies) {
        for (var k in pkg.dependencies) { deps[k.toLowerCase()] = k; }
      }
      if (pkg.devDependencies) {
        for (var k2 in pkg.devDependencies) { deps[k2.toLowerCase()] = k2; }
      }
      // Collect all imports from code files
      var used = {};
      for (var i = 0; i < files.length; i++) {
        var path = files[i].path;
        if (!/\.(ts|tsx|js|jsx)$/i.test(path)) continue;
        if (path.toLowerCase().indexOf('node_modules') !== -1) continue;
        var importRe = /(?:import\s+.*?\s+from\s+['"]|require\s*\(\s*['"])([\w@][\w\/-]*)/g;
        var m;
        while ((m = importRe.exec(files[i].content)) !== null) {
          var pkgName = m[1].split('/')[0].toLowerCase();
          used[pkgName] = true;
        }
      }
      // Check for unused deps (skip common dev-only and peer deps)
      var skip = ['react', 'react-dom', 'typescript', 'vite', '@types/react', '@types/react-dom', '@vitejs/plugin-react', 'tailwindcss', 'postcss', 'autoprefixer', 'eslint', 'prettier'];
      for (var dep in deps) {
        if (skip.indexOf(dep) !== -1) continue;
        if (!used[dep]) {
          issues.push(issue('X12', 'warning', 'Potentially unused dependency: ' + deps[dep], pkgFile.path));
        }
      }
    } catch (e) {
      // Invalid JSON, skip
    }
    return issues;
  }

  function checkS1(files) {
    var issues = [];
    // This rule applies to codegen output: check all code files for conversational wrappers
    var codeFiles = files.filter(function (f) {
      return /\.(ts|tsx|js|jsx|css|html)$/i.test(f.path);
    });
    for (var i = 0; i < codeFiles.length; i++) {
      var content = codeFiles[i].content.trim();
      // Check for markdown code fences wrapping the content
      if (/^```[\w]*\s*$/im.test(content) && /\n```\s*$/im.test(content)) {
        issues.push(issue('S1', 'error', 'File content is wrapped in markdown code fences. Codegen must output raw code only.', codeFiles[i].path, 1));
      }
    }
    return issues;
  }

  /* ── Rule dispatch table ── */

  var CHECKS = {
    R1:  checkR1,
    R2:  checkR2,
    R3:  checkR3,
    R4:  checkR4,
    R5:  checkR5,
    X1:  checkX1,
    X2:  checkX2,
    X3:  checkX3,
    X4:  checkX4,
    X6:  checkX6,
    X7:  checkX7,
    X8:  checkX8,
    X9:  checkX9,
    X10: checkX10,
    X11: checkX11,
    X12: checkX12,
    S1:  checkS1,
  };

  /* ── JarvisRules public API ── */

  var JarvisRules = {
    /**
     * Validate an array of file objects [{path, content}].
     * @param {Array} files - Array of {path: string, content: string}.
     * @param {string} [version] - Constitution version ('G50+', 'G50', 'G40').
     * @returns {{passed: boolean, issues: Array}}
     */
    validateFiles: function (files, version) {
      var v = version || 'G50+';
      var activeRules = VERSION_RULES[v] || VERSION_RULES['G50+'];
      var allIssues = [];
      for (var i = 0; i < activeRules.length; i++) {
        var ruleId = activeRules[i];
        var checker = CHECKS[ruleId];
        if (checker) {
          var issues = checker(files);
          allIssues = allIssues.concat(issues);
        }
      }
      var hasErrors = allIssues.some(function (iss) { return iss.severity === 'error'; });
      return {
        passed: !hasErrors,
        issues: allIssues,
        version: v,
        rulesChecked: activeRules.length,
        errorCount: allIssues.filter(function (i) { return i.severity === 'error'; }).length,
        warningCount: allIssues.filter(function (i) { return i.severity === 'warning'; }).length,
      };
    },

    /**
     * Validate a single code string.
     * @param {string} code - The code content.
     * @param {string} [filename] - Optional filename for rule context.
     * @param {string} [version] - Constitution version.
     * @returns {{passed: boolean, issues: Array}}
     */
    validateCode: function (code, filename, version) {
      var fakeFile = { path: filename || 'unknown.tsx', content: code };
      return JarvisRules.validateFiles([fakeFile], version);
    },

    /**
     * Get all rules as descriptive objects.
     * @returns {Array} Array of {id, label, description, severity, version}.
     */
    getRules: function () {
      return ALL_RULES.slice();
    },

    /**
     * Get rules for a specific constitution version.
     * @param {string} version - 'G50+', 'G50', or 'G40'.
     * @returns {Array} Array of rule objects for that version.
     */
    getConstitution: function (version) {
      var v = version || 'G50+';
      var activeIds = VERSION_RULES[v] || VERSION_RULES['G50+'];
      return activeIds.map(function (id) { return findRule(id); }).filter(Boolean);
    },

    /**
     * Get the version → rule count summary.
     * @returns {Object} {version: count}.
     */
    getVersionSummary: function () {
      var summary = {};
      for (var v in VERSION_RULES) {
        summary[v] = VERSION_RULES[v].length;
      }
      return summary;
    },
  };

  self.JarvisRules = JarvisRules;
})();
