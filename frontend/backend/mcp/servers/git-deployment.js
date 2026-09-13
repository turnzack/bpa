'use strict';
/**
 * TIGER-052 — Serveur MCP git-deployment
 * mcp/servers/git-deployment.js
 *
 * Outils : git_status, git_diff, git_commit (auto)
 *          git_push (PROTÉGÉ — confirmation obligatoire)
 *          git_init, git_log
 *
 * RÈGLE : git push nécessite { confirmed: true } dans les opts de l'invocation.
 *         (géré par mcp-policy PROTECTED_TOOLS)
 */

const { spawn } = require('child_process');
const path = require('path');
const fs   = require('fs');

const IS_WIN = process.platform === 'win32';

function spawnGit(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', args, {
      cwd,
      shell:       false,
      windowsHide: true,
      env:         { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    });

    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => { child.kill(); reject(new Error('Timeout git')); }, 30_000);

    child.stdout.on('data', d => { stdout += d.toString(); });
    child.stderr.on('data', d => { stderr += d.toString(); });
    child.on('close', code => { clearTimeout(timer); resolve({ code: code ?? 0, stdout, stderr }); });
    child.on('error', err  => { clearTimeout(timer); reject(err); });
  });
}

const SERVER = {
  name:        'git-deployment',
  description: 'Opérations Git sécurisées (push protégé par confirmation)',

  getTools() {
    return [
      { name: 'git_status',  description: 'git status --short', schema: { projectDir: 'string' } },
      { name: 'git_diff',    description: 'git diff HEAD (limité à 5000 chars)', schema: { projectDir: 'string', staged: 'boolean?' } },
      { name: 'git_log',     description: 'git log --oneline (10 derniers commits)', schema: { projectDir: 'string' } },
      { name: 'git_init',    description: 'Initialise un dépôt Git si absent', schema: { projectDir: 'string' } },
      { name: 'git_add',     description: 'git add .',schema: { projectDir: 'string' } },
      { name: 'git_commit',  description: 'git add . && git commit -m <message>', schema: { projectDir: 'string', message: 'string' } },
      { name: 'git_push',    description: 'git push (PROTÉGÉ — confirmation obligatoire)', schema: { projectDir: 'string', remote: 'string?', branch: 'string?' } },
    ];
  },

  async invoke(toolName, args) {
    const { projectDir } = args;
    if (!projectDir) throw new Error('projectDir requis.');
    if (!fs.existsSync(projectDir)) throw new Error(`Dossier projet introuvable : ${projectDir}`);

    switch (toolName) {

      case 'git_init': {
        const hasGit = fs.existsSync(path.join(projectDir, '.git'));
        if (hasGit) return { success: true, status: 'already_initialized' };
        const r = await spawnGit(['init'], projectDir);
        return { success: r.code === 0, code: r.code, output: r.stdout };
      }

      case 'git_status': {
        const r = await spawnGit(['status', '--short', '--porcelain'], projectDir);
        const lines = r.stdout.trim().split('\n').filter(Boolean);
        return {
          success:  r.code === 0,
          clean:    lines.length === 0,
          changes:  lines.length,
          files:    lines.slice(0, 30).map(l => ({ status: l.slice(0, 2).trim(), file: l.slice(3) })),
        };
      }

      case 'git_diff': {
        const { staged = false } = args;
        const diffArgs = staged ? ['diff', '--cached'] : ['diff', 'HEAD'];
        const r = await spawnGit(diffArgs, projectDir);
        return { success: r.code === 0, diff: r.stdout.slice(0, 5000) };
      }

      case 'git_log': {
        const r = await spawnGit(['log', '--oneline', '-10'], projectDir);
        const commits = r.stdout.trim().split('\n').filter(Boolean).map(line => {
          const [hash, ...rest] = line.split(' ');
          return { hash: hash.trim(), message: rest.join(' ').trim() };
        });
        return { success: r.code === 0, commits };
      }

      case 'git_add': {
        const r = await spawnGit(['add', '.'], projectDir);
        return { success: r.code === 0, code: r.code, output: r.stdout };
      }

      case 'git_commit': {
        const { message } = args;
        if (!message || typeof message !== 'string') throw new Error('message requis pour git_commit.');
        if (message.length > 500) throw new Error('Message de commit trop long (max 500 chars).');

        // Sanitize : pas d'injection via le message
        const safeMsgRe = /^[a-zA-Z0-9\s\-_:().\/\[\]àâäéèêëîïôùûüçÀÂÄÉÈÊËÎÏÔÙÛÜÇ]+$/;
        if (!safeMsgRe.test(message)) throw new Error('Message de commit contient des caractères non autorisés.');

        // git add .
        const addResult = await spawnGit(['add', '.'], projectDir);
        if (addResult.code !== 0) return { success: false, phase: 'git add', output: addResult.stderr };

        // git commit
        const commitResult = await spawnGit(['commit', '-m', message], projectDir);
        return { success: commitResult.code === 0, code: commitResult.code, output: commitResult.stdout };
      }

      case 'git_push': {
        // Cet outil est PROTECTED — la policy mcp-policy bloque si !opts.confirmed
        // Si on arrive ici c'est que la confirmation a été fournie
        const { remote = 'origin', branch = 'main' } = args;

        // Validation : remote ne peut être que origin
        if (remote !== 'origin') throw new Error('Seul le remote "origin" est autorisé.');
        // Validation : branch alphanumérique uniquement
        if (!/^[a-zA-Z0-9/_-]+$/.test(branch)) throw new Error(`Nom de branche invalide : ${branch}`);

        const r = await spawnGit(['push', remote, branch], projectDir);
        return { success: r.code === 0, code: r.code, remote, branch, output: (r.stdout + r.stderr).slice(-1000) };
      }

      default:
        throw new Error(`Outil inconnu : ${toolName}`);
    }
  },
};

module.exports = SERVER;
