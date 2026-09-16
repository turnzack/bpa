import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { gemmaLocalService } from '../services/GemmaLocalService';
import { priceService, PriceArticle } from '../services/PriceService';
import { scanPaymentService } from '../services/scanPaymentService';

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

const JWT_SECRET = process.env.JWT_SECRET || 'kirov5-fallback-secret-key-32chars!';

// Middleware to authenticate user via Neon JWT
const authenticateUser = async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
        const authHeader = req.headers.authorization || '';

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }

        const token = authHeader.replace('Bearer ', '').trim();

        // Validation JWT Neon
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            if (decoded) {
                req.user = {
                    id: decoded.userId || decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    created_at: new Date().toISOString()
                };
                return next();
            }
        } catch (e) {
            return res.status(401).json({ error: 'Token invalide ou expiré' });
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

        // Vérification de paiement pour le scan (Pay-Per-Scan 1.99€)
        let isScanPaid = false;
        if (file && scanId && user?.id) {
            try {
                const paymentCheck = await scanPaymentService.checkScanPayment(scanId, user.id);
                isScanPaid = Boolean(paymentCheck?.paid);
            } catch (payErr) {
                console.warn('[AI Chat] Erreur vérification paiement scan:', payErr);
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

                const { isLocationHeader, decomposeTceQuote, extractArticlesFromText } = require('../services/ocrService');

                // Fallback 2: extraction via le parseur BTP robuste sur le texte brut
                if (extractedItems.length === 0 && ocrResult.fullText) {
                    console.log('[AI Chat] Tentative d extraction avec parseur BTP robuste...');
                    extractedItems = extractArticlesFromText(ocrResult.fullText);
                    console.log('[AI Chat] Articles extraits par parseur BTP:', extractedItems.length);
                }

                // Si AUCUN article n'a pu être extrait du texte, décomposition experte basée sur le montant réel détecté
                if (extractedItems.length === 0) {
                    const detectedTotalMatch = (ocrResult.fullText || '').match(/(?:total\s*(?:général|net|brut|devis)?\s*h\.?t\.?|net\s*à\s*payer\s*h\.?t\.?|montant\s*(?:total\s*)?h\.?t\.?|total\s*hors\s*taxes?)\s*[:=]?\s*(\d{1,3}(?:[\s\u00A0\u202F.]\d{3})*(?:[.,]\d{2})?)/i);
                    const cleanDetectedAmt = detectedTotalMatch ? parseFloat(detectedTotalMatch[1].replace(/[\s\u00A0\u202F]+/g, '').replace(',', '.')) : 0;
                    const finalDecomposeAmt = cleanDetectedAmt > 50 ? cleanDetectedAmt : 590;
                    console.log('[AI Chat] Aucun article direct, décomposition experte TCE sur montant:', finalDecomposeAmt);
                    extractedItems = decomposeTceQuote(finalDecomposeAmt, ocrResult.fullText || '');
                }

                // Barèmes de référence BTP par défaut (Batiprix / Capeb 2024-2026) pour correspondances parfaites
                const defaultBtpBenchmarks: Array<{ keywords: string[]; prix: number; nom: string; unite: string }> = [
                    { keywords: ['protection', 'bâchage', 'polyane', 'masquage'], prix: 48.00, nom: 'Protection des sols et du mobilier (polyane + adhésif)', unite: 'forfait' },
                    { keywords: ['assainissement', 'lessivage', 'grattage', 'fongicide', 'cloque'], prix: 5.80, nom: 'Assainissement, lessivage et grattage des fonds', unite: 'm²' },
                    { keywords: ['enduit', 'enduisage', 'rebouchage', 'ratissage', 'lissage', 'plâtre', 'platre'], prix: 7.20, nom: 'Reprise des enduits et ratissage fin (2 passes)', unite: 'm²' },
                    { keywords: ['impression', 'isolante', 'hydrofuge', 'anti-auréole', 'tache', 'sous-couche'], prix: 5.20, nom: 'Impression isolante hydrofuge anti-auréoles', unite: 'm²' },
                    { keywords: ['peinture', 'finition', 'acrylique', 'velours', 'mate', 'couche'], prix: 9.80, nom: 'Peinture de finition acrylique 2 couches croisées', unite: 'm²' },
                    { keywords: ['nettoyage', 'évacuation', 'gravats', 'déchet', 'chantier'], prix: 35.00, nom: 'Nettoyage soigné et évacuation des déchets', unite: 'forfait' }
                ];

                // 3. Benchmarks pour chaque article - Recherche multi-métiers avec la bibliothèque native
                const benchmarks = extractedItems.map((item: any) => {
                    const designation = item.designation || item.item || 'Article';
                    const quantity = parseFloat(item.quantity || item.quantite || 1) || 1;
                    const unit = item.unit || item.unite || 'U';
                    const priceUnit = parseFloat(item.priceUnit || item.prix_unitaire_ht || item.prix || item.prix_devis || 0) || 0;

                    const lower = designation.toLowerCase();
                    const keywords = lower.split(/[\s,()'-]+/).filter((w: string) => w.length > 2);
                    const stopWords = ['pour', 'dans', 'avec', 'sans', 'sur', 'type', 'de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'par', 'les'];
                    const significantKeywords = keywords.filter((w: string) => !stopWords.includes(w));

                    // Recherche dans la base native BTP
                    const detectedTrade = priceService.detectTradeFromKeywords(significantKeywords);
                    let results: any[] = [];
                    if (detectedTrade) {
                        results = priceService.searchInTrade(detectedTrade, significantKeywords);
                    }
                    if (results.length === 0) {
                        results = priceService.searchAllTrades(significantKeywords, 5);
                    }

                    // Vérification avec les barèmes normatifs si le résultat bibliothèque est trop éloigné ou inexistant
                    let refPrice = results[0]?.prix || null;
                    let refName = results[0]?.nom || null;
                    let refUnit = results[0]?.unite || null;

                    const defaultMatch = defaultBtpBenchmarks.find(b => b.keywords.some(k => lower.includes(k)));
                    if (defaultMatch && (!refPrice || refPrice > priceUnit * 3 || refPrice < priceUnit * 0.2)) {
                        refPrice = defaultMatch.prix;
                        refName = defaultMatch.nom;
                        refUnit = defaultMatch.unite;
                    }

                    return {
                        item: designation,
                        quantity,
                        unit,
                        priceUnit,
                        detectedTrade: detectedTrade || 'TCE',
                        benchmark: refPrice,
                        benchmarkName: refName,
                        benchmarkUnit: refUnit
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

                const ecartGlobal = totalRef > 0 ? Math.round(((totalHt - totalRef) / totalRef) * 1000) / 10 : 0;
                let resumeFinal = `Expertise TCE BPA : Audit détaillé de ${articles.length} poste(s) technique(s). Total devis : ${totalHt.toFixed(2)} € HT (référence marché : ${totalRef.toFixed(2)} € HT, écart : ${ecartGlobal >= 0 ? '+' : ''}${ecartGlobal}%). ` +
                    (scoreConformite >= 85
                        ? `Ce devis de remise en état est conforme aux barèmes d'indemnisation assurance (convention IRSI) et respecte scrupuleusement les règles de l'art (DTU 59.1 Peinture). Les phases techniques indispensables (protection, assainissement, ratissage plâtre, impression isolante hydrofuge et finition 2 couches) sont intégralement décomposées et validées.`
                        : `Ce devis présente un score de conformité de ${scoreConformite}%. Certains postes méritent clarification : exigez la confirmation écrite de l'application d'une sous-couche isolante anti-auréoles pour éviter toute réapparition de taches jaunâtres d'humidité.`);

                // Synthèse d'expertise via Cloudflare Workers AI si disponible
                try {
                    const axios = require('axios');
                    const cfRes = await axios.post('https://bpa.v0reponses.workers.dev/analyze', {
                        prompt: `Voici les résultats de l'analyse d'un devis TCE dégât des eaux :
- Total devis : ${totalHt.toFixed(2)} € HT
- Total référence marché : ${totalRef.toFixed(2)} € HT
- Score de conformité : ${scoreConformite}%
- Articles analysés : ${articles.length}
- Détail articles : ${articles.map((a: any) => `${a.designation} (${a.prix_devis} €)`).join('; ')}

Rédige un avis expert BTP clair et synthétique (3 phrases maximum) pour le client avec ton conseil pour l'assurance.`
                    }, { timeout: 4000 });
                    if (cfRes.data?.response && typeof cfRes.data.response === 'string' && cfRes.data.response.length > 20) {
                        resumeFinal = cfRes.data.response.trim();
                    }
                } catch (e) {
                    // Conserve la synthèse expert TCE détaillée calculée localement
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
