/**
 * 🔍 PRICE MATCHER - Matching Intelligent avec la Bibliothèque de Prix
 * Inspiré de utils/priceMatcher.lua du projet Solar2D
 * Trouve les meilleurs articles correspondant aux mots-clés de l'IA
 */

import { PriceLibraryService } from './priceLibrary';

/**
 * 🎯 Calcule le score de correspondance entre des mots-clés et un article
 */
const calculateMatchScore = (item, keywords) => {
    let score = 0;
    const itemText = `${item.nom} ${item.description || ''}`.toLowerCase();

    keywords.forEach(keyword => {
        const kw = keyword.toLowerCase();

        // Correspondance exacte du mot = +10 points
        if (itemText.includes(kw)) {
            score += 10;
        }

        // Correspondance partielle = +5 points
        const words = itemText.split(' ');
        words.forEach(word => {
            if (word.includes(kw) || kw.includes(word)) {
                score += 5;
            }
        });
    });

    return score;
};

/**
 * 🔍 Trouve les meilleurs articles correspondant aux mots-clés
 */
export const findMatchingItems = (keywords, maxResults = 10, allowedModules = null) => {
    try {
        console.log('🔍 Recherche d\'articles pour:', keywords);
        if (allowedModules) console.log('🔒 Filtre modules:', allowedModules);

        // Rechercher dans toute la bibliothèque
        const allItems = PriceLibraryService.search(keywords.join(' '));

        if (!allItems || allItems.length === 0) {
            console.log('⚠️ Aucun article trouvé');
            return [];
        }

        // 🔒 FILTRAGE PAR MODULES
        let filteredPool = allItems;
        if (allowedModules && Array.isArray(allowedModules) && allowedModules.length > 0) {
            const normalizedModules = allowedModules.map(m => m.toLowerCase().trim());

            // Si l'utilisateur est PREMIUM ou ADMIN ou a accès à TOUT, on ne filtre pas (optionnel, 
            // mais ici on suppose que allowedModules contient la liste explicite des lots autorisés)
            // Si la liste contient "tous corps d'état" ou similaire, on bypass ? 
            // Pour l'instant on filtre strict sur le nom du lot principal.

            filteredPool = allItems.filter(item => {
                const rootCategory = (item.path || '').split(' > ')[0].toLowerCase().trim();

                // Vérifier si le module racine est autorisé
                // Ex: Module "Peinture" autorise Lot "Peinture"
                return normalizedModules.some(mod =>
                    rootCategory === mod ||
                    rootCategory.includes(mod) ||
                    mod.includes(rootCategory)
                );
            });

            console.log(`🔒 ${allItems.length} -> ${filteredPool.length} articles après filtrage droits`);
        }

        // Calculer le score pour chaque article
        const scoredItems = filteredPool.map(item => ({
            ...item,
            matchScore: calculateMatchScore(item, keywords)
        }));

        // Trier par score décroissant
        const sorted = scoredItems
            .filter(item => item.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, maxResults);

        console.log(`✅ ${sorted.length} articles trouvés`);

        return sorted;

    } catch (error) {
        console.error('❌ Erreur matching:', error);
        return [];
    }
};

/**
 * 🎴 Transforme les résultats IA en articles avec prix
 */
export const aiResponseToItems = async (aiResponse, allowedModules = null) => {
    try {
        if (aiResponse.action !== 'add' || !aiResponse.keywords) {
            return null;
        }

        console.log('🎴 Transformation réponse IA en articles...');

        // Trouver les articles correspondants (avec filtre modules)
        const matchedItems = findMatchingItems(aiResponse.keywords, 10, allowedModules);

        // Enrichir avec les quantités suggérées par l'IA
        const enrichedItems = matchedItems.map(item => {
            // Chercher si l'IA a suggéré une quantité pour cet item
            const suggestedQty = aiResponse.quantities?.find(q =>
                item.nom.toLowerCase().includes(q.item.toLowerCase())
            );

            return {
                ...item,
                suggested_quantity: suggestedQty?.quantity || 1,
                suggested_unit: suggestedQty?.unit || item.unite || 'U',
                ai_reasoning: aiResponse.reasoning
            };
        });

        console.log(`✅ ${enrichedItems.length} articles enrichis`);

        return enrichedItems;

    } catch (error) {
        console.error('❌ Erreur transformation:', error);
        return null;
    }
};

