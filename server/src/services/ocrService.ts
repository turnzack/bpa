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

    try {
        // Priority 1: Gemini (configured and free)
        if (GEMINI_API_KEY && GEMINI_API_KEY !== 'placeholder-gemini-key') {
            try {
                const geminiResult = await callGeminiOCR(fileBuffer, mimeType);
                if (geminiResult) {
                    return {
                        provider: 'gemini',
                        fullText: geminiResult.fullText,
                        fields: geminiResult.fields,
                        confidence: geminiResult.confidence,
                        bboxes: geminiResult.bboxes,
                        rawResponse: geminiResult.raw,
                        processingTime: Date.now() - startTime
                    };
                }
            } catch (geminiError) {
                console.warn('Gemini OCR failed, fallback to Mindee:', geminiError);
            }
        } else {
            console.log('Gemini not configured (check .env), trying Mindee');
        }

        // Priority 2: Mindee
        if (MINDEE_API_KEY && MINDEE_API_KEY !== 'placeholder-mindee-key') {
            try {
                const mindeeResult = await callMindeeOCR(fileBuffer, mimeType);
                if (mindeeResult.confidence > 70) {
                    return {
                        provider: 'mindee',
                        fullText: mindeeResult.fullText,
                        fields: mindeeResult.fields,
                        confidence: mindeeResult.confidence,
                        bboxes: mindeeResult.bboxes,
                        rawResponse: mindeeResult.raw,
                        processingTime: Date.now() - startTime
                    };
                }
                console.log('Mindee confidence low, fallback to Textract');
            } catch (mindeeError) {
                console.warn('Mindee API failed, fallback to Textract:', mindeeError);
            }
        } else {
            console.log('Mindee not configured, skipping to Textract');
        }

        // Fallback: AWS Textract
        const textractResult = await callTextractOCR(fileBuffer);

        return {
            provider: 'textract',
            fullText: textractResult.fullText,
            fields: textractResult.fields,
            confidence: textractResult.confidence,
            bboxes: textractResult.bboxes,
            rawResponse: textractResult.raw,
            processingTime: Date.now() - startTime
        };

    } catch (error) {
        console.error('OCR processing error:', error);
        throw error;
    }
}

async function callMindeeOCR(fileBuffer: Buffer, mimeType: string) {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType });
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
                    inline_data: {
                        mime_type: geminiMimeType,
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
