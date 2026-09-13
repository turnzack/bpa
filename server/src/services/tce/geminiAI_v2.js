/**
 * 🧠 GEMINI AI SERVICE V2 - EXACTEMENT comme aiProcessor.lua
 * Reprend TOUTE la logique du fichier Solar2D original
 * Ligne par ligne adapté pour JavaScript/React Native
 */

import { AiService } from './ai';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent';

// ... PROMPTS SYSTEME ...
const SYSTEM_PROMPTS = {
    // Prompt pour la recherche interactive (ligne 166 aiProcessor.lua)
    INTERACTIVE_SEARCH: `Tu es un assistant expert en devis de construction/rénovation.
Ton rôle est d'aider l'utilisateur à trouver les bons articles dans une bibliothèque de prix du bâtiment.

RÈGLES STRICTES:
1. Si la demande est CLAIRE et PRÉCISE → Retourne une liste de mots-clés pour chercher dans la bibliothèque
2. Si la demande est FLOUE ou INCOMPLÈTE → Pose UNE question de clarification
3. TOUJOURS penser aux articles complémentaires nécessaires (DTU, normes)
4. Considérer les quantités et unités appropriées

CONTEXTE MÉTIER:
- Peinture nécessite: sous-couche, scotch de masquage, bâches
- Carrelage nécessite: colle, joints, croisillons
- Plomberie nécessite: raccords, joints, téflon
- Électricité nécessite: gaines, dominos, boîtes de dérivation

FORMAT DE RÉPONSE (JSON STRICT):
{
  "action": "ask" ou "add",
  "question": "Ta question si action=ask",
  "keywords": ["mot1", "mot2", "mot3"] si action=add,
  "quantities": [{"item": "description", "quantity": 10, "unit": "m²"}],
  "reasoning": "Explication de ta décision"
}

EXEMPLES:
User: "peinture salon 20m2"
→ {"action": "add", "keywords": ["peinture", "acrylique", "blanc", "sous-couche", "scotch"], "quantities": [{"item": "peinture murale", "quantity": 20, "unit": "m²"}]}

User: "je veux refaire ma salle de bain"
→ {"action": "ask", "question": "Quelle surface fait votre salle de bain ? Et souhaitez-vous refaire le carrelage, la plomberie, ou les deux ?"}`,

    // Prompt pour la génération complète (ligne 189 aiProcessor.lua)
    FULL_QUOTE_GENERATOR: `Tu es un expert en devis de construction.
À partir d'une description de projet, tu dois générer un devis COMPLET et DÉTAILLÉ.

RÈGLES:
1. Décomposer le projet en catégories (PEINTURE, CARRELAGE, PLOMBERIE, etc.)
2. Lister TOUS les articles nécessaires avec quantités précises
3. Inclure les fournitures ET la main d'œuvre
4. Respecter les normes DTU et l'ordre logique des travaux
5. Penser aux finitions et aux protections

FORMAT DE RÉPONSE (JSON):
{
  "articles": [
    {
      "titre": "Description de l'article",
      "categorie": "PEINTURE",
      "quantite": 20,
      "unite": "m²"
    }
  ],
  "notes": "Remarques importantes sur le projet"
}`
};

/**
 * 📞 Fonction générique pour appeler l'API Gemini
 * Exactement comme callGeminiAPI() ligne 58-142 de aiProcessor.lua
 */
/**
 * 📞 Fonction générique pour appeler l'API Gemini avec historique
 */
const callGeminiAPI = async (systemPrompt, userMessage, history = []) => {
    try {
        console.log('[AI-PROC:INFO] Appel Gemini API (avec historique)...', history.length, 'messages');

        let apiKey = await AiService.getKey();
        if (!apiKey) throw new Error("Clé API Gemini manquante. Veuillez la configurer dans Paramètres > IA.");

        // 1. Construire le contenu avec l'historique
        let contents = [];

        // Ajouter l'historique (sans le message système qui va dans system_instruction)
        if (history && history.length > 0) {
            // Filtrer les messages pour s'assurer que l'historique commence par un message utilisateur
            // Gemini rejette souvent les requêtes si le premier message est du modèle
            let filteredHistory = [...history];

            // Si le premier message est du modèle (ex: salutation), on le supprime (ou on le combine, mais suppression plus simple)
            while (filteredHistory.length > 0 && filteredHistory[0].role === 'assistant') {
                console.log('[AI-PROC:INFO] Suppression message modèle en début d\'historique (Gemini req: User first)');
                filteredHistory.shift();
            }

            contents = filteredHistory.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));
        }

        // Ajouter le nouveau message utilisateur
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        // DEBUG: Vérifier la structure
        // console.log('[AI-PROC:DEBUG] Payload Contents:', JSON.stringify(contents, null, 2));

        // 2. Payload Gemini V1Beta
        const body = {
            system_instruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000,
                response_mime_type: 'application/json'
            }
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[AI-PROC:ERROR] API Error Details:', errorText);
            throw new Error(`Erreur réseau: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error('[AI-PROC:ERROR] Erreur API Gemini:', data.error.message);
            throw new Error(`Erreur Gemini: ${data.error.message}`);
        }

        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                let contentText = candidate.content.parts[0].text;
                contentText = contentText.replace(/^\s*```json\s*/, '').replace(/^\s*```\s*/, '').replace(/\s*```\s*$/, '');
                try {
                    const parsedData = JSON.parse(contentText);
                    console.log('[AI-PROC:INFO] Réponse IA validée (JSON).');
                    return parsedData;
                } catch (e) {
                    console.error('[AI-PROC:ERROR] JSON Parse Error:', contentText);
                    // Tentative de récupération si le JSON est malformé mais contient des infos utiles
                    if (contentText.includes('{')) {
                        // Fallback pour essayer de fixer le JSON (très basique)
                        throw new Error("Réponse IA invalide (JSON malformé)");
                    }
                    throw e;
                }
            }
        }
        throw new Error('Aucune réponse générée par l\'IA');

    } catch (error) {
        console.error('[AI-PROC:ERROR]', error);
        throw error;
    }
};

