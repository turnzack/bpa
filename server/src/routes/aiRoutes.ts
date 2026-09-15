import express from 'express';
import multer from 'multer';
import { gemmaLocalService } from '../services/GemmaLocalService';
import { priceService, PriceArticle } from '../services/PriceService';
import { scanPaymentService } from '../services/scanPaymentService';
import path from 'path';
import fs from 'fs';
import { masterSupabase } from '../config/supabase';
import { User } from '@supabase/supabase-js';

// jsonrepair - dynamically imported to avoid module resolution issues
let jsonrepair: (text: string) => string;
try {
    const jr = require('jsonrepair');
    jsonrepair = jr.jsonrepair || jr;
} catch (e) {
    console.warn('[AI Routes] jsonrepair not available, JSON repair disabled');
    jsonrepair = (text: string) => text;
}

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(express.json());

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kirov5-fallback-secret-key-32chars!';

// Middleware to authenticate user (supports both Supabase Auth and Neon JWT)
const authenticateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authHeader = req.headers.authorization || '';

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }

        const token = authHeader.replace('Bearer ', '').trim();

        // 1. Tenter via Supabase Auth
        try {
            const { data: { user }, error: authError } = await masterSupabase.auth.getUser(token);
            if (user && !authError) {
                req.user = user;
                return next();
            }
        } catch (e) {
            // Continuer vers la validation locale
        }

        // 2. Tenter via JWT local (Neon / Kirov5)
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            if (decoded) {
                req.user = {
                    id: decoded.userId || decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    app_metadata: {},
                    user_metadata: {},
                    aud: 'authenticated',
                    created_at: new Date().toISOString()
                } as any;
                return next();
            }
        } catch (e) {
            // Échec des deux
        }

        return res.status(401).json({ error: 'Invalid token' });
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

