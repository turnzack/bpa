// config/ai.config.ts
// Configuration des fonctionnalités IA
// Permet d'activer/désactiver chaque IA individuellement

export interface AIConfig {
    // Activation globale de l'IA
    enabled: boolean;

    // Détection de flou
    blurDetection: {
        enabled: boolean;
        threshold: number; // Variance minimale (< threshold = flou)
    };

    // Détection d'objets YOLO
    objectDetection: {
        enabled: boolean;
        confidenceThreshold: number; // Confiance minimale (0-1)
        cropMargin: number; // Marge autour de l'objet (0-1)
    };

    // Super-résolution ESRGAN
    superResolution: {
        enabled: boolean;
        scale: number; // Facteur d'upscaling (2 ou 4)
    };

    // Chemins
    pythonPath: string;
    ffmpegPath: string;
}

// Configuration par défaut (TOUTES LES IA DÉSACTIVÉES par défaut)
export const defaultAIConfig: AIConfig = {
    enabled: false, // ⚠️ DÉSACTIVÉ PAR DÉFAUT pour ne pas casser le projet

    blurDetection: {
        enabled: false,
        threshold: 100
    },

    objectDetection: {
        enabled: false,
        confidenceThreshold: 0.5,
        cropMargin: 0.1
    },

    superResolution: {
        enabled: false,
        scale: 2
    },

    pythonPath: process.env.PYTHON_PATH || "python",
    ffmpegPath: process.env.FFMPEG_PATH || "C:\\ffmpeg-8.0.1\\bin\\ffmpeg.exe"
};

// Configuration actuelle (peut être modifiée à chaud)
let currentConfig: AIConfig = { ...defaultAIConfig };

// Getters et setters
export function getAIConfig(): AIConfig {
    return { ...currentConfig };
}

export function setAIConfig(config: Partial<AIConfig>): void {
    currentConfig = { ...currentConfig, ...config };
    console.log("[AI Config] Configuration updated:", currentConfig);
}

export function enableAllAI(): void {
    currentConfig.enabled = true;
    currentConfig.blurDetection.enabled = true;
    currentConfig.objectDetection.enabled = true;
    currentConfig.superResolution.enabled = true;
    console.log("[AI Config] All AI features enabled");
}

export function disableAllAI(): void {
    currentConfig.enabled = false;
    currentConfig.blurDetection.enabled = false;
    currentConfig.objectDetection.enabled = false;
    currentConfig.superResolution.enabled = false;
    console.log("[AI Config] All AI features disabled");
}

// Vérifier si au moins une IA est activée
export function isAnyAIEnabled(): boolean {
    return currentConfig.enabled && (
        currentConfig.blurDetection.enabled ||
        currentConfig.objectDetection.enabled ||
        currentConfig.superResolution.enabled
    );
}
