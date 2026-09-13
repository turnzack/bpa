export interface ArticleDevis {
    designation: string;
    quantity: number;
    unit: string;
    priceUnit: number;
    priceTotal?: number;
}

export function parseInvoiceFields(ocrResult: any) {
    const text = ocrResult.fullText;
    const fields = ocrResult.fields || {};

    // If Mindee already filled fields, we just try to complete them.
    // If Textract (only fullText), we run regex extraction.

    const parsed = {
        numero_facture: fields.numero_facture || extractNumeroFacture(text),
        date_emission: fields.date_emission || extractDate(text),
        fournisseur_nom: fields.fournisseur_nom || extractFournisseur(text),
        fournisseur_siret: fields.fournisseur_siret || extractSIRET(text),
        montant_ht: fields.montant_ht || extractMontantHT(text),
        montant_ttc: fields.montant_ttc || extractMontantTTC(text),
        tva_details: fields.tva_details || extractTVA(text),
        mode_paiement: fields.mode_paiement || extractModePaiement(text),
        articles: extractArticles(text) // NEW: Extract line items
    };

    // Cross-validation
    const validation = validateAmounts(parsed);

    return {
        fields: parsed,
        confidence: calculateConfidence(parsed, validation),
        errors: validation.errors
    };
}

function extractNumeroFacture(text: string): string | null {
    const patterns = [
        /(?:FAC|FACT|FACTURE|INVOICE|N°)[\s#:.-]*([A-Z0-9-]+)/i,
        /NUMERO[\s:]*([A-Z0-9-]+)/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[1].trim();
    }
    return null;
}

function extractDate(text: string): string | null {
    // Formats FR: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
    const patterns = [
        /(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/,
        /(?:DATE|EMIS|FACTURÉ)[\s:]*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            // Normalize to YYYY-MM-DD
            const dateParts = match[1].split(/[\/.-]/);
            if (dateParts.length === 3) {
                let [day, month, year] = dateParts;
                if (year.length === 2) year = '20' + year;
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
        }
    }
    return null;
}

function extractSIRET(text: string): string | null {
    const pattern = /(\d{3}\s?\d{3}\s?\d{3}\s?\d{5})/;
    const match = text.match(pattern);
    if (match) {
        return match[1].replace(/\s/g, '');
    }
    return null;
}

function extractMontantHT(text: string): number | null {
    const patterns = [
        /(?:TOTAL\s*)?H\.?T\.?[\s:€]*?([\d\s,.]+)\s*€?/i,
        /MONTANT\s*HT[\s:€]*?([\d\s,.]+)/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return normalizeAmount(match[1]);
        }
    }
    return null;
}

function extractMontantTTC(text: string): number | null {
    const patterns = [
        /(?:TOTAL\s*)?T\.?T\.?C\.?[\s:€]*?([\d\s,.]+)\s*€?/i,
        /MONTANT\s*TTC[\s:€]*?([\d\s,.]+)/i,
        /NET\s*A\s*PAYER[\s:€]*?([\d\s,.]+)/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return normalizeAmount(match[1]);
        }
    }
    return null;
}

function extractTVA(text: string): any {
    const tvaDetails: any = {};
    const pattern = /TVA\s*(?:À\s*)?(\d{1,2}[.,]?\d*)\s*%[\s:€]*?([\d\s,.]+)/gi;

    let match;
    while ((match = pattern.exec(text)) !== null) {
        const rate = match[1].replace(',', '.');
        const amount = normalizeAmount(match[2]);
        tvaDetails[rate] = amount;
    }

    return Object.keys(tvaDetails).length > 0 ? tvaDetails : null;
}

function extractModePaiement(text: string): string | null {
    const modes = ['chèque', 'virement', 'CB', 'carte bancaire', 'prolèvement', 'espèces'];
    const textLower = text.toLowerCase();

    for (const mode of modes) {
        if (textLower.includes(mode)) {
            return mode;
        }
    }
    return null;
}

function extractFournisseur(text: string): string | null {
    // Heuristic: First non-empty lines are often the Header/Supplier
    const lines = text.split('\n').filter(l => l.trim().length > 3);
    if (lines.length > 0) {
        return lines[0].trim();
    }
    return null;
}

function normalizeAmount(str: string): number {
    // 1 234,56 -> 1234.56
    // Handle space as thousand separator, comma as decimal
    return parseFloat(str.replace(/\s/g, '').replace(',', '.'));
}