router.post('/chat', authenticateUser, upload.single('file'), async (req: any, res: any) => {
    // Timeout étendu pour l'IA locale (5 minutes)
    res.setTimeout(5 * 60 * 1000);

    try {
        const { message, scanId } = req.body;
        const file = req.file;
        const user = req.user;

        // Check payment for scans
        if (file && scanId && user?.id) {
            const paymentCheck = await scanPaymentService.checkScanPayment(scanId, user.id);
            if (!paymentCheck.paid) {
                return res.status(402).json({
                    error: 'Payment required',
                    message: 'Veuillez effectuer le paiement de 1.99€ pour analyser ce document.',
                    scanId: scanId,
                    requiresPayment: true
                });
            }
        }

        let responseText = "";

        if (file) {
            // Document Analysis Mode (BPA)
            responseText = `J'ai bien reçu votre document "${file.originalname}". Analyse en cours via BPA...\n\n`;

            try {
                // 1. OCR sur le document
                const { processInvoiceOCR } = require('../services/ocrService');
                const ocrResult = await processInvoiceOCR(file.buffer, file.mimetype);
                
                console.log('[AI Chat] OCR Provider:', ocrResult.provider);
                console.log('[AI Chat] Articles extracted:', ocrResult.articles?.length || 0);

                // 2. Récupérer les articles extraits par l'OCR
                let extractedItems = ocrResult.articles || [];

                // Fallback: extraction depuis parsed.fields si articles n'existe pas
                if (extractedItems.length === 0 && ocrResult.fields?.articles) {
                    extractedItems = ocrResult.fields.articles;
                }

                // Fallback 2: extraction basique depuis le texte OCR si pas d'articles
                if (extractedItems.length === 0) {
                    console.log('[AI Chat] No structured articles found, trying regex extraction...');
                    const text = ocrResult.fullText || '';
                    const lines = text.split('\n');
                    for (const line of lines) {
                        // Pattern plus flexible pour extraire les lignes de prix
                        const match = line.match(/(.{10,50}?)\s+(\d+(?:[.,]\d+)?)\s*(m2|m²|m|U|ml|kg|L|h|forfait)?\s*(?:prix\s*unitaire)?\s*([\d,.]+)\s*€/i);
                        if (match) {
                            extractedItems.push({
                                designation: match[1].trim(),
                                quantity: parseFloat(match[2].replace(',', '.')),
                                unit: match[3] || 'U',
                                priceUnit: parseFloat(match[4].replace(',', '.'))
                            });
                        }
                    }
                    console.log('[AI Chat] Regex extracted items:', extractedItems.length);
                }

                // Si toujours pas d'articles, utiliser le texte brut pour l'IA
                if (extractedItems.length === 0) {
                    console.log('[AI Chat] No items extracted, sending full text to AI');
                }

                // 3. Benchmarks pour chaque article - Recherche INTELLIGENTE multi-métiers
                const benchmarks = extractedItems.map((item: any) => {
                    const keywords = item.designation ? item.designation.toLowerCase().split(/\s+/) : [];
                    
                    // Filtrer les mots non significatifs
                    const stopWords = ['pour', 'dans', 'avec', 'sans', 'sur', 'type', 'de', 'du', 'des', 'le', 'la', 'les', 'un', 'une'];
                    const significantKeywords = keywords.filter((w: string) => w.length > 3 && !stopWords.includes(w));
                    
                    // 1. Détecter le métier pertinent
                    const detectedTrade = priceService.detectTradeFromKeywords(significantKeywords);
                    
                    // 2. Chercher dans le métier détecté OU dans tous les métiers
                    let results = [];
                    if (detectedTrade) {
                        results = priceService.searchInTrade(detectedTrade, significantKeywords);
                        // Si pas de résultats, chercher partout
                        if (results.length === 0) {
                            results = priceService.searchAllTrades(significantKeywords, 5);
                        }
                    } else {
                        results = priceService.searchAllTrades(significantKeywords, 5);
                    }
                    
                    return {
                        item: item.designation,
                        quantity: item.quantity,
                        unit: item.unit,
                        priceUnit: item.priceUnit,
                        detectedTrade: detectedTrade || 'non détecté',
                        benchmark: results[0]?.prix || null,
                        benchmarkName: results[0]?.nom || null,
                        benchmarkUnit: results[0]?.unite || null,
                        allBenchmarks: results.slice(0, 3).map((r: any) => ({
                            nom: r.nom,
                            prix: r.prix,
                            unite: r.unite
                        }))
                    };
                });

                // 4. Prompt IA structuré pour l'analyse EXPERT - FORMAT JSON
                const systemPrompt = `Vous êtes un expert en bâtiment avec 20+ ans d'expérience (BPA - Bâtiment Prix Assistant).

Votre mission : Analyser un devis et retourner les résultats en JSON STRICT.

IMPORTANT : Retournez UNIQUEMENT du JSON valide, sans texte avant ou après.

Structure JSON attendue :
{
  "analyse": {
    "articles": [
      {
        "numero": 1,
        "designation": "Nom de l'article",
        "quantite": 10.5,
        "unite": "m²",
        "prix_devis": 45.50,
        "prix_ref": 40.00,
        "ecart_pourcent": 13.75,
        "statut": "vert" | "jaune" | "orange" | "rouge",
        "emoji": "🟢" | "🟡" | "🟠" | "🔴",
        "analyse_expert": "Commentaire court"
      }
    ],
    "anomalies": [
      {
        "gravite": "CRITIQUE" | "ATTENTION" | "VERIFICATION",
        "emoji": "🔴" | "🟠" | "🟡",
        "article": "Nom article",
        "probleme": "Description",
        "pourquoi": "Explication",
        "action": "Action recommandée"
      }
    ],
    "estimation_globale": {
      "main_oeuvre_devis": 1000.00,
      "main_oeuvre_marche": 900.00,
      "materiaux_devis": 2000.00,
      "materiaux_marche": 1800.00,
      "total_ht_devis": 3000.00,
      "total_ht_marche": 2700.00,
      "ecart_euros": 300.00,
      "ecart_pourcent": 11.1,
      "tva_taux": 20,
      "tva_montant": 600.00,
      "total_ttc_devis": 3600.00,
      "total_ttc_marche": 3240.00,
      "appreciation": "Cher" | "Correct" | "Bon marché"
    },
    "verdict": {
      "global": "🟢" | "🟠" | "🔴",
      "recommandation": "Bon pour accord" | "Attention nécessaire" | "À renégocier",
      "confiance": 75,
      "potentiel_negociation_euros": 250.00,
      "justification": ["Argument 1", "Argument 2", "Argument 3"],
      "recommandation_principale": "Conseil principal"
    },
    "questions_verifications": [
      {
        "type": "Question" | "Vérification" | "Alternative",
        "emoji": "❓" | "✅" | "💡",
        "texte": "Question ou vérification",
        "pourquoi": "Raison",
        "priorite": "Haute" | "Moyenne" | "Faible"
      }
    ],
    "resume": {
      "nombre_articles": 12,
      "articles_vert": 5,
      "articles_jaune": 3,
      "articles_orange": 2,
      "articles_rouge": 2,
      "ecart_global_pourcent": 11.1,
      "ecart_global_euros": 300.00,
      "note_globale": 72,
      "recommandation": "✅ Accepter" | "⚠️ Négocier" | "❌ Refuser",
      "synthese": ["Situation", "Problème", "Action"]
    }
  }
}

Règles :
- Tous les prix avec 2 décimales
- Pourcentages avec 1 décimale
- Statuts: vert (≤10%), jaune (10-20%), orange (20-30%), rouge (>30%)
- Si information manquante: null ou "Non spécifié"`;

                const itemsJson = JSON.stringify(extractedItems, null, 2);
                const benchmarksJson = JSON.stringify(benchmarks, null, 2);

                let userPrompt;
                
                if (extractedItems.length > 0) {
                    userPrompt = `Voici les articles extraits du devis :
${itemsJson}

Voici les prix de référence (benchmark) trouvés :
${benchmarksJson}

Pour chaque article, compare les prix et génère le JSON d'analyse.`;
                } else {
                    const fullText = ocrResult.fullText || '(Aucun texte extrait)';
                    userPrompt = `Texte extrait du document :
---
${fullText}
---

Analyse ce texte et génère le JSON d'analyse.`;
                }

                // 5. SOUVERAINETÉ TOTALE : Le PC assemble le dossier, le téléphone réfléchit.
                console.log(`[AI Chat] PC Gemma bypassé (l'analyse se fera sur le téléphone avec Gemma)`);
                
                return res.json({
                    response: userPrompt,  // Le dossier avec Devis + Prix du marché
                    analyse: null,         // Laissé vierge pour le Mobile
                    raw_text: userPrompt   // Idem
                });

            } catch (aiError) {
                console.error("AI Analysis failed:", aiError);
                return res.json({ 
                    response: "Erreur lors de l'analyse.",
                    raw_text: "Impossible d'extraire le texte."
                });
            }

        } else if (message) {
            // Mode conversationnel enrichi
            try {
                const systemPrompt = `Tu es l'IA du projet FactureScan (BPA). Tes fonctionnalités :
1. Analyse de devis (scan ou upload), extraction des articles, quantités, prix.
2. Comparaison des prix avec la bibliothèque de référence.
3. Audit et verdict (Bon pour accord, points d'attention).
4. Explications et conseils pour utilisateurs non experts.
5. Réponses à toutes questions sur les devis, travaux, ou fonctionnement de l'app.

Quand tu reçois une question, donne une réponse claire, structurée, et adaptée au niveau de l'utilisateur.`;

                const userPrompt = message;
                const aiReply = await gemmaLocalService.chat(`${systemPrompt}\n\n${userPrompt}`);
                responseText = aiReply;

            } catch (aiError) {
                responseText = `Vous avez dit : "${message}". (Note: Le service IA est actuellement indisponible, je reviens vers vous dès que possible).`;
            }
        }

        return res.json({
            response: responseText
        });

    } catch (error) {
        console.error('Error in /chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initiate scan with payment
router.post('/initiate-scan', authenticateUser, async (req: any, res: any) => {
    try {
        const user = req.user;

        if (!user?.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const scanId = await scanPaymentService.createScanId();
        await scanPaymentService.recordScanAttempt(scanId, user.id);

        res.json({
            scanId,
            message: 'Scan initié. Procédez au paiement pour continuer.',
            paymentRequired: true
        });
    } catch (error) {
        console.error('Error initiating scan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// New Mistral route for quote generation
router.post('/mistral/generate-quote', async (req, res) => {
    try {
        const { prompt, model = 'small' } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const { mistralService } = await import('../services/mistralService');
        const result = await mistralService.generateQuote(prompt, model);

        if (result.success) {
            res.json({ content: result.content });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in /mistral/generate-quote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 🛰️ [BRIDGE DIAMOND] Streaming du cerveau Gemma vers le mobile
 */
router.get('/brain', async (req, res) => {
    // Le modèle est attendu dans server/models/gemma-2b-it.gguf
    // Remplacement de process.cwd() par __dirname qui est 100% fiable peu importe d'où on lance le launcher
    const brainPath = path.join(__dirname, '../../models/gemma-2b-it.gguf');
    
    if (!fs.existsSync(brainPath)) {
        return res.status(404).json({ 
            error: "Cerveau introuvable sur le serveur.",
            instruction: "Veuillez copier gemma-2b-it.gguf dans le dossier 'server/models/'",
            pathAtempted: brainPath
        });
    }

    const stats = fs.statSync(brainPath);
    const totalSize = stats.size;

    console.info(`🧠 [BACKEND] Debut du transfert de Gemma (${(totalSize / 1024 / 1024).toFixed(2)} Mo)...`);
    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', totalSize.toString());
    res.setHeader('Content-Disposition', 'attachment; filename="gemma-2b-it.gguf"');

    const readStream = fs.createReadStream(brainPath);
    readStream.pipe(res);

    readStream.on('end', () => {
        console.info("✅ [BACKEND] Conscience Gemma transmise avec succès !");
    });
});

/**
 * 📚 [BRIDGE DIAMOND] Envoi de la bibliothèque de prix souveraine
 */
router.get('/data/library', async (req, res) => {
    const libraryPath = path.resolve(process.cwd(), '../mobile/assets/library.json');
    if (!fs.existsSync(libraryPath)) {
        return res.status(404).json({ error: "Bibliothèque introuvable." });
    }
    
    console.info("📚 [BACKEND] Envoi de la bibliothèque de prix...");
    res.sendFile(libraryPath);
});

export default router;
