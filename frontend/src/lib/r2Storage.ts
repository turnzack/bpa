// Client R2 Storage pour Kirov5 Sovereign Forge
// Permet de pousser et récupérer les artefacts de projet vers/depuis Cloudflare R2

const WORKER_BASE_URL = 'https://kirov-worker.v0reponses.workers.dev';

export async function uploadArtifactToR2(
  projectId: string,
  fileName: string,
  content: string | ArrayBuffer
): Promise<{ success: boolean; key?: string; error?: string }> {
  try {
    const token = localStorage.getItem('kirov5_jwt_token') || '';
    const body = typeof content === 'string' ? new TextEncoder().encode(content) : content;

    const res = await fetch(`${WORKER_BASE_URL}/v1/r2/upload?projectId=${encodeURIComponent(projectId)}&file=${encodeURIComponent(fileName)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `Bearer ${token}`
      },
      body
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || 'Erreur lors du transfert R2' };
    }

    const data = await res.json();
    return { success: true, key: data.key };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Impossible de joindre le Worker R2' };
  }
}

export async function downloadArtifactFromR2(
  projectId: string,
  fileName: string
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const token = localStorage.getItem('kirov5_jwt_token') || '';

    const res = await fetch(`${WORKER_BASE_URL}/v1/r2/download?projectId=${encodeURIComponent(projectId)}&file=${encodeURIComponent(fileName)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return { success: false, error: 'Artefact introuvable' };
    }

    const text = await res.text();
    return { success: true, data: text };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur de téléchargement R2' };
  }
}
