import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
// @ts-ignore
import piexif from "piexifjs";

// ============================================
// IMPORTS IA (OPTIONNELS - Ne cassent rien si désactivés)
// ============================================
import { getAIConfig, isAnyAIEnabled } from "./config/ai.config";
import { preprocessPhotos } from "./services/ai-services";
import invoiceRoutes from "./routes/invoiceRoutes";
import masterRoutes from "./routes/masterRoutes";
import aiRoutes from "./routes/aiRoutes";
import stripeRoutes from "./routes/stripeRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const port = process.env.PORT || 4001;

const execAsync = promisify(exec);

const DATA_DIR = path.join(__dirname, "..", "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const JOBS_DIR = path.join(DATA_DIR, "jobs");

fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(JOBS_DIR, { recursive: true });

// CORS Middleware - Dynamic Origin support for Vercel and local dev
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", "true");
    } else {
        res.header("Access-Control-Allow-Origin", "*");
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // Fix for Chrome Private Network Access (PNA)
    res.setHeader("Access-Control-Allow-Private-Network", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// Serve Static Files (Viewer, etc)
app.use(express.static(path.join(__dirname, "public")));
// Serve Job Results (Frames, OBJ, etc) - accessible via /data/jobs/...
app.use("/data", express.static(DATA_DIR));

// === MIDDLEWARE FOR POST DATA ===
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// === NEW ROUTES ===
app.use("/api/invoices", invoiceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/payments", paymentRoutes);


type JobStatus = "pending" | "running" | "paused" | "done" | "failed";

interface Job {
    id: string;
    status: JobStatus;
    step?: string; // Detailed step description
    progress: number;
    videoPath: string;
    framesDir: string;
    outputDir: string;
    objPath?: string;
    fbxPath?: string;
    error?: string;
    params?: {
        quality?: string;
        fps?: number;
        removeAudio?: boolean;
        stabilization?: boolean;
        motionDetection?: boolean;
        autoCrop?: boolean;
        autoExposure?: boolean;
        outputFormat?: string;
        detailLevel?: string;
        textureCompression?: boolean;
        scanMode?: string;
    };
    meshroomProcess?: any;
    createdAt?: string;
    // Pause/Resume fields
    pausedAt?: string;
    lastStep?: string;
    lastProgress?: number;
}

const jobs: Record<string, Job> = {};

// === JOB PERSISTENCE ===
function saveJob(job: Job) {
    const jobFile = path.join(JOBS_DIR, job.id, "job.json");
    try {
        fs.writeFileSync(jobFile, JSON.stringify(job, null, 2));
    } catch (err) {
        console.error("Failed to save job", job.id, err);
    }
}

function loadJobs() {
    try {
        const jobDirs = fs.readdirSync(JOBS_DIR);
        console.log(`📂 Found ${jobDirs.length} job folders`);

        for (const jobId of jobDirs) {
            const jobDir = path.join(JOBS_DIR, jobId);
            const jobFile = path.join(jobDir, "job.json");

            // Check if it's a directory
            if (!fs.statSync(jobDir).isDirectory()) {
                continue;
            }

            if (fs.existsSync(jobFile)) {
                // Load existing job.json
                const jobData = JSON.parse(fs.readFileSync(jobFile, "utf-8"));
                jobs[jobId] = jobData;
                console.log(`✅ Loaded job ${jobId} (${jobData.status})`);
            } else {
                // Create job.json from folder contents
                console.log(`⚠️  Job ${jobId} missing job.json, creating from folder...`);

                const framesDir = path.join(jobDir, "frames");
                const outputDir = path.join(jobDir, "output");
                const objPath = path.join(outputDir, "texturedMesh.obj");

                // Determine status based on folder contents
                let status: JobStatus = "pending";
                let progress = 0;
                let step = "Unknown";

                if (fs.existsSync(objPath)) {
                    status = "done";
                    progress = 1;
                    step = "Completed";
                } else if (fs.existsSync(outputDir) && fs.readdirSync(outputDir).length > 0) {
                    status = "failed";
                    progress = 0.8;
                    step = "Reconstruction incomplete";
                } else if (fs.existsSync(framesDir) && fs.readdirSync(framesDir).length > 0) {
                    status = "paused";
                    progress = 0.3;
                    step = "Frames extracted";
                } else {
                    status = "pending";
                    progress = 0;
                    step = "Not started";
                }

                // Create job object
                const job: Job = {
                    id: jobId,
                    status: status,
                    step: step,
                    progress: progress,
                    videoPath: "", // Unknown
                    framesDir: framesDir,
                    outputDir: outputDir,
                    objPath: fs.existsSync(objPath) ? objPath : undefined,
                    createdAt: new Date().toISOString()
                };

                // Save to disk
                fs.writeFileSync(jobFile, JSON.stringify(job, null, 2));
                jobs[jobId] = job;
                console.log(`✅ Created job.json for ${jobId} (${status})`);
            }
        }

        console.log(`📊 Total jobs loaded: ${Object.keys(jobs).length}`);
    } catch (err) {
        console.error("Failed to load jobs", err);
    }
}

// Load existing jobs on startup
loadJobs();

const upload = multer({
    dest: UPLOADS_DIR,
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1 Go
});

app.get("/health", (_req, res) => {
    res.json({ ok: true });
});

// ============================================
// ROUTES DE CONFIGURATION IA (NOUVEAU)
// ============================================

// Obtenir la configuration IA actuelle
app.get("/ai/config", (_req, res) => {
    const config = getAIConfig();
    res.json({
        config,
        anyEnabled: isAnyAIEnabled()
    });
});

// Mettre à jour la configuration IA
app.post("/ai/config", express.json(), (req, res) => {
    try {
        const { setAIConfig, enableAllAI, disableAllAI } = require("./config/ai.config");

        if (req.body.enableAll) {
            enableAllAI();
            return res.json({ success: true, message: "All AI features enabled" });
        }

        if (req.body.disableAll) {
            disableAllAI();
            return res.json({ success: true, message: "All AI features disabled" });
        }

        setAIConfig(req.body);
        res.json({ success: true, config: getAIConfig() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ROUTE DE STATUT DES JOBS (NOUVEAU)
// ============================================

// Récupérer le statut d'un job
app.get("/jobs/:jobId/status", (req, res) => {
    const jobId = req.params.jobId;
    const job = jobs[jobId];

    if (!job) {
        return res.status(404).json({ error: "Job not found" });
    }

    res.json({
        jobId: job.id,
        status: job.status,
        progress: job.progress,
        step: job.step || "Initializing...",
        error: job.error,
        objPath: job.objPath,
        fbxPath: job.fbxPath
    });
});

// Récupérer tous les jobs
app.get("/jobs", (_req, res) => {
    const jobList = Object.values(jobs).map(job => ({
        jobId: job.id,
        status: job.status,
        progress: job.progress,
        step: job.step,
        canResume: job.status === "paused",
        pausedAt: job.pausedAt,
        objPath: job.objPath,
        fbxPath: job.fbxPath
    }));
    res.json({ jobs: jobList });
});

// Route Details Job (utilisé par le viewer)
app.get("/jobs/:jobId", (req, res) => {
    const jobId = req.params.jobId;
    const job = jobs[jobId];
    if (!job) return res.status(404).json({ error: "Not found" });

    // Construction de l'URL accessible
    // On suppose que Meshroom sort toujours "texturedMesh.obj" dans le dossier output
    const objUrl = `/results/${jobId}/output/texturedMesh.obj`;

    res.json({
        ...job,
        objUrl: objUrl
    });
});

// Route Viewer 3D
app.get("/viewer/:jobId", (req, res) => {
    // Return advanced viewer with all features
    res.sendFile(path.join(__dirname, "public", "viewer-advanced.html"));
});

// Route existante pour Video Upload (Legacy/Single Step)
// Route modifiée pour utiliser Multer (Upload standard)
app.post("/uploads", upload.single('video'), async (req: any, res) => {
    try {
        if (!req.file) {
            console.error("Upload error: No file received");
            return res.status(400).json({ error: "No video file provided" });
        }

        const jobId = Date.now().toString();
        // Multer a sauvegardé le fichier avec un nom temporaire dans UPLOADS_DIR
        // On le renomme proprement
        const videoFilename = `upload_${jobId}.mp4`;
        const videoPath = path.join(UPLOADS_DIR, videoFilename);

        try {
            fs.renameSync(req.file.path, videoPath);
        } catch (err) {
            // Fallback: copy and delete if rename fails (cross-device)
            fs.copyFileSync(req.file.path, videoPath);
            fs.unlinkSync(req.file.path);
        }

        console.log(`[Job ${jobId}] Upload complete: ${videoPath}`);

        const jobDir = path.join(JOBS_DIR, jobId);
        const framesDir = path.join(jobDir, "frames");
        const outputDir = path.join(jobDir, "output");

        try {
            fs.mkdirSync(framesDir, { recursive: true });
            fs.mkdirSync(outputDir, { recursive: true });

            jobs[jobId] = {
                id: jobId,
                status: "pending",
                progress: 0,
                videoPath,
                framesDir,
                outputDir,
                params: {
                    quality: req.body.quality || "high",
                    fps: parseInt(req.body.fps) || 5,
                    removeAudio: req.body.removeAudio === "true",
                    stabilization: req.body.stabilization === "true",
                    motionDetection: req.body.motionDetection === "true",
                    autoCrop: req.body.autoCrop === "true",
                    autoExposure: req.body.autoExposure === "true",
                    outputFormat: req.body.outputFormat || "obj",
                    detailLevel: req.body.detailLevel || "medium",
                    textureCompression: req.body.textureCompression === "true",
                    scanMode: req.body.scanMode || "object"
                }
            };

            saveJob(jobs[jobId]);

            console.log(`[Job ${jobId}] Triggering processing...`);
            processJob(jobId, "video").catch((err) => console.error("Job error:", err));

            res.json({ jobId });
        } catch (err: any) {
            console.error("Job setup error:", err);
            res.status(500).json({ error: "Job creation failed" });
        }
    } catch (e: any) {
        console.error("Server upload error:", e);
        res.status(500).json({ error: "Upload processing failed" });
    }
});

// === New Multi-Stage API for Photo Mode ===

// 1. Create Job
app.post("/jobs/create", (req, res) => {
    const jobId = Date.now().toString();
    const jobDir = path.join(JOBS_DIR, jobId);
    const framesDir = path.join(jobDir, "frames");
    const outputDir = path.join(jobDir, "output");

    try {
        fs.mkdirSync(framesDir, { recursive: true });
        fs.mkdirSync(outputDir, { recursive: true });

        jobs[jobId] = {
            id: jobId,
            status: "pending",
            step: "Ready for uploads",
            progress: 0,
            videoPath: "", // Not used in photo mode
            framesDir,
            outputDir,
        };
        console.log(`[Job ${jobId}] Created (Multi-stage)`);
        res.json({ jobId });
    } catch (err) {
        console.error("Job create error:", err);
        res.status(500).json({ error: "Failed to create job" });
    }
});

// 2. Upload File (Append to job)
// Uses query param ?filename=img1.jpg
app.post("/jobs/:id/upload", (req, res) => {
    const jobId = req.params.id;
    const job = jobs[jobId];
    if (!job) return res.status(404).json({ error: "Job not found" });

    const filename = req.query.filename as string || `file_${Date.now()}.jpg`;
    const targetPath = path.join(job.framesDir, filename);

    const writeStream = fs.createWriteStream(targetPath);
    req.pipe(writeStream);

    writeStream.on('finish', () => {
        console.log(`[Job ${jobId}] Received file: ${filename}`);
        res.json({ success: true, filename });
    });
    writeStream.on('error', (err) => {
        console.error("Upload error:", err);
        res.status(500).json({ error: "File write failed" });
    });
});

// 3. Start Processing
app.post("/jobs/:id/process", (req, res) => {
    const jobId = req.params.id;
    const job = jobs[jobId];
    if (!job) return res.status(404).json({ error: "Job not found" });

    console.log(`[Job ${jobId}] Starting Photo Mode processing`);
    processJob(jobId, "photo");
    res.json({ success: true, status: "processing" });
});

// 4. Pause Processing
app.post("/jobs/:jobId/pause", (req, res) => {
    const { jobId } = req.params;
    const job = jobs[jobId];

    if (!job) {
        return res.status(404).json({ error: "Job not found" });
    }

    if (job.status !== "running") {
        return res.status(400).json({ error: "Job is not running" });
    }

    console.log(`[Job ${jobId}] Pausing job...`);

    // Kill Meshroom process if running
    if (job.meshroomProcess) {
        try {
            job.meshroomProcess.kill('SIGTERM');
            console.log(`[Job ${jobId}] Meshroom process terminated`);
        } catch (err) {
            console.error(`[Job ${jobId}] Error killing process:`, err);
        }
    }

    // Save current state
    job.status = "paused";
    job.pausedAt = new Date().toISOString();
    job.lastStep = job.step || "Unknown";
    job.lastProgress = job.progress || 0;

    saveJob(job);

    console.log(`[Job ${jobId}] Job paused at step: ${job.lastStep}, progress: ${job.lastProgress}`);
    res.json({
        success: true,
        status: "paused",
        pausedAt: job.pausedAt,
        lastStep: job.lastStep,
        lastProgress: job.lastProgress
    });
});

// Route pour récupérer le statut d'un job spécifique
app.get("/jobs/:id", (req, res) => {
    const job = jobs[req.params.id];
    if (job) {
        res.json({
            id: job.id,
            status: job.status,
            progress: job.progress,
            step: job.step
        });
    } else {
        res.status(404).json({ error: "Job not found" });
    }
});

// 5. Resume Processing
app.post("/jobs/:jobId/resume", (req, res) => {
    const { jobId } = req.params;
    const job = jobs[jobId];

    if (!job) {
        return res.status(404).json({ error: "Job not found" });
    }

    if (job.status !== "paused") {
        return res.status(400).json({ error: "Job is not paused" });
    }

    console.log(`[Job ${jobId}] Resuming job from step: ${job.lastStep}, progress: ${job.lastProgress}`);

    // Restore state
    job.status = "running";
    job.step = job.lastStep || "Reconstruction";
    job.progress = job.lastProgress || 0;

    saveJob(job);

    // Resume processing
    processJob(jobId, "photo");

    res.json({
        success: true,
        status: "running",
        resumedFrom: job.lastStep,
        currentProgress: job.progress
    });
});

app.get("/jobs/:id", (req, res) => {
    const job = jobs[req.params.id];
    if (!job) {
        return res.status(404).json({ error: "Job not found" });
    }
    const { id, status, progress, objPath, fbxPath, error, step } = job;
    res.json({
        id,
        status,
        progress,
        objUrl: objPath ? `/results/${id}/${path.basename(objPath)}` : null,
        fbxUrl: fbxPath ? `/results/${id}/${path.basename(fbxPath)}` : null,
        error: error || null,
        step: step || null,
    });
});

app.get("/results/:jobId/:file", (req, res) => {
    const { jobId, file } = req.params;
    const job = jobs[jobId];
    if (!job) {
        return res.status(404).end();
    }
    const filePath = path.join(job.outputDir, file);
    if (!fs.existsSync(filePath)) {
        return res.status(404).end();
    }
    res.sendFile(filePath);
});

async function validatePhotos(framesDir: string) {
    console.log("Starting AI Validation...");
    const files = fs.readdirSync(framesDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    const ffmpegPath = "C:\\ffmpeg-8.0.1\\bin\\ffmpeg.exe";
    let removedCount = 0;

    for (const file of files) {
        const inputPath = path.join(framesDir, file);
        // Check brightness using signalstats
        const cmd = `"${ffmpegPath}" -i "${inputPath}" -vf signalstats -f null - 2>&1`;

        try {
            const { stdout } = await execAsync(cmd);
            // Parse YAVG (Luma Average) from output
            // FFmpeg usually outputs to stderr (redirected to stdout with 2>&1 or just captured depending on execAsync)
            // execAsync returns {stdout, stderr}. Node logic varies. Let's inspect output.
            // Assuming typical ffmpeg output: "YAVG=..."
            const match = stdout.match(/YAVG=([\d\.]+)/) || "";
            if (match && match[1]) {
                const brightness = parseFloat(match[1]);
                // Standard YAVG range 0-255. <40 is very dark.
                if (brightness < 40) {
                    console.log(`[Validation] Removing dark image: ${file} (Brightness: ${brightness.toFixed(1)})`);
                    try { fs.unlinkSync(inputPath); removedCount++; } catch (e) { }
                }
            }
        } catch (e) {
            // Ignore
        }
    }
    console.log(`AI Validation Complete. Removed ${removedCount} bad images.`);
}

async function enhancePhotos(framesDir: string) {
    console.log("Starting Smart Enhancement (FFmpeg)...");
    const files = fs.readdirSync(framesDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    const ffmpegPath = "C:\\ffmpeg-8.0.1\\bin\\ffmpeg.exe";

    for (const file of files) {
        const inputPath = path.join(framesDir, file);
        const tempPath = path.join(framesDir, "temp_" + file);

        // Filter: Unsharp Mask (sharpen) + EQ (contrast/brightness)
        // unsharp=5:5:1.0:5:5:0.0 (Strong sharpen)
        // eq=contrast=1.1:saturation=1.2 (Slight boost)
        const filter = "unsharp=5:5:0.8:3:3:0.0,eq=contrast=1.1:saturation=1.1";

        const cmd = `"${ffmpegPath}" -y -i "${inputPath}" -vf "${filter}" "${tempPath}"`;
        try {
            await execAsync(cmd);
            // Overwrite original with enhanced
            fs.unlinkSync(inputPath);
            fs.renameSync(tempPath, inputPath);
        } catch (e) {
            console.error("Failed to enhance " + file, e);
        }
    }
    console.log("Smart Enhancement Complete.");
}

async function processJob(jobId: string, mode: "video" | "photo" = "video") {
    const job = jobs[jobId];
    if (!job) return;

    job.status = "running";
    job.progress = 0.05;

    if (mode === "video") {
        job.step = "Extracting video frames...";

        // PARAMÈTRES D'OPTIMISATION
        const fps = job.params?.fps || 5;
        const removeAudio = job.params?.removeAudio ? "-an" : "";

        // Filtres FFmpeg
        let filters = [`fps=${fps}`];

        // 1. Qualité / Résolution
        if (job.params?.quality === "medium") {
            filters.push("scale=-1:480");
        } else if (job.params?.quality === "fast") {
            filters.push("scale=-1:360");
        } else {
            filters.push("scale=-1:720"); // Default High
        }

        // 2. Auto Exposure
        if (job.params?.autoExposure) {
            filters.push("eq=contrast=1.1:brightness=0.05");
        }

        // 3. Auto Crop (Placeholder - Center crop 90%)
        if (job.params?.autoCrop) {
            // filters.push("crop=in_w*0.9:in_h*0.9"); // Risqué sans preview
        }

        const filterGraph = `-vf "${filters.join(",")}"`;

        // 1) ffmpeg: extraction d'images
        const framesPattern = path.join(job.framesDir, "frame_%04d.jpg");
        const ffmpegPath = "C:\\ffmpeg-8.0.1\\bin\\ffmpeg.exe";

        // Construction dynamique de la commande
        const ffmpegCmd = `"${ffmpegPath}" -i "${job.videoPath}" ${removeAudio} ${filterGraph} "${framesPattern}"`;

        console.log("[Job", jobId, "] ffmpeg:", ffmpegCmd);
        console.log("[Job", jobId, "] Params:", JSON.stringify(job.params));

        try {
            await execAsync(ffmpegCmd);
        } catch (err) {
            console.error("ffmpeg error", err);
            job.status = "failed";
            job.error = "ffmpeg failed to extract frames";
            job.step = "Failed at frame extraction";
            return;
        }

        // 1.5) EXIF Injection (Fix Meshroom "missing focal length")
        job.step = "Injecting virtual camera EXIF...";
        try {
            await addExifToImages(job.framesDir);
        } catch (exifErr) {
            console.error("EXIF Injection failed:", exifErr);
            // Continue anyway? Meshroom might fail but let's try.
        }
    } else {
        job.step = "Verifying photo upload...";
        // Photo mode: Frames are already in framesDir
        // Verify we have images
        try {
            const files = fs.readdirSync(job.framesDir);
            const imageCount = files.filter(f => f.match(/\.(jpg|jpeg|png)$/i)).length;
            if (imageCount === 0) {
                job.status = "failed";
                job.error = "No images found in upload";
                job.step = "Failed: No images for processing";
                return;
            }
            console.log(`[Job ${jobId}] Photo processing: ${imageCount} images found.`);

            // === AI VALIDATION ===
            job.step = "AI Validating photos...";
            await validatePhotos(job.framesDir);

            // === SMART ENHANCE ===
            job.step = "AI Improving photos...";
            await enhancePhotos(job.framesDir);

            // ============================================
            // === PIPELINE IA AVANCÉ (NOUVEAU - OPTIONNEL) ===
            // ============================================
            if (isAnyAIEnabled()) {
                console.log(`[Job ${jobId}] Advanced AI pipeline enabled`);
                const aiConfig = getAIConfig();

                job.step = "Advanced AI Processing...";
                job.progress = 0.20;

                try {
                    const aiStats = await preprocessPhotos(job.framesDir, {
                        enableYOLO: aiConfig.objectDetection.enabled,
                        enableBlurDetection: aiConfig.blurDetection.enabled,
                        enableESRGAN: aiConfig.superResolution.enabled,
                        yoloConfidenceThreshold: aiConfig.objectDetection.confidenceThreshold,
                        blurThreshold: aiConfig.blurDetection.threshold,
                        esrganScale: aiConfig.superResolution.scale
                    });

                    console.log(`[Job ${jobId}] AI Stats:`, aiStats);
                } catch (aiError) {
                    console.error(`[Job ${jobId}] AI Pipeline error (non-fatal):`, aiError);
                    // Ne pas faire échouer le job si l'IA échoue
                }
            } else {
                console.log(`[Job ${jobId}] Advanced AI pipeline disabled`);
            }

        } catch (e) {
            job.status = "failed";
            job.error = "Failed to access frame directory";
            return;
        }
    }

    job.progress = 0.25;
    job.step = "Reconstructing 3D Model (Meshroom)...";

    // 2) Meshroom: photogrammétrie
    // Utilisation du chemin absolu pour éviter les problèmes de PATH
    const meshroomPath = "C:\\Meshroom-2023.3.0\\meshroom_batch.exe";
    const meshroomCmd = `"${meshroomPath}" --input "${job.framesDir}" --output "${job.outputDir}" ` +
        `--param FeatureExtraction.describerPreset="ultra" ` +
        `--param FeatureExtraction.describerQuality="ultra" ` +
        `--param FeatureMatching.describerTypes="sift" ` +
        `--param Meshing.estimateSpaceFromSfM="true" ` +
        `--param Meshing.maxInputPoints="50000000" ` +
        `--param Meshing.maxPoints="5000000" ` +
        `--param MeshFiltering.keepLargestMeshOnly="true" ` +
        `--param Texturing.textureFileType="png" ` +
        `--param Texturing.outputTextureFileType="png" ` +
        `--param Texturing.textureSide="8192" ` +
        `--param Texturing.downscale="1"`;

    console.log("[Job", jobId, "] meshroom:", meshroomCmd);
    try {
        await execAsync(meshroomCmd);
    } catch (err: any) {
        console.error("meshroom error", err);
        job.status = "failed";
        job.step = "Failed during 3D reconstruction";
        job.error = "meshroom processing failed";
        return;
    }

    job.progress = 0.9;
    job.step = "Finalizing output files...";

    // 3) Détection des fichiers OBJ/FBX
    const files = fs.readdirSync(job.outputDir);
    const obj = files.find((f) => f.toLowerCase().endsWith(".obj"));
    const fbx = files.find((f) => f.toLowerCase().endsWith(".fbx"));

    if (obj) job.objPath = path.join(job.outputDir, obj);
    if (fbx) job.fbxPath = path.join(job.outputDir, fbx);

    job.progress = 1;
    job.status = "done";
    job.step = "Completed";
    saveJob(job);
}

// ============================================
// GAME EDITOR ROUTES
// ============================================

// Serve game editor
app.get("/editor", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "gameplan", "game-editor.html"));
});

// API: List all available FBX models
app.get("/api/models", (req, res) => {
    try {
        const models: any[] = [];

        // Scan all job folders for FBX files
        const jobDirs = fs.readdirSync(JOBS_DIR);

        for (const jobId of jobDirs) {
            const outputDir = path.join(JOBS_DIR, jobId, "output");

            if (fs.existsSync(outputDir)) {
                const files = fs.readdirSync(outputDir);
                const fbxFiles = files.filter(f => f.toLowerCase().endsWith('.fbx'));

                fbxFiles.forEach(fbxFile => {
                    models.push({
                        id: `${jobId}_${fbxFile}`,
                        name: fbxFile.replace('.fbx', ''),
                        path: `/data/jobs/${jobId}/output/${fbxFile}`,
                        jobId: jobId,
                        type: 'model'
                    });
                });
            }
        }

        console.log(`📦 Found ${models.length} FBX models`);
        res.json({ models });
    } catch (err) {
        console.error("Failed to list models:", err);
        res.status(500).json({ error: "Failed to list models" });
    }
});

// API: Get animations for a specific model
app.get("/api/animations/:jobId", (req, res) => {
    try {
        const { jobId } = req.params;
        const outputDir = path.join(JOBS_DIR, jobId, "output");

        if (!fs.existsSync(outputDir)) {
            return res.status(404).json({ error: "Job not found" });
        }

        const files = fs.readdirSync(outputDir);
        const fbxFiles = files.filter(f => f.toLowerCase().endsWith('.fbx'));

        const animations = fbxFiles.map(fbxFile => ({
            name: fbxFile.replace('.fbx', ''),
            path: `/data/jobs/${jobId}/output/${fbxFile}`
        }));

        res.json({ animations });
    } catch (err) {
        console.error("Failed to get animations:", err);
        res.status(500).json({ error: "Failed to get animations" });
    }
});

async function addExifToImages(framesDir: string) {
    console.log(`[EXIF] Injecting fake camera data into files in ${framesDir}`);
    const files = fs.readdirSync(framesDir).filter(f => f.match(/\.(jpg|jpeg)$/i));

    for (const file of files) {
        const filePath = path.join(framesDir, file);
        const imageBuffer = fs.readFileSync(filePath);
        const imageString = imageBuffer.toString("binary");

        const zeroth: any = {};
        const exif: any = {};
        const gps: any = {};

        // Make & Model (Virtual Camera)
        zeroth[piexif.ImageIFD.Make] = "SolarScan";
        zeroth[piexif.ImageIFD.Model] = "VirtualCam";

        // Focal Length (Estimate: 24mm equivalent)
        // Ratio is usually numerator/denominator
        exif[piexif.ExifIFD.FocalLength] = [24, 1];
        exif[piexif.ExifIFD.FNumber] = [28, 10]; // f/2.8

        const exifObj = { "0th": zeroth, "Exif": exif, "GPS": gps };
        const exifBytes = piexif.dump(exifObj);

        const newImageString = piexif.insert(exifBytes, imageString);
        const newImageBuffer = Buffer.from(newImageString, "binary");

        fs.writeFileSync(filePath, newImageBuffer);
    }
    console.log(`[EXIF] Completed for ${files.length} images.`);
}

import { initDb } from "./config/db";

app.listen(Number(port), "0.0.0.0", async () => {
    console.log(`SolarScan backend listening on port ${port} (0.0.0.0)`);
    await initDb();
});
