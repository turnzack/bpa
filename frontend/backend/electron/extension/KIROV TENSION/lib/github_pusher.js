/**
 * lib/github_pusher.js — KIROV5
 * Gère l'envoi de fichiers vers GitHub
 */

class GitHubPusher {
  static async push(files, branch = 'main') {
    const storage = await chrome.storage.local.get(['github_token', 'github_repo']);
    const TOKEN = storage.github_token;
    const REPO = storage.github_repo;

    if (!TOKEN || !REPO) {
      console.error('[GitHubPusher] Token ou Repo manquant');
      return { success: false, error: 'Configuration GitHub incomplète' };
    }

    const api = async (path, method = 'GET', body = null) => {
      const res = await fetch(`https://api.github.com/repos/${REPO}/${path}`, {
        method,
        headers: {
          'Authorization': `token ${TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erreur GitHub API');
      }
      return res.json();
    };

    try {
      // 0. Ajouter build-apk.yml si absent
      const hasWorkflow = files.some(f => f.path.includes('.github/workflows'));
      if (!hasWorkflow) {
        const workflowContent = `name: Build APK
on:
  push:
    branches: [ main, master ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm install
      - name: Build project
        run: npm run build`;
        files.push({ path: '.github/workflows/build-apk.yml', content: workflowContent });
      }

      console.log(`[GitHubPusher] Push de ${files.length} fichiers vers ${REPO} (${branch})...`);
      
      // 1. Récupérer la référence de la branche
      let ref;
      try {
        ref = await api(`git/refs/heads/${branch}`);
      } catch (e) {
        // Fallback to master if main doesn't exist
        ref = await api('git/refs/heads/master');
      }
      
      const lastCommitSha = ref.object.sha;
      const lastCommit = await api(`git/commits/${lastCommitSha}`);
      const baseTreeSha = lastCommit.tree.sha;

      // 2. Créer les blobs et l'arborescence
      const treeItems = [];
      for (const f of files) {
        const blob = await api('git/blobs', 'POST', {
          content: f.content,
          encoding: 'utf-8'
        });
        treeItems.push({
          path: f.path,
          mode: '100644',
          type: 'blob',
          sha: blob.sha
        });
      }

      // 3. Créer le nouvel arbre
      const newTree = await api('git/trees', 'POST', {
        base_tree: baseTreeSha,
        tree: treeItems
      });

      // 4. Créer le commit
      const newCommit = await api('git/commits', 'POST', {
        message: `🚀 KIROV5: Auto-Push - ${new Date().toLocaleString()}`,
        tree: newTree.sha,
        parents: [lastCommitSha]
      });

      // 5. Mettre à jour la référence
      await api(`git/refs/heads/${branch === 'main' ? 'main' : 'master'}`, 'PATCH', {
        sha: newCommit.sha
      });

      console.log('[GitHubPusher] ✅ Push réussi');
      return { success: true, sha: newCommit.sha };
    } catch (e) {
      console.error('[GitHubPusher] ❌ Push échoué:', e.message);
      return { success: false, error: e.message };
    }
  }
}

// Export pour usage dans background.js
if (typeof module !== 'undefined') {
  module.exports = GitHubPusher;
}