/**
 * 📋 Génère des articles de devis à partir d'une réponse IA complète
 */
export const generateQuoteItems = async (fullQuoteResponse, allowedModules = null) => {
    try {
        console.log('📋 Génération des articles du devis...');

        const allItems = [];

        // Parcourir chaque catégorie
        for (const category of fullQuoteResponse.categories) {
            console.log(`📂 Traitement catégorie: ${category.name}`);

            // Pour chaque item suggéré par l'IA
            for (const aiItem of category.items) {
                // Chercher dans la bibliothèque (avec filtre)
                const matches = findMatchingItems(aiItem.keywords, 3, allowedModules);

                if (matches.length > 0) {
                    // Prendre le meilleur match
                    const bestMatch = matches[0];

                    allItems.push({
                        description: bestMatch.nom,
                        categorie: category.name,
                        quantite: aiItem.quantity,
                        unite: aiItem.unit || bestMatch.unite || 'U',
                        prix_unitaire: bestMatch.prix || bestMatch.prix_unitaire || 0,
                        total_ht: (aiItem.quantity * (bestMatch.prix || bestMatch.prix_unitaire || 0)),
                        tva: 20,
                        // Infos supplémentaires
                        ai_suggested: true,
                        original_ai_description: aiItem.description,
                        match_score: bestMatch.matchScore
                    });
                } else {
                    // Pas de match trouvé -> on vérifie si l'IA a inventé une catégorie hors modules ???
                    // Si on est strict, on devrait peut-être l'exclure ? 
                    // Mais pour la génération de devis "libre", on garde le fallback manuel 
                    // (l'utilisateur pourra supprimer). 
                    // Le User Request parle spécifiquement de la "demande de devis" (QCM IA), donc `aiResponseToItems`.
                    // Pour `generateQuoteItems`, on applique le best effort.

                    console.warn(`⚠️ Aucun match pour: ${aiItem.description}`);

                    allItems.push({
                        description: aiItem.description,
                        categorie: category.name,
                        quantite: aiItem.quantity,
                        unite: aiItem.unit || 'U',
                        prix_unitaire: 0, // À remplir manuellement
                        total_ht: 0,
                        tva: 20,
                        ai_suggested: true,
                        needs_manual_price: true
                    });
                }
            }
        }

        console.log(`✅ ${allItems.length} articles générés`);

        return {
            items: allItems,
            project_name: fullQuoteResponse.project_name,
            notes: fullQuoteResponse.notes
        };

    } catch (error) {
        console.error('❌ Erreur génération articles:', error);
        throw error;
    }
};

/**
 * 🔄 Affine la recherche en fonction du contexte
 */
export const refineSearch = (keywords, category = null, previousResults = []) => {
    try {
        let refinedKeywords = [...keywords];

        // Ajouter le contexte de catégorie
        if (category) {
            refinedKeywords.push(category.toLowerCase());
        }

        // Exclure les résultats déjà sélectionnés
        const results = findMatchingItems(refinedKeywords);

        if (previousResults.length > 0) {
            const previousIds = previousResults.map(r => r.id || r.nom);
            return results.filter(r => !previousIds.includes(r.id || r.nom));
        }

        return results;

    } catch (error) {
        console.error('❌ Erreur raffinement:', error);
        return [];
    }
};

export default {
    findMatchingItems,
    aiResponseToItems,
    generateQuoteItems,
    refineSearch
};
