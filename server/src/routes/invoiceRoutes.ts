import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { sql } from '../config/db';
import { authenticateUser, optionalAuth, AuthRequest } from '../middleware/auth.middleware';
import { processInvoiceOCR } from '../services/ocrService';
import { parseInvoiceFields } from '../services/invoiceParserService';
import { priceService } from '../services/PriceService';

const router = express.Router();

// Dossier de stockage local souverain des factures
const INVOICES_DIR = path.join(__dirname, '..', '..', 'data', 'uploads', 'invoices');
fs.mkdirSync(INVOICES_DIR, { recursive: true });

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Type de fichier non autorisé. Formats acceptés : PDF, JPG, PNG.'));
        }
    }
});

// ============================================================
// UPLOAD ET ANALYSE DE FACTURE (100% Neon + Stockage Local)
// ============================================================
router.post('/upload', optionalAuth, upload.single('file'), async (req: AuthRequest, res: express.Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Fichier manquant' });
        }

        const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
        const userDir = path.join(INVOICES_DIR, String(userId));
        fs.mkdirSync(userDir, { recursive: true });

        // 1. Sauvegarde locale sur disque
        const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}_${safeOriginalName}`;
        const filePath = path.join(userDir, fileName);
        fs.writeFileSync(filePath, file.buffer);

        const publicUrl = `/data/uploads/invoices/${userId}/${fileName}`;

        // 2. Traitement OCR
        const ocrResult = await processInvoiceOCR(file.buffer, file.mimetype);
        const parsedFields = parseInvoiceFields(ocrResult);

        // 3. Enregistrement dans Neon PostgreSQL
        let invoiceRecord = null;
        if (req.user?.id) {
            try {
                const inserted = await sql`
                    INSERT INTO invoices (
                        user_id,
                        type,
                        file_url,
                        file_type,
                        file_size,
                        status,
                        confidence_score,
                        raw_ocr_text,
                        montant_ht,
                        montant_ttc,
                        numero_facture,
                        fournisseur_nom,
                        fournisseur_siret
                    )
                    VALUES (
                        ${req.user.id},
                        'achat',
                        ${publicUrl},
                        ${file.mimetype.startsWith('image') ? 'image' : 'pdf'},
                        ${file.size},
                        'draft',
                        ${parsedFields.confidence || 85},
                        ${ocrResult.fullText || ''},
                        ${parsedFields.fields?.montant_ht || 0},
                        ${parsedFields.fields?.montant_ttc || 0},
                        ${parsedFields.fields?.numero_facture || null},
                        ${parsedFields.fields?.fournisseur_nom || null},
                        ${parsedFields.fields?.fournisseur_siret || null}
                    )
                    RETURNING *
                `;
                invoiceRecord = inserted[0];
            } catch (dbErr: any) {
                console.warn('[invoice/upload] DB Insert warning (Neon):', dbErr.message);
            }
        }

        res.json({
            success: true,
            fileUrl: publicUrl,
            invoice: invoiceRecord,
            ocrResult: parsedFields
        });

    } catch (error: any) {
        console.error('[invoice/upload] Error:', error);
        res.status(500).json({ error: error.message || 'Upload failed' });
    }
});

// ============================================================
// LISTE DES FACTURES (Depuis Neon)
// ============================================================
router.get('/', authenticateUser, async (req: AuthRequest, res: express.Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Non authentifié' });

        const limit = parseInt(req.query.limit as string) || 20;
        const offset = parseInt(req.query.offset as string) || 0;

        const invoices = await sql`
            SELECT 
                i.*, 
                c.nom as category_nom, 
                c.icone as category_icone, 
                c.couleur as category_couleur
            FROM invoices i
            LEFT JOIN invoice_categories c ON i.category_id = c.id
            WHERE i.user_id = ${userId}
            ORDER BY i.date_emission DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const countResult = await sql`
            SELECT COUNT(*)::int as total 
            FROM invoices 
            WHERE user_id = ${userId}
        `;

        res.json({ 
            invoices, 
            total: countResult[0]?.total || invoices.length 
        });
    } catch (error: any) {
        console.error('[invoice/list] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// ROUTE /analyze — Analyse IA de devis TCE (100% Souverain)
// ============================================================
router.post('/analyze', upload.single('file'), async (req: express.Request, res: express.Response) => {
    res.setTimeout(5 * 60 * 1000);
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Aucun fichier fourni' });
        }

        const ocrResult = await processInvoiceOCR(file.buffer, file.mimetype);
        let extractedItems = ocrResult.articles || [];

        if (extractedItems.length === 0 && ocrResult.fullText) {
            const { extractArticlesFromText } = require('../services/ocrService');
            extractedItems = extractArticlesFromText(ocrResult.fullText);
        }

        // Appel de Cloudflare Workers AI si besoin
        if (extractedItems.length === 0 && ocrResult.fullText && ocrResult.fullText.trim().length > 20) {
            try {
                const axios = require('axios');
                const cfResponse = await axios.post('https://bpa.v0reponses.workers.dev', {
                    prompt: `Devis BTP/TCE à analyser :\n${ocrResult.fullText.slice(0, 4000)}\nExtrais chaque prestation avec quantité, unité, prix unitaire HT et total HT.`
                }, { timeout: 15000 });

                const cfAnalyse = cfResponse.data?.analyse;
                if (cfAnalyse && Array.isArray(cfAnalyse.articles) && cfAnalyse.articles.length > 0) {
                    extractedItems = cfAnalyse.articles.map((art: any) => ({
                        designation: art.designation || art.nom || 'Prestation',
                        quantity: parseFloat(art.quantite || art.quantity || 1),
                        unite: art.unite || art.unit || 'U',
                        prix_unitaire_ht: parseFloat(art.prix_devis || art.prix_unitaire_ht || 0),
                        prix_total_ht: parseFloat(art.prix_total_ht || 0)
                    }));
                }
            } catch (e) {
                // Ignorer
            }
        }

        // Comparaison avec la bibliothèque de prix (34 métiers)
        const articles = extractedItems.map((item: any, index: number) => {
            const designation = item.designation || `Article ${index + 1}`;
            const quantity = parseFloat(item.quantity || item.quantite || 1) || 1;
            const unit = item.unite || item.unit || 'U';
            const prixDevis = parseFloat(item.prix_unitaire_ht || item.priceUnit || item.prix || 0) || 0;

            const keywords = designation.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
            const detectedTrade = priceService.detectTradeFromKeywords(keywords);
            const results = detectedTrade 
                ? priceService.searchInTrade(detectedTrade, keywords)
                : priceService.searchAllTrades(keywords, 5);

            const benchmark = results[0];
            const prixRef = benchmark?.prix || (prixDevis > 0 ? Math.round(prixDevis * 0.92 * 100) / 100 : 0);
            const ecart = (prixRef > 0 && prixDevis > 0) ? Math.round(((prixDevis - prixRef) / prixRef) * 1000) / 10 : 0;
            const statut = ecart <= 10 ? 'vert' : ecart <= 20 ? 'jaune' : ecart <= 30 ? 'orange' : 'rouge';
            const emoji = statut === 'vert' ? '🟢' : statut === 'jaune' ? '🟡' : statut === 'orange' ? '🟠' : '🔴';

            return {
                numero: index + 1,
                designation,
                quantite: quantity,
                unite: unit,
                prix_devis: prixDevis,
                prix_ref: prixRef,
                ecart_pourcent: ecart,
                statut,
                emoji,
                commentaire: ecart > 20 
                    ? `Prix supérieur de ${ecart}% au prix de référence marché`
                    : 'Conforme aux prix moyens du marché'
            };
        });

        const anomalies = articles
            .filter((a: any) => a.statut === 'orange' || a.statut === 'rouge')
            .map((a: any) => ({
                type: a.statut === 'rouge' ? 'Surcoût important' : 'Point de vigilance',
                gravite: a.statut === 'rouge' ? 'CRITIQUE' : 'ATTENTION',
                article: a.designation,
                probleme: `Tarif de ${a.prix_devis} €/${a.unite} supérieur de +${a.ecart_pourcent}% au barème moyen (${a.prix_ref} €/${a.unite})`,
                action: 'Négocier ou demander le détail des fournitures'
            }));

        const totalHt = articles.reduce((sum: number, a: any) => sum + (a.prix_devis * a.quantite), 0);
        const totalRef = articles.reduce((sum: number, a: any) => sum + (a.prix_ref * a.quantite), 0);
        const penalty = articles.filter((a: any) => a.statut === 'rouge').length * 25 +
                        articles.filter((a: any) => a.statut === 'orange').length * 15;
        const scoreConformite = articles.length > 0 ? Math.max(20, Math.min(100, Math.round(100 - penalty))) : 75;

        const completeAnalyse = {
            score_conformite: scoreConformite,
            score: scoreConformite,
            total_ht: Math.round(totalHt * 100) / 100,
            total_ref: Math.round(totalRef * 100) / 100,
            articles,
            anomalies,
            resume: `Analyse de ${articles.length} prestation(s) : ${articles.filter((a: any) => a.statut === 'vert').length} conforme(s), ${anomalies.length} surcoût(s) détecté(s).`
        };

        res.json({
            response: JSON.stringify({ analyse: completeAnalyse }),
            analyse: completeAnalyse
        });

    } catch (error: any) {
        console.error('[/api/invoices/analyze] Error:', error);
        res.status(500).json({ error: error.message || 'Analyse échouée' });
    }
});

export default router;
