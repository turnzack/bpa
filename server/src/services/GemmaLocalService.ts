import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import https from 'https';

const execAsync = promisify(exec);

export class GemmaLocalService {
    private scriptPath: string = path.join(__dirname, '../ai/gemma_chat.py');
    private modelDir: string = path.join(__dirname, '../../models');
    private modelPathLocal: string = path.join(__dirname, '../../models/gemma-2b-it.gguf');
    private modelPathSource: string = "D:\\native auto\\assets\\gemma-2b-it.gguf";
    
    private libraryMobilePath: string = path.join(__dirname, '../../../mobile/assets/library.json');
    private librarySource: string = "D:\\native auto\\assets\\library.json";

    constructor() {
        this.ensureNativeAssets();
    }

    private async ensureNativeAssets() {
        // Fonction utilitaire asynchrone pour vérifier si on doit copier sans bloquer l'Event Loop
        const needsCopy = async (source: string, target: string) => {
            if (!fs.existsSync(target)) return true;
            if (!fs.existsSync(source)) return false; 
            const sourceStat = await fs.promises.stat(source);
            const targetStat = await fs.promises.stat(target);
            return sourceStat.size !== targetStat.size;
        };

        // 1. Déploiement natif du Modèle Gemma
        if (!fs.existsSync(this.modelDir)) {
            await fs.promises.mkdir(this.modelDir, { recursive: true });
        }

        if (await needsCopy(this.modelPathSource, this.modelPathLocal)) {
            console.info("⚡ [Auto-Deploy] Le modèle natif nécessite une mise à jour. Installation asynchrone en cours (ne bloque pas le serveur)...");
            if (fs.existsSync(this.modelPathSource)) {
                console.info("⚡ [Auto-Deploy] Copie du modèle depuis D:\\native auto\\assets\\...");
                try {
                    await fs.promises.copyFile(this.modelPathSource, this.modelPathLocal);
                    console.info("✅ [Auto-Deploy] Modèle copié de manière native avec succès dans BPA !");
                } catch (e) {
                    console.error("❌ Échec de la copie du modèle:", e);
                }
            } else {
                console.warn("⚠️ [Auto-Deploy] Archive locale du cerveau introuvable sur D:\\native auto\\assets.");
            }
        } else {
            console.info("✅ [Auto-Deploy] Modèle GGUF natif trouvé, à jour et prêt.");
        }

        // 2. Déploiement natif de la Bibliothèque de Prix
        const mobileAssetsDir = path.dirname(this.libraryMobilePath);
        if (!fs.existsSync(mobileAssetsDir)) {
            await fs.promises.mkdir(mobileAssetsDir, { recursive: true });
        }

        if (await needsCopy(this.librarySource, this.libraryMobilePath)) {
            console.info("⚡ [Auto-Deploy] La bibliothèque de prix native nécessite une mise à jour.");
            if (fs.existsSync(this.librarySource)) {
                console.info("⚡ [Auto-Deploy] Copie de la bibliothèque complète depuis D:\\native auto\\assets\\...");
                try {
                    await fs.promises.copyFile(this.librarySource, this.libraryMobilePath);
                    console.info("✅ [Auto-Deploy] Bibliothèque de prix rapatriée avec succès dans BPA !");
                } catch (e) {
                    console.error("❌ Échec de la copie de la bibliothèque:", e);
                }
            } else {
                console.warn("⚠️ [Auto-Deploy] Archive locale de la bibliothèque introuvable sur D:\\native auto\\assets.");
            }
        } else {
            console.info("✅ [Auto-Deploy] Bibliothèque de prix native trouvée et à jour.");
        }
    }

    public async chat(message: string): Promise<string> {
        console.log(`[Gemma Service] Nouveau message (longueur: ${message.length})`);
        
        // On fusionne tout en un seul prompt pour éviter l'erreur "System role not supported"
        // Le format attendu par Gemma-2B-IT est un simple bloc de texte ou un format <start_of_turn>
        const prompt = `<start_of_turn>user\n${message}<end_of_turn>\n<start_of_turn>model\n`;
        
        return this.runInference(prompt);
    }

    private async runInference(prompt: string): Promise<string> {
        if (!fs.existsSync(this.modelPathLocal)) {
            return "[Gemma Local] Le modèle natif n'est pas installé dans le projet.";
        }

        return new Promise((resolve) => {
            console.log(`[Gemma Service] 🚀 Lancement Gemma via Python (stdin)... (peut prendre 1-3 min sur CPU)`);
            const startTime = Date.now();

            // Utilise spawn + stdin pour éviter tout problème d'échappement
            const { spawn } = require('child_process');
            const proc = spawn('python', [this.scriptPath], {
                stdio: ['pipe', 'pipe', 'pipe'],
                timeout: 5 * 60 * 1000, // 5 minutes max
            });

            let stdout = '';
            let stderr = '';

            proc.stdout.on('data', (data: Buffer) => { stdout += data.toString(); });
            proc.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

            proc.on('close', (code: number) => {
                const duration = ((Date.now() - startTime) / 1000).toFixed(1);
                console.log(`[Gemma Service] ✅ Terminé en ${duration}s (code: ${code})`);

                if (stderr && !stdout) {
                    console.error('[Gemma Service] stderr:', stderr.substring(0, 500));
                    resolve("Erreur lors de l'exécution de Gemma Local.");
                    return;
                }
                try {
                    const result = JSON.parse(stdout.trim());
                    if (result.error) {
                        console.error('[Gemma Service] Python error:', result.error);
                        resolve(`[Erreur Gemma] ${result.error}`);
                    } else {
                        resolve(result.response || "Réponse vide de Gemma.");
                    }
                } catch (e) {
                    console.error('[Gemma Service] JSON parse error. stdout:', stdout.substring(0, 200));
                    resolve("Erreur de parsing de la réponse Gemma.");
                }
            });

            proc.on('error', (err: Error) => {
                console.error('[Gemma Service] Spawn error:', err.message);
                resolve(`Impossible de lancer Python: ${err.message}`);
            });

            // Envoyer le prompt via stdin en JSON (100% safe, pas d'échappement)
            const payload = JSON.stringify({
                prompt,
                model_path: this.modelPathLocal
            });
            proc.stdin.write(payload);
            proc.stdin.end();
        });
    }
}

export const gemmaLocalService = new GemmaLocalService();
