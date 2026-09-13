const tools = {};
const schemas = [];

function registerTool(name, schema, executor) {
  tools[name] = executor;
  schemas.push({ name, ...schema });
}

function getSchemas() {
  return schemas;
}

async function execute(name, args) {
  if (!tools[name]) {
    throw new Error(`Tool ${name} not found`);
  }
  return await tools[name](args);
}

// Outil initial de test : read_project_state
registerTool(
  'read_project_state',
  {
    description: 'Reads the current state of the project',
    parameters: {
      type: 'object',
      properties: {
        projectId: { type: 'string' }
      },
      required: ['projectId']
    }
  },
  async (args) => {
    return { status: 'idle', message: `Project state for ${args.projectId} is healthy.` };
  }
);

// Nouvel outil : Demander à l'extension Chrome de générer du code
registerTool(
  'deepseek_web_generate',
  {
    description: 'Deleagates code generation to the Chrome extension via DeepSeek Web UI',
    parameters: {
      type: 'object',
      properties: {
        projectId: { type: 'string' },
        phase: { type: 'number' },
        prompt: { type: 'string' }
      },
      required: ['projectId', 'prompt']
    }
  },
  async (args) => {
    try {
      // Ajoute le prompt dans la file d'attente existante de main.js
      const response = await fetch('http://127.0.0.1:5006/bridge/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: args.prompt,
          target_ai: 'deepseek',
          target_project: args.projectId,
          phase_num: args.phase || 1
        })
      });
      
      const data = await response.json();
      console.log(`[QUEUE] Tâche ajoutée pour le projet ${args.projectId} (Phase ${args.phase || 1})`);
      
      return { 
        status: 'queued', 
        message: `La requête a été transmise à l'extension Chrome via le Bridge. (ID: ${data.success ? 'OK' : 'FAIL'})` 
      };
    } catch (e) {
      return { status: 'error', message: `Impossible d'ajouter à la file d'attente: ${e.message}` };
    }
  }
);

// Nouvel outil : Demander à l'extension Chrome de chatter avec NotebookLM
registerTool(
  'notebooklm_web_generate',
  {
    description: 'Deleagates interaction to the Chrome extension via Google NotebookLM Web UI',
    parameters: {
      type: 'object',
      properties: {
        projectId: { type: 'string' },
        phase: { type: 'number' },
        prompt: { type: 'string' }
      },
      required: ['projectId', 'prompt']
    }
  },
  async (args) => {
    try {
      // Ajoute le prompt dans la file d'attente existante de main.js
      const response = await fetch('http://127.0.0.1:5006/bridge/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: args.prompt,
          target_ai: 'notebooklm',
          target_project: args.projectId,
          phase_num: args.phase || 1
        })
      });
      
      const data = await response.json();
      console.log(`[QUEUE] Tâche NotebookLM ajoutée pour le projet ${args.projectId} (Phase ${args.phase || 1})`);
      
      return { 
        status: 'queued', 
        message: `La requête a été transmise à NotebookLM via l'extension Chrome. (ID: ${data.success ? 'OK' : 'FAIL'})` 
      };
    } catch (e) {
      return { status: 'error', message: `Impossible d'ajouter à la file d'attente: ${e.message}` };
    }
  }
);

