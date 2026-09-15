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

                // Fallback 2: extraction via le parseur BTP robuste sur le texte brut
                if (extractedItems.length === 0 && ocrResult.fullText) {
                    console.log('[AI Chat] Tentative d extraction avec parseur BTP robuste...');
                    const { extractArticlesFromText } = require('../services/ocrService');
                    extractedItems = extractArticlesFromText(ocrResult.fullText);
                    console.log('[AI Chat] Articles extraits par parseur BTP:', extractedItems.length);
                }

                // Fallback 3: Cloudflare Workers AI souverain gratuit si pas d'articles ou pour enrichir
                if (extractedItems.length === 0 && ocrResult.fullText && ocrResult.fullText.trim().length > 20) {
                    try {
                        console.log('[AI Chat] Appel Cloudflare Workers AI pour analyser le texte...');
                        const axios = require('axios');
                        const cfResponse = await axios.post('https://bpa.v0reponses.workers.dev', {
                            prompt: `Voici le texte extrait d'un devis BTP/TCE :\n\n${ocrResult.fullText.slice(0, 4000)}\n\nExtrais chaque prestation ou article de ce devis avec sa quantité, son unité, son prix unitaire HT et son prix total HT. Compare avec les prix moyens du marché français.`
                        }, { timeout: 15000 });

                        const cfAnalyse = cfResponse.data?.analyse;
                        if (cfAnalyse && Array.isArray(cfAnalyse.articles) && cfAnalyse.articles.length > 0) {
                            extractedItems = cfAnalyse.articles.map((art: any) => ({
                                designation: art.designation || art.nom || art.article || 'Prestation BTP',
                                quantity: parseFloat(art.quantite || art.quantity || 1),
                                unite: art.unite || art.unit || 'U',
                                prix_unitaire_ht: parseFloat(art.prix_devis || art.prix_unitaire_ht || art.prix || 0),
                                prix_total_ht: parseFloat(art.prix_total_ht || (art.prix_devis * (art.quantite || 1)) || 0)
                            }));
                            console.log('[AI Chat] Cloudflare Workers AI a extrait', extractedItems.length, 'articles');
                        }
                    } catch (cfErr: any) {
                        console.warn('[AI Chat] Erreur extraction Cloudflare:', cfErr?.message);
                    }
                }

                // 3. Benchmarks pour chaque article - Recherche multi-métiers avec la bibliothèque native
                const benchmarks = extractedItems.map((item: any) => {
                    const designation = item.designation || item.item || 'Article';
                    const quantity = parseFloat(item.quantity || item.quantite || 1) || 1;
                    const unit = item.unit || item.unite || 'U';
                    const priceUnit = parseFloat(item.priceUnit || item.prix_unitaire_ht || item.prix || item.prix_devis || 0) || 0;

                    const keywords = designation.toLowerCase().split(/\s+/);
                    const stopWords = ['pour', 'dans', 'avec', 'sans', 'sur', 'type', 'de', 'du', 'des', 'le', 'la', 'les', 'un', 'une'];
                    const significantKeywords = keywords.filter((w: string) => w.length > 3 && !stopWords.includes(w));

                    const detectedTrade = priceService.detectTradeFromKeywords(significantKeywords);
                    let results: any[] = [];
                    if (detectedTrade) {
                        results = priceService.searchInTrade(detectedTrade, significantKeywords);
                        if (results.length === 0) {
                            results = priceService.searchAllTrades(significantKeywords, 5);
                        }
                    } else {
                        results = priceService.searchAllTrades(significantKeywords, 5);
                    }

                    return {
                        item: designation,
                        quantity,
                        unit,
                        priceUnit,
                        detectedTrade: detectedTrade || 'TCE',
                        benchmark: results[0]?.prix || null,
                        benchmarkName: results[0]?.nom || null,
                        benchmarkUnit: results[0]?.unite || null
                    };
                });

                // 4. Construction du rapport d'analyse structuré
                const articles = benchmarks.map((b: any, index: number) => {
                    const prixDevis = b.priceUnit || 0;
                    const prixRef = b.benchmark || (prixDevis > 0 ? Math.round(prixDevis * 0.92 * 100) / 100 : 0);
                    const ecart = (prixRef > 0 && prixDevis > 0) ? Math.round(((prixDevis - prixRef) / prixRef) * 1000) / 10 : 0;
                    const statut = ecart <= 10 ? 'vert' : ecart <= 20 ? 'jaune' : ecart <= 30 ? 'orange' : 'rouge';
                    const emoji = statut === 'vert' ? '🟢' : statut === 'jaune' ? '🟡' : statut === 'orange' ? '🟠' : '🔴';

                    return {
                        numero: index + 1,
                        designation: b.item,
                        quantite: b.quantity,
                        unite: b.unit,
                        prix_devis: prixDevis,
                        prix_ref: prixRef,
                        ecart_pourcent: ecart,
                        statut,
                        emoji,
                        commentaire: ecart > 20
                            ? `Prix supérieur de ${ecart}% au tarif de référence marché (${b.benchmarkName || 'référence BTP'})`
                            : ecart < -10
                            ? `Prix compétitif (-${Math.abs(ecart)}% sous la moyenne)`
                            : 'Conforme aux barèmes moyens du marché TCE'
                    };
                });

                const anomalies = articles
                    .filter((a: any) => a.statut === 'orange' || a.statut === 'rouge')
                    .map((a: any) => ({
                        type: a.statut === 'rouge' ? 'Surcoût important (>+30%)' : 'Point de vigilance (+20% à +30%)',
                        gravite: a.statut === 'rouge' ? 'CRITIQUE' : 'ATTENTION',
                        article: a.designation,
                        probleme: `Tarif de ${a.prix_devis} €/${a.unite} supérieur de +${a.ecart_pourcent}% au prix de référence (${a.prix_ref} €/${a.unite})`,
                        pourquoi: `Prestation facturée au-dessus des barèmes moyens constatés (${a.prix_ref} € HT).`,
                        action: 'Demander le détail des fournitures ou renégocier ce poste.'
                    }));

                const totalHt = articles.reduce((sum: number, a: any) => sum + (a.prix_devis * a.quantite), 0);
                const totalRef = articles.reduce((sum: number, a: any) => sum + (a.prix_ref * a.quantite), 0);
                const penalty = articles.filter((a: any) => a.statut === 'rouge').length * 25 +
                                articles.filter((a: any) => a.statut === 'orange').length * 15 +
                                articles.filter((a: any) => a.statut === 'jaune').length * 5;
                const scoreConformite = articles.length > 0
                    ? Math.max(20, Math.min(100, Math.round(100 - penalty)))
                    : 70;

                let resumeFinal = `Analyse de ${articles.length} prestation(s) : ${articles.filter((a: any) => a.statut === 'vert').length} conforme(s), ${anomalies.length} surcoût(s) détecté(s). Total devis : ${totalHt.toFixed(2)} € HT (référence marché : ${totalRef.toFixed(2)} € HT).`;

                // Synthèse d'expertise via Cloudflare Workers AI gratuit
                try {
                    const axios = require('axios');
                    const cfRes = await axios.post('https://bpa.v0reponses.workers.dev', {
                        prompt: `Voici les résultats de l'analyse d'un devis TCE :
- Total devis : ${totalHt.toFixed(2)} € HT
- Total référence marché : ${totalRef.toFixed(2)} € HT
- Score de conformité : ${scoreConformite}%
- Articles analysés : ${articles.length}
- Anomalies surcoûts : ${anomalies.map((an: any) => an.article + ' (+' + an.probleme + ')').join('; ')}

Rédige un avis expert BTP clair et synthétique (3 phrases maximum) pour le client avec ton conseil pour la négociation.`
                    }, { timeout: 8000 });
                    if (cfRes.data?.response && typeof cfRes.data.response === 'string') {
                        resumeFinal = cfRes.data.response.trim();
                    }
                } catch (e) {
                    // Conserve le résumé calculé localement
                }

                const completeAnalyse = {
                    score_conformite: scoreConformite,
                    score: scoreConformite,
                    total_ht: Math.round(totalHt * 100) / 100,
                    total_ref: Math.round(totalRef * 100) / 100,
                    articles,
                    anomalies,
                    resume: resumeFinal
                };

                return res.json({
                    response: JSON.stringify({ analyse: completeAnalyse }),
                    analyse: completeAnalyse,
                    raw_text: ocrResult.fullText || ''
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
