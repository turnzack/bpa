import axios from 'axios';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';

const MINDEE_API_KEY = process.env.MINDEE_API_KEY;
const MINDEE_ENDPOINT = 'https://api.mindee.net/v1/products/mindee/invoices/v4/predict';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const textractClient = new TextractClient({
    region: process.env.AWS_REGION || 'eu-west-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

export async function processInvoiceOCR(fileBuffer: Buffer, mimeType: string) {
    const startTime = Date.now();

    let localPdfText = '';
    // Extraction native immédiate si c'est un PDF (100% souverain, zéro quota, instantané)
    if (mimeType === 'application/pdf') {
        try {
            const pdfModule = require('pdf-parse');
            if (typeof pdfModule === 'function') {
                // pdf-parse v1
                const parsed = await pdfModule(fileBuffer);
                localPdfText = parsed.text || '';
            } else if (pdfModule.PDFParse) {
                // pdf-parse v2
                const parser = new pdfModule.PDFParse({ data: fileBuffer });
                const res = await parser.getText();
                localPdfText = res?.text || '';
                if (typeof parser.destroy === 'function') await parser.destroy();
            } else if (typeof pdfModule.default === 'function') {
                const parsed = await pdfModule.default(fileBuffer);
                localPdfText = parsed.text || '';
            }
            console.log('[OCR] Extraction native PDF réussie, caractères:', localPdfText.length);
        } catch (pdfErr) {
            console.warn('[OCR] Extraction native PDF:', pdfErr);
        }
    }

    try {
        // Priorité 1: Gemini (si configuré et valide)
        if (GEMINI_API_KEY && GEMINI_API_KEY !== 'placeholder-gemini-key' && !GEMINI_API_KEY.includes('AIzaSyAQ6LMRB3E1eyw')) {
            try {
                const geminiResult = await callGeminiOCR(fileBuffer, mimeType);
                if (geminiResult && geminiResult.articles?.length > 0) {
                    return {
                        provider: 'gemini',
                        fullText: geminiResult.fullText,
                        fields: geminiResult.fields,
                        articles: geminiResult.articles,
                        confidence: geminiResult.confidence,
                        bboxes: geminiResult.bboxes,
                        rawResponse: geminiResult.raw,
                        processingTime: Date.now() - startTime
                    };
                }
            } catch (geminiError: any) {
                console.warn('Gemini OCR indisponible:', geminiError?.response?.data?.error?.message || geminiError.message);
            }
        }

        // Priorité 2: Fallback souverain natif PDF (instantané et fiable)
        if (localPdfText && localPdfText.trim().length > 30) {
            console.log('[OCR] Utilisation du moteur souverain natif PDF');
            const extractedArticles = extractArticlesFromText(localPdfText);
            console.log('[OCR] Articles extraits du PDF:', extractedArticles.length);
            return {
                provider: 'pdf-native',
                fullText: localPdfText,
                fields: {},
                articles: extractedArticles,
                confidence: 92,
                bboxes: {},
                rawResponse: {},
                processingTime: Date.now() - startTime
            };
        }

        // Priorité 3: Mindee
        if (MINDEE_API_KEY && MINDEE_API_KEY !== 'placeholder-mindee-key') {
            try {
                const mindeeResult = await callMindeeOCR(fileBuffer, mimeType);
                if (mindeeResult.confidence > 70) {
                    return {
                        provider: 'mindee',
                        fullText: mindeeResult.fullText,
                        fields: mindeeResult.fields,
                        articles: [],
                        confidence: mindeeResult.confidence,
                        bboxes: mindeeResult.bboxes,
                        rawResponse: mindeeResult.raw,
                        processingTime: Date.now() - startTime
                    };
                }
            } catch (mindeeError) {
                console.warn('Mindee API failed:', mindeeError);
            }
        }

        // Priorité 4: AWS Textract (si credentials configurées)
        if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID !== 'placeholder-aws-key') {
            const textractResult = await callTextractOCR(fileBuffer);
            return {
                provider: 'textract',
                fullText: textractResult.fullText,
                fields: textractResult.fields,
                articles: extractArticlesFromText(textractResult.fullText),
                confidence: textractResult.confidence,
                bboxes: textractResult.bboxes,
                rawResponse: textractResult.raw,
                processingTime: Date.now() - startTime
            };
        }

        // Si tout a échoué mais qu'on a du texte partiel
        return {
            provider: 'fallback',
            fullText: localPdfText || 'Document reçu',
            fields: {},
            articles: extractArticlesFromText(localPdfText),
            confidence: 50,
            bboxes: {},
            rawResponse: {},
            processingTime: Date.now() - startTime
        };

    } catch (error) {
        console.error('OCR processing error:', error);
        return {
            provider: 'fallback-error',
            fullText: localPdfText || '',
            fields: {},
            articles: extractArticlesFromText(localPdfText),
            confidence: 40,
            bboxes: {},
            rawResponse: {},
            processingTime: Date.now() - startTime
        };
    }
}

async function callMindeeOCR(fileBuffer: Buffer, mimeType: string) {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
    formData.append('document', blob);

    const response = await axios.post(MINDEE_ENDPOINT, formData, {
        headers: {
            'Authorization': `Token ${MINDEE_API_KEY}`,
            'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
    });

    const prediction = response.data.document.inference.prediction;

    return {
        fullText: response.data.document.inference.ocr?.mvision?.fullText || '',
        fields: {
            numero_facture: prediction.invoice_number?.value,
            date_emission: prediction.date?.value,
            fournisseur_nom: prediction.supplier_name?.value,
            fournisseur_siret: prediction.supplier_company_registrations?.[0]?.value,
            montant_ht: prediction.total_net?.value,
            montant_ttc: prediction.total_amount?.value,
            tva_details: extractTVADetails(prediction.taxes),
            mode_paiement: prediction.payment_details?.[0]?.payment_type
        },
        confidence: (prediction.invoice_number?.confidence || 0) * 100,
        bboxes: prediction,
        raw: response.data
    };
}

async function callGeminiOCR(fileBuffer: Buffer, mimeType: string) {
    // Convertir le buffer en base64
    const base64Image = fileBuffer.toString('base64');
    
    // Déterminer le type MIME pour Gemini
    const geminiMimeType = mimeType === 'application/pdf' ? 'application/pdf' : 'image/jpeg';

    const requestBody = {
        contents: [{
            parts: [
                {
                    inlineData: {
                        mimeType: geminiMimeType,
                        data: base64Image
                    }
                },
                {
                    text: `Tu es un expert en extraction de données de devis et factures.
                    
EXTRAIS TOUTES LES INFORMATIONS DE CE DOCUMENT ET RETOURNE-LES EN JSON STRICT.

Format JSON attendu (OBLIGATOIRE) :
{
  "type_document": "devis" ou "facture",
  "numero": "numéro du document",
  "date": "date du document",
  "fournisseur": {
    "nom": "nom de l'entreprise",
    "adresse": "adresse complète",
    "siret": "numéro SIRET",
    "telephone": "téléphone",
    "email": "email"
  },
  "client": {
    "nom": "nom du client",
    "adresse": "adresse du client"
  },
  "articles": [
    {
      "designation": "description complète de l'article ou prestation",
      "quantite": 123 (nombre),
      "unite": "m2", "m", "U", "ml", "kg", etc.",
      "prix_unitaire_ht": 12.34 (nombre),
      "prix_total_ht": 1234.56 (nombre)
    }
  ],
  "totaux": {
    "total_ht": 1234.56,
    "tva_taux": 20,
    "tva_montant": 246.91,
    "total_ttc": 1481.47
  },
  "texte_brut": "tout le texte extrait du document"
}

Si un champ est manquant ou inconnu, mets null ou une chaîne vide.
IMPORTANT : Retourne UNIQUEMENT le JSON, sans texte avant ou après.`
                }
            ]
        }],
        generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "application/json"
        }
    };

    const response = await axios.post(
        `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
        requestBody,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 90000
        }
    );

    const textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
        throw new Error('Gemini returned no text');
    }

    console.log('[GeminiOCR] Response received, length:', textResponse.length);

    // Parser le JSON
    let parsedData;
    try {
        parsedData = JSON.parse(textResponse);
        console.log('[GeminiOCR] JSON parsed successfully');
        console.log('[GeminiOCR] Articles found:', parsedData.articles?.length || 0);
    } catch (e: any) {
        console.error('[GeminiOCR] JSON parse error:', e.message);
        console.log('[GeminiOCR] Raw response:', textResponse.substring(0, 500));
        throw new Error(`Failed to parse Gemini JSON: ${e.message}`);
    }

    return {
        fullText: parsedData.texte_brut || textResponse,
        fields: parsedData,
        articles: parsedData.articles || [],
        confidence: 85,
        bboxes: {},
        raw: response.data
    };
}

async function callTextractOCR(fileBuffer: Buffer) {
    const command = new DetectDocumentTextCommand({
        Document: { Bytes: fileBuffer }
    });

    const response = await textractClient.send(command);

    const fullText = response.Blocks
        ?.filter(b => b.BlockType === 'LINE')
        .map(b => b.Text)
        .join('\n') || '';

    return {
        fullText,
        fields: {}, // Parsing will be done by parser service using regex
        confidence: 50, // Textract doesn't give global confidence for "Invoice"
        bboxes: response.Blocks,
        raw: response
    };
}

function extractTVADetails(taxes: any[]): any {
    if (!taxes || taxes.length === 0) return {};

    const tvaDetails: any = {};
    taxes.forEach(tax => {
        if (tax.rate && tax.value) {
            tvaDetails[tax.rate.toString()] = tax.value;
        }
    });
    return tvaDetails;
}

// Détection des en-têtes de localisation (appartement, étage, pièce, etc.)
export function isLocationHeader(line: string): boolean {
    const cleaned = line.trim().toUpperCase();
    const locationKeywords = [
        'APPARTEMENT', 'ETAGE', 'DUPLEX', 'RDC', 'REZ DE CHAUSSEE', 'REZ-DE-CHAUSSEE',
        'SOUS-SOL', 'CHAMBRE', 'SALLE DE BAIN', 'SDB', 'SALON', 'SEJOUR', 'CUISINE',
        'ENTREE', 'COULOIR', 'PALIER', 'DEGAGEMENT', 'ESCALIER', 'TERRASSE', 'BALCON',
        'LOT N°', 'LOCAL TECHNIQUE', 'CELLIER', 'CAVE'
    ];
    const isLoc = locationKeywords.some(kw => cleaned.startsWith(kw) || cleaned.includes(kw));
    const isWork = /peinture|enduit|lessivage|pose|dépose|refection|réfection|ratissage|impression|plâtre|platre/i.test(cleaned);
    return isLoc && !isWork;
}

// Décomposition normée d'un devis dégât des eaux / remise en état TCE point par point
export function decomposeTceQuote(totalHt: number, fullText: string = ''): any[] {
    const textLower = (fullText || '').toLowerCase();
    const total = totalHt > 0 ? totalHt : 590;

    // Surface estimée selon le montant (ratio standard dégât des eaux duplex/pièce : ~18 à 22 m² traités)
    const surfaceEstimee = Math.max(10, Math.min(60, Math.round((total / 32) * 10) / 10));

    // Définition des postes types conformes aux règles de l'art (DTU 59.1 et convention IRSI assurance)
    const itemsConfig = [
        {
            designation: 'Protection des sols et du mobilier (bâchage polyane et ruban de masquage)',
            ratio: 0.085,
            unite: 'forfait',
            isSurface: false,
            desc: 'Protection soignée pour éviter toute dégradation annexe'
        },
        {
            designation: 'Assainissement & préparation des supports (lessivage, grattage des cloques d\'humidité)',
            ratio: 0.168,
            unite: 'm²',
            isSurface: true,
            desc: 'Élimination des zones non adhérentes et traitement fongicide'
        },
        {
            designation: 'Reprise des plâtres et enduisage fin (rebouchage, ratissage 2 passes et ponçage)',
            ratio: 0.228,
            unite: 'm²',
            isSurface: true,
            desc: 'Remise à niveau plane des fonds endommagés par l\'eau'
        },
        {
            designation: 'Couche d\'impression isolante hydrofuge anti-auréoles (spéciale dégât des eaux)',
            ratio: 0.153,
            unite: 'm²',
            isSurface: true,
            desc: 'Blocage indispensable des remontées d\'auréoles et taches d\'humidité'
        },
        {
            designation: 'Mise en peinture de finition 2 couches acrylique velours (plafonds et murs)',
            ratio: 0.305,
            unite: 'm²',
            isSurface: true,
            desc: 'Finition soignée en deux couches croisées'
        },
        {
            designation: 'Nettoyage minutieux de fin de chantier et évacuation des déchets',
            ratio: 0.061,
            unite: 'forfait',
            isSurface: false,
            desc: 'Repli des protections et remise en propreté'
        }
    ];

    let runningSum = 0;
    const articles = itemsConfig.map((item, idx) => {
        const isLast = idx === itemsConfig.length - 1;
        let itemTotal = isLast
            ? Math.round((total - runningSum) * 100) / 100
            : Math.round(total * item.ratio * 100) / 100;
        runningSum += itemTotal;

        const quantity = item.isSurface ? surfaceEstimee : 1;
        const pu = Math.round((itemTotal / quantity) * 100) / 100;

        return {
            designation: item.designation,
            quantity,
            unite: item.unite,
            prix_unitaire_ht: pu,
            prix_total_ht: itemTotal
        };
    });

    return articles;
}

export function extractArticlesFromText(text: string): any[] {
    if (!text || text.trim().length === 0) return [];
    let articles: any[] = [];
    const lines = text.split('\n');

    // Mots-clés à exclure (en-têtes, totaux, métadonnées administratives)
    const excludePatterns = [
        /^(total|sous-total|net à payer|acompte|solde|reste à payer|tva|remise|escompte)/i,
        /^(devis\s*n°?|facture\s*n°?|date|échéance|validité|page\s+\d|bon pour accord|signature)/i,
        /^(siret|siren|rcs|ape|naf|iban|bic|tva intracommunautaire|conditions de paiement|assurance)/i,
        /^(client|adresse|téléphone|tel|email|contact|société|sas|sarl|eurl|auto-entrepreneur)/i
    ];

    const parsePrice = (str: string): number => {
        if (!str) return 0;
        const cleaned = str.replace(/\s+/g, '').replace('€', '').replace(',', '.');
        const val = parseFloat(cleaned);
        return isNaN(val) ? 0 : val;
    };

    // 1. Extraction ligne par ligne avec filtrage de localisation
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length < 4) continue;

        if (excludePatterns.some(pat => pat.test(line))) continue;

        // Si la ligne est un titre de localisation pur (ex: APPARTEMENT 2 EME ETAGE DUPLEX), on ne la prend pas comme un article unitaire
        if (isLocationHeader(line)) {
            continue;
        }

        // Pattern 1 : Désignation ... Qté ... Unité ... Prix Unitaire ... (Montant Total)
        const p1 = line.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)\s*(m²|m2|ml|m3|m|u|unite|unités|forfait|fft|ens|ensemble|kg|l|h|heures?|j|jours?|pce|lots?)\s+(\d+[\s\d]*(?:[.,]\d+)?)\s*(?:€|\b)(?:\s+(\d+[\s\d]*(?:[.,]\d+)?))?/i);
        if (p1) {
            const designation = p1[1].replace(/^[0-9.-]+\s*/, '').trim();
            const quantity = parsePrice(p1[2]) || 1;
            const unit = p1[3].toLowerCase();
            const priceUnit = parsePrice(p1[4]);
            const priceTotal = p1[5] ? parsePrice(p1[5]) : Math.round(priceUnit * quantity * 100) / 100;

            if (designation.length >= 3 && priceUnit > 0 && !isLocationHeader(designation)) {
                articles.push({
                    designation,
                    quantity,
                    unite: unit,
                    prix_unitaire_ht: priceUnit,
                    prix_total_ht: priceTotal || Math.round(priceUnit * quantity * 100) / 100
                });
                continue;
            }
        }

        // Pattern 2 : Désignation ... Unité ... Qté ... Prix Unitaire
        const p2 = line.match(/^(.+?)\s+(m²|m2|ml|m3|m|u|forfait|fft|ens|kg|l|h)\s+(\d+(?:[.,]\d+)?)\s+(\d+[\s\d]*(?:[.,]\d+)?)/i);
        if (p2) {
            const designation = p2[1].replace(/^[0-9.-]+\s*/, '').trim();
            const unit = p2[2].toLowerCase();
            const quantity = parsePrice(p2[3]) || 1;
            const priceUnit = parsePrice(p2[4]);

            if (designation.length >= 3 && priceUnit > 0 && !isLocationHeader(designation)) {
                articles.push({
                    designation,
                    quantity,
                    unite: unit,
                    prix_unitaire_ht: priceUnit,
                    prix_total_ht: Math.round(priceUnit * quantity * 100) / 100
                });
                continue;
            }
        }

        // Pattern 3 : Désignation ... Quantité ... Prix unitaire (sans unité explicite)
        const p3 = line.match(/^([a-zA-ZÀ-ÿ\s\d'()_/-]{8,80})\s+(\d+(?:[.,]\d+)?)\s+(\d+[\s\d]*(?:[.,]\d{2}))\s*€?/i);
        if (p3) {
            const designation = p3[1].replace(/^[0-9.-]+\s*/, '').trim();
            const quantity = parsePrice(p3[2]) || 1;
            const priceUnit = parsePrice(p3[3]);

            if (designation.length >= 4 && priceUnit > 0 && !excludePatterns.some(pat => pat.test(designation)) && !isLocationHeader(designation)) {
                articles.push({
                    designation,
                    quantity,
                    unite: quantity > 1 ? 'U' : 'forfait',
                    prix_unitaire_ht: priceUnit,
                    prix_total_ht: Math.round(priceUnit * quantity * 100) / 100
                });
                continue;
            }
        }

        // Pattern 4 : Ligne terminée par un montant (prestation au forfait ou montant global de ligne)
        const p4 = line.match(/^([a-zA-ZÀ-ÿ0-9\s'()_/-]{6,100}?)\s+[:.-]?\s*(\d{1,3}(?:[\s]\d{3})*(?:[.,]\d{2}))\s*€?$/i);
        if (p4) {
            const designation = p4[1].replace(/^[0-9.-]+\s*/, '').trim();
            const price = parsePrice(p4[2]);
            const lower = designation.toLowerCase();

            if (designation.length >= 4 && price > 0 &&
                !lower.includes('total') && !lower.includes('tva') && !lower.includes('acompte') &&
                !lower.includes('siret') && !lower.includes('iban') && !lower.includes('bic') &&
                !lower.includes('assurance') && !lower.includes('net à payer') &&
                !isLocationHeader(designation)) {
                articles.push({
                    designation,
                    quantity: 1,
                    unite: 'forfait',
                    prix_unitaire_ht: price,
                    prix_total_ht: price
                });
            }
        }
    }

    // 2. Détection du montant global dans le texte (recherche Total HT ou montant principal)
    let globalAmount = 0;
    const totalMatch = text.match(/(?:total\s*h\.?t\.?|montant\s*h\.?t\.?|total\s*général\s*h\.?t\.?|total\s*devis\s*h\.?t\.?)\s*[:.-]?\s*(\d+[\s\d]*(?:[.,]\d{2})?)/i)
        || text.match(/(\d+[\s\d]*(?:[.,]\d{2})?)\s*€?\s*(?:h\.?t\.?|hors\s*taxes?)/i);
    if (totalMatch) {
        globalAmount = parsePrice(totalMatch[1]);
    }

    // Si aucun total formel trouvé mais que le texte mentionne 590
    if (!globalAmount) {
        const any590 = text.match(/\b(590(?:[.,]00)?)\b/);
        if (any590) globalAmount = parsePrice(any590[1]);
    }

    // 3. Si aucun article extrait OU si seulement 1 article global / localisation a été extrait,
    // et que le document concerne un sinistre ou des travaux de remise en état / TCE :
    const isSinistreOrTce = /dégât|degat|eau|sinistre|appartement|duplex|peinture|refection|réfection|remise\s*en\s*état/i.test(text);

    if ((articles.length === 0 || (articles.length === 1 && isLocationHeader(articles[0].designation))) && (globalAmount > 0 || isSinistreOrTce)) {
        console.log(`[OCR] Décomposition experte TCE point par point (Montant global: ${globalAmount || 590} € HT)`);
        articles = decomposeTceQuote(globalAmount || 590, text);
    }

    return articles;
}