// Outil : Lister les fichiers du projet
registerTool(
  'list_project_files',
  {
    description: 'Lists all files in a specific project directory.',
    parameters: {
      type: 'object',
      properties: { projectId: { type: 'string' } },
      required: ['projectId']
    }
  },
  async (args) => {
    try {
      const res = await fetch(`http://127.0.0.1:5006/api/fs/tree?project=${args.projectId}`);
      return await res.json();
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  }
);

// Outil : Lire un fichier
registerTool(
  'read_project_file',
  {
    description: 'Reads the content of a specific file.',
    parameters: {
      type: 'object',
      properties: { projectId: { type: 'string' }, filePath: { type: 'string' } },
      required: ['projectId', 'filePath']
    }
  },
  async (args) => {
    try {
      const res = await fetch(`http://127.0.0.1:5006/api/fs/read?project=${args.projectId}&file=${encodeURIComponent(args.filePath)}`);
      return await res.json();
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  }
);

// Outil : Écrire un fichier
registerTool(
  'write_project_file',
  {
    description: 'Writes content to a specific file.',
    parameters: {
      type: 'object',
      properties: { projectId: { type: 'string' }, filePath: { type: 'string' }, content: { type: 'string' } },
      required: ['projectId', 'filePath', 'content']
    }
  },
  async (args) => {
    try {
      const res = await fetch(`http://127.0.0.1:5006/api/fs/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: args.projectId, file: args.filePath, content: args.content })
      });
      return await res.json();
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  }
);

// Outil : Installer les dépendances
registerTool(
  'install_dependencies',
  {
    description: 'Installs dependencies using pnpm for a specific project.',
    parameters: {
      type: 'object',
      properties: { projectId: { type: 'string' } },
      required: ['projectId']
    }
  },
  async (args) => {
    return new Promise((resolve) => {
      const { spawn } = require('child_process');
      const path = require('path');
      const projectPath = path.join('e:\\v0reponses\\v0-moteur-electron\\v0saveprojets', args.projectId);
      
      const isWin = /^win/.test(process.platform);
      const cmd = isWin ? 'cmd.exe' : 'pnpm';
      const args = isWin ? ['/c', 'pnpm.cmd', 'install'] : ['install'];
      const child = spawn(cmd, args, {
        cwd: projectPath,
        shell: false,
        windowsHide: true
      });
      
      let logs = '';
      child.stdout.on('data', data => logs += data.toString());
      child.stderr.on('data', data => logs += data.toString());
      
      child.on('close', code => {
        if (code === 0) resolve({ status: 'success', message: 'Installation réussie', logs });
        else resolve({ status: 'error', message: `Échec d'installation (code ${code})`, logs });
      });
    });
  }
);

// Outil : Démarrer la preview
registerTool(
  'start_preview',
  {
    description: 'Starts the development server for a specific project.',
    parameters: {
      type: 'object',
      properties: { projectId: { type: 'string' } },
      required: ['projectId']
    }
  },
  async (args) => {
    return new Promise((resolve) => {
      const { spawn } = require('child_process');
      const path = require('path');
      const projectPath = path.join('e:\\v0reponses\\v0-moteur-electron\\v0saveprojets', args.projectId);
      
      const isWin = /^win/.test(process.platform);
      const cmd = isWin ? 'cmd.exe' : 'npm';
      const args = isWin ? ['/c', 'npm.cmd', 'run', 'dev', '--', '--host'] : ['run', 'dev', '--', '--host'];
      const child = spawn(cmd, args, {
        cwd: projectPath,
        shell: false,
        windowsHide: true
      });
      
      child.stdout.on('data', data => {
        if (data.toString().includes('localhost:') || data.toString().includes('ready in')) {
          resolve({ status: 'success', message: 'Serveur démarré avec succès.' });
        }
      });
      
      child.stderr.on('data', data => {
        if (data.toString().toLowerCase().includes('error')) {
          resolve({ status: 'error', message: 'Erreur au démarrage: ' + data.toString() });
        }
      });
      
      setTimeout(() => resolve({ status: 'timeout', message: 'Délai d\'attente dépassé pour le démarrage.' }), 10000);
    });
  }
);

// Outil : Typecheck
registerTool(
  'run_typecheck',
  {
    description: 'Runs TypeScript typechecking (tsc) for a specific project.',
    parameters: {
      type: 'object',
      properties: { projectId: { type: 'string' } },
      required: ['projectId']
    }
  },
  async (args) => {
    return new Promise((resolve) => {
      const { spawn } = require('child_process');
      const path = require('path');
      const projectPath = path.join('e:\\v0reponses\\v0-moteur-electron\\v0saveprojets', args.projectId);
      
      const isWin = /^win/.test(process.platform);
      const cmd = isWin ? 'cmd.exe' : 'npx';
      const args = isWin ? ['/c', 'npx.cmd', 'tsc', '--noEmit'] : ['tsc', '--noEmit'];
      const child = spawn(cmd, args, {
        cwd: projectPath,
        shell: false,
        windowsHide: true
      });
      
      let logs = '';
      child.stdout.on('data', data => logs += data.toString());
      child.stderr.on('data', data => logs += data.toString());
      
      child.on('close', code => {
        if (code === 0) resolve({ status: 'success', message: 'Typecheck validé', logs });
        else resolve({ status: 'error', message: `Typecheck échoué (code ${code})`, logs });
      });
    });
  }
);

module.exports = {
  registerTool,
  schemas: getSchemas,
  execute
};