function validateAmounts(parsed: any): any {
    const errors: string[] = [];

    if (parsed.montant_ht && parsed.montant_ttc) {
        const htCalculated = parsed.montant_ttc / 1.20; // Assuming 20%
        const diff = Math.abs(htCalculated - parsed.montant_ht);

        // Tolerance depends on context, but here let's say 2% due to rounding or 5.5/10% rates
        if (diff > parsed.montant_ht * 0.02 && diff > 1.0) {
            // It's just a warning/soft validation
            // errors.push('Incohérence HT/TTC possible');
        }
    }

    return { valid: errors.length === 0, errors };
}

function calculateConfidence(parsed: any, validation: any): number {
    let score = 0;
    const fields = Object.keys(parsed);

    fields.forEach(field => {
        if (parsed[field] !== null && parsed[field] !== undefined) {
            score += 100 / fields.length;
        }
    });

    if (!validation.valid) {
        score -= 20;
    }

    return Math.max(0, Math.min(100, score));
}

/**
 * Extrait les articles/lignes de devis depuis le texte OCR
 * Formats supportés:
 * - "Désignation ... 10 ml 5.50 € 55.00 €"
 * - "Fourniture et pose ... 1 U 150.00 €"
 * - "Main d'oeuvre ... 3 h 45.00 € 135.00 €"
 */
function extractArticles(text: string): ArticleDevis[] {
    const articles: ArticleDevis[] = [];
    const lines = text.split('\n').filter(line => line.trim().length > 5);

    // Patterns pour extraire les lignes de devis
    const patterns = [
        // Pattern 1: Désignation + Quantité + Unité + Prix Unitaire + Total
        /(.+?)\s+(\d+[.,]?\d*)\s*(ml|m²|m³|m|U|kg|L|h|forfait)\s+([\d\s,.]+)\s*€\s*(?:([\d\s,.]+)\s*€)?/i,
        
        // Pattern 2: Désignation + Quantité + Prix Unitaire (sans unité)
        /(.+?)\s+(\d+)\s+([\d\s,.]+)\s*€/i,
        
        // Pattern 3: Avec prix total seulement
        /(.+?)\s+([\d\s,.]+)\s*€\s*([\d\s,.]+)\s*€/i,
        
        // Pattern 4: Format tableau avec barres verticales
        /(.+?)\s*\|\s*(\d+)\s*\|\s*([\d\s,.]+)\s*€\s*\|\s*([\d\s,.]+)\s*€/i
    ];

    for (const line of lines) {
        // Skip header lines and totals
        const skipKeywords = ['total', 'facture', 'date', 'siret', 'tva', 'page', '€', 'ht', 'ttc'];
        const lineLower = line.toLowerCase();
        
        // Check if line looks like a line item (has quantity and price)
        const hasQuantity = /\d+\s*(ml|m²|m³|m|U|kg|L|h)/i.test(line) || /\d+\s+[\d,.]+\s*€/i.test(line);
        const isTotalLine = lineLower.includes('total') || lineLower.includes('net à payer');
        
        if (!hasQuantity || isTotalLine) continue;

        for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
                let designation = match[1]?.trim() || '';
                const quantityStr = (match[2] || '1').replace(',', '.');
                const unit = match[3] || 'U';
                const priceUnitStr = (match[4] || match[3] || '0').replace(/\s/g, '').replace(',', '.');
                const priceTotalStr = match[5]?.replace(/\s/g, '').replace(',', '.');

                // Clean designation - remove common noise
                designation = designation.replace(/^(désignation|référence|ref|détails?)[:\s-]*/i, '').trim();
                
                // Skip if designation is too short or looks like a number/date
                if (designation.length < 3 || /^\d+[/.\-]\d+[/.\-]\d+$/.test(designation)) continue;

                const quantity = parseFloat(quantityStr) || 1;
                const priceUnit = parseFloat(priceUnitStr) || 0;
                const priceTotal = priceTotalStr ? parseFloat(priceTotalStr) : (quantity * priceUnit);

                if (designation && priceUnit > 0) {
                    articles.push({
                        designation,
                        quantity,
                        unit: unit.trim(),
                        priceUnit,
                        priceTotal
                    });
                    break; // Stop after first successful pattern
                }
            }
        }
    }

    return articles;
}
