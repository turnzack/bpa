const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

class ReactProjectIntrospector {
  async execute(payload, context) {
    console.log(`[AST-INTROSPECTOR] 🔍 Démarrage de l'analyse du projet...`);
    
    const { targetFile } = payload;
    
    if (!targetFile || !fs.existsSync(targetFile)) {
      throw new Error(`Le fichier cible est introuvable : ${targetFile}`);
    }

    const code = fs.readFileSync(targetFile, 'utf8');
    
    // Parse le code TypeScript/React avec Babel
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    const analysis = {
      filePath: targetFile,
      imports: [],
      stateHooks: [],
      effectHooks: [],
      apiCalls: [],
      uiStructure: 'complex'
    };

    // Parcours de l'Arbre Syntaxique (AST)
    traverse(ast, {
      ImportDeclaration(path) {
        analysis.imports.push(path.node.source.value);
      },
      CallExpression(path) {
        const callee = path.node.callee;
        
        // Détection des Hooks React
        if (callee.type === 'Identifier') {
          if (callee.name === 'useState') analysis.stateHooks.push('useState');
          if (callee.name === 'useEffect') analysis.effectHooks.push('useEffect');
          if (callee.name === 'fetch') analysis.apiCalls.push('fetch');
        }
        
        // Détection des appels axios/fetch via les propriétés (ex: axios.get)
        if (callee.type === 'MemberExpression') {
          if (callee.object.name === 'axios') analysis.apiCalls.push(`axios.${callee.property.name}`);
        }
      },
      JSXElement(path) {
        // Optionnel : on pourrait cartographier l'UI ici
      }
    });

    console.log(`[AST-INTROSPECTOR] ✅ Analyse AST terminée pour ${path.basename(targetFile)}.`);
    console.log(`-> Hooks trouvés : ${analysis.stateHooks.length} | Imports : ${analysis.imports.length}`);

    return {
      success: true,
      analysis
    };
  }
}

module.exports = new ReactProjectIntrospector();