/**
 * 🔍 Recherche Interactive
 * Exactement comme M.getInteractiveResponse() ligne 147-177 de aiProcessor.lua
 */
export const getInteractiveResponse = async (query, conversationHistory = []) => {
    try {
        // Simplification: on prend juste la requête courante (ligne 148-155)
        const searchText = typeof query === 'object' ? query.query : query;

        if (!searchText || searchText === '') {
            throw new Error('La requête est vide.');
        }

        console.log('[AI-PROC:INFO] Appel Gemini (Interactive)...');

        // Récupérer le prompt système (ligne 166)
        const systemPrompt = SYSTEM_PROMPTS.INTERACTIVE_SEARCH;
        if (!systemPrompt) {
            throw new Error('Prompt INTERACTIVE_SEARCH manquant');
        }

        // Appeler Gemini avec l'historique
        const response = await callGeminiAPI(systemPrompt, searchText, conversationHistory);

        return response;

    } catch (error) {
        console.error('❌ Erreur Gemini AI:', error);

        // Fallback (comme dans l'original)
        return {
            action: 'ask',
            question: "Désolé, je n'ai pas bien compris. Pouvez-vous préciser votre demande ?",
            reasoning: 'Erreur de traitement'
        };
    }
};

/**
 * 📝 Génération de Devis Complet
 * Exactement comme M.generateFullQuote() ligne 182-226 de aiProcessor.lua
 */
export const generateFullQuote = async (projectDescription) => {
    try {
        if (!projectDescription || projectDescription === '') {
            throw new Error('La description du projet est vide.');
        }

        console.log('[AI-PROC:INFO] Appel Gemini (Devis Complet)...');

        // Récupérer le prompt système (ligne 189)
        const systemPrompt = SYSTEM_PROMPTS.FULL_QUOTE_GENERATOR;
        if (!systemPrompt) {
            throw new Error('Prompt FULL_QUOTE_GENERATOR manquant');
        }

        // Appeler Gemini (ligne 200)
        const response = await callGeminiAPI(systemPrompt, projectDescription);

        // POST-TRAITEMENT: Matching avec la base de prix locale (ligne 206-222)
        if (response && response.articles) {
            const { findMatchingItems } = require('./priceMatcher');

            for (const article of response.articles) {
                // Chercher le meilleur match dans la bibliothèque (ligne 211)
                const keywords = [article.titre, article.categorie].filter(Boolean);
                const matches = findMatchingItems(keywords, 1);

                if (matches && matches.length > 0) {
                    const match = matches[0];
                    console.log(`[AI-PROC:INFO] Match trouvé pour '${article.titre}' → '${match.nom}' (${match.prix || match.prix_unitaire}€)`);

                    // Enrichir l'article avec les données réelles (ligne 214-217)
                    article.titre = match.nom;
                    article.prix_estime = match.prix || match.prix_unitaire || 0;
                    article.unite = match.unite || 'U';
                    article.is_database_match = true;
                } else {
                    console.warn(`[AI-PROC:WARN] Aucun match pour '${article.titre}'`);
                    article.is_database_match = false;
                }
            }
        }

        return response;

    } catch (error) {
        console.error('❌ Erreur génération devis:', error);
        throw error;
    }
};

/**
 * 🎤 Speech-to-Text (Gemini)
 */
export const transcribeAudio = async (audioBase64) => {
    try {
        console.log('🎤 Transcription audio...');

        let apiKey = await AiService.getKey();
        if (!apiKey) apiKey = DEFAULT_KEY;

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: 'Transcris cet audio en français:' },
                        {
                            inlineData: {
                                mimeType: 'audio/wav',
                                data: audioBase64
                            }
                        }
                    ]
                }]
            })
        });

        const data = await response.json();
        const transcription = data.candidates[0].content.parts[0].text;

        console.log('✅ Transcription:', transcription);
        return transcription;

    } catch (error) {
        console.error('❌ Erreur transcription:', error);
        throw error;
    }
};

/**
 * 🔊 Text-to-Speech (Gemini)
 */
export const textToSpeech = async (text) => {
    try {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
            return true;
        }

        console.warn('⚠️ Speech Synthesis non disponible');
        return false;

    } catch (error) {
        console.error('❌ Erreur TTS:', error);
        return false;
    }
};

export default {
    getInteractiveResponse,
    generateFullQuote,
    transcribeAudio,
    textToSpeech
};
