// services/ai-services.ts
// Services d'IA pour SolarScan : YOLO, ESRGAN, Détection de flou

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

// Configuration
const PYTHON_PATH = process.env.PYTHON_PATH || "python";
const AI_DIR = path.join(__dirname, "..", "ai");

// Interfaces
export interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    confidence: number;
    class: number;
    class_name: string;
    area: number;
}

export interface BlurScore {
    blur_score: number;
    mean: number;
    is_blurry: boolean;
    threshold: number;
    image_size: {
        width: number;
        height: number;
    };
}

// ============================================
// YOLO - Détection d'objets
// ============================================

export async function detectObject(imagePath: string): Promise<BoundingBox | null> {
    try {
        const scriptPath = path.join(AI_DIR, "detect_object.py");
        const cmd = `"${PYTHON_PATH}" "${scriptPath}" "${imagePath}"`;

        console.log(`[YOLO] Detecting object in ${path.basename(imagePath)}...`);
        const { stdout } = await execAsync(cmd);

        const result = JSON.parse(stdout.trim());

        if (result.error) {
            console.error(`[YOLO] Error: ${result.error}`);
            return null;
        }

        if (result.confidence) {
            console.log(`[YOLO] Found ${result.class_name} (confidence: ${result.confidence.toFixed(2)})`);
            return result;
        }

        return null;

    } catch (error: any) {
        console.error(`[YOLO] Failed to detect object:`, error.message);
        return null;
    }
}

export async function cropToObject(imagePath: string, box: BoundingBox, margin: number = 0.1): Promise<boolean> {
    try {
        const ffmpegPath = process.env.FFMPEG_PATH || "C:\\ffmpeg-8.0.1\\bin\\ffmpeg.exe";

        // Calculer les dimensions avec marge
        const width = box.x2 - box.x1;
        const height = box.y2 - box.y1;

        const x = Math.max(0, Math.floor(box.x1 - width * margin));
        const y = Math.max(0, Math.floor(box.y1 - height * margin));
        const w = Math.floor(width * (1 + 2 * margin));
        const h = Math.floor(height * (1 + 2 * margin));

        const tempPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '_cropped.$1');
        const cmd = `"${ffmpegPath}" -y -i "${imagePath}" -vf "crop=${w}:${h}:${x}:${y}" "${tempPath}"`;

        await execAsync(cmd);

        // Remplacer l'original
        fs.unlinkSync(imagePath);
        fs.renameSync(tempPath, imagePath);

        console.log(`[YOLO] Cropped ${path.basename(imagePath)} to object`);
        return true;

    } catch (error: any) {
        console.error(`[YOLO] Failed to crop image:`, error.message);
        return false;
    }
}

// ============================================
// Détection de Flou
// ============================================

export async function detectBlur(imagePath: string): Promise<BlurScore | null> {
    try {
        const scriptPath = path.join(AI_DIR, "detect_blur.py");
        const cmd = `"${PYTHON_PATH}" "${scriptPath}" "${imagePath}"`;

        const { stdout } = await execAsync(cmd);
        const result = JSON.parse(stdout.trim());

        if (result.error) {
            console.error(`[Blur Detection] Error: ${result.error}`);
            return null;
        }

        return result;

    } catch (error: any) {
        console.error(`[Blur Detection] Failed:`, error.message);
        return null;
    }
}

// ============================================
// ESRGAN - Super-résolution
// ============================================

export async function enhanceWithESRGAN(imagePath: string, scale: number = 2): Promise<boolean> {
    try {
        const scriptPath = path.join(AI_DIR, "enhance.py");
        const tempPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '_enhanced.$1');

        const cmd = `"${PYTHON_PATH}" "${scriptPath}" "${imagePath}" "${tempPath}" ${scale}`;

        console.log(`[ESRGAN] Enhancing ${path.basename(imagePath)} (${scale}x)...`);

        const { stdout, stderr } = await execAsync(cmd, {
            timeout: 60000 // 60 secondes max par image
        });

        // Vérifier si le fichier de sortie existe
        if (!fs.existsSync(tempPath)) {
            console.error(`[ESRGAN] Output file not created`);
            return false;
        }

        // Remplacer l'original
        fs.unlinkSync(imagePath);
        fs.renameSync(tempPath, imagePath);

        console.log(`[ESRGAN] Successfully enhanced ${path.basename(imagePath)}`);
        return true;

    } catch (error: any) {
        console.error(`[ESRGAN] Failed to enhance image:`, error.message);
        return false;
    }
}

// ============================================
// Pipeline Complet
// ============================================

export async function preprocessPhotos(framesDir: string, options: {
    enableYOLO?: boolean;
    enableBlurDetection?: boolean;
    enableESRGAN?: boolean;
    yoloConfidenceThreshold?: number;
    blurThreshold?: number;
    esrganScale?: number;
} = {}): Promise<{
    processed: number;
    cropped: number;
    removed: number;
    enhanced: number;
}> {
    const {
        enableYOLO = true,
        enableBlurDetection = true,
        enableESRGAN = true,
        yoloConfidenceThreshold = 0.5,
        blurThreshold = 100,
        esrganScale = 2
    } = options;

    const stats = {
        processed: 0,
        cropped: 0,
        removed: 0,
        enhanced: 0
    };

    try {
        const files = fs.readdirSync(framesDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
        console.log(`[AI Pipeline] Processing ${files.length} images...`);

        for (const file of files) {
            const imagePath = path.join(framesDir, file);
            stats.processed++;

            // 1. Détection de flou
            if (enableBlurDetection) {
                const blurScore = await detectBlur(imagePath);
                if (blurScore && blurScore.is_blurry && blurScore.blur_score < blurThreshold) {
                    console.log(`[AI Pipeline] Removing blurry image: ${file} (score: ${blurScore.blur_score.toFixed(1)})`);
                    fs.unlinkSync(imagePath);
                    stats.removed++;
                    continue;
                }
            }

            // 2. Détection d'objets et crop
            if (enableYOLO) {
                const box = await detectObject(imagePath);
                if (box && box.confidence >= yoloConfidenceThreshold) {
                    const success = await cropToObject(imagePath, box);
                    if (success) {
                        stats.cropped++;
                    }
                }
            }

            // 3. Super-résolution
            if (enableESRGAN) {
                const success = await enhanceWithESRGAN(imagePath, esrganScale);
                if (success) {
                    stats.enhanced++;
                }
            }
        }

        console.log(`[AI Pipeline] Complete: ${stats.processed} processed, ${stats.cropped} cropped, ${stats.removed} removed, ${stats.enhanced} enhanced`);
        return stats;

    } catch (error: any) {
        console.error(`[AI Pipeline] Error:`, error.message);
        return stats;
    }
}
