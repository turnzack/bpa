import libraryData from '../data/bibliotheque_prix.json';

export const PriceLibraryService = {
    // Récupérer tous les corps d'état (Lots)
    getAllLots() {
        // Convertir l'objet en tableau
        return Object.values(libraryData).map(lot => ({
            id: lot.id,
            nom: lot.nom,
            type: lot.type
        })).sort((a, b) => a.nom.localeCompare(b.nom));
    },

    // Récupérer le contenu complet d'un lot par son ID
    getLotById(id) {
        const lot = libraryData[id];
        if (!lot) return null;

        // Fonction récursive pour ajouter le path à tous les articles
        const addPathToItems = (node, path = []) => {
            if (!node) return node;

            const currentPath = [...path, node.nom];
            const enrichedNode = {
                ...node,
                path: currentPath.join(' > ')
            };

            // Si le nœud a des enfants, les enrichir récursivement
            if (node.children && Array.isArray(node.children)) {
                enrichedNode.children = node.children.map(child =>
                    addPathToItems(child, currentPath)
                );
            }

            return enrichedNode;
        };

        return addPathToItems(lot, []);
    },

    // Fonction récursive pour chercher des items (ouvrages)
    search(query) {
        if (!query) return [];
        // Si query est une chaine, on split. Si c'est déjà un tableau, on l'utilise.
        const terms = (Array.isArray(query) ? query : query.split(' '))
            .map(t => t.toLowerCase().trim())
            .filter(t => t.length > 2 && isNaN(t)); // Ignorer les mots <= 2 lettres ET les chiffres seuls (ex: "30")

        if (terms.length === 0) return [];

        const results = [];

        const traverse = (node, path = [], parentMatched = false, lotId = null) => {
            if (!node) return;

            const currentLotId = lotId || node.id;

            // Vérifier si AU MOINS UN mot est présent dans le nom (ou si le parent matchait)
            // On fait un "OR" ici pour ratisser large. Le priceMatcher fera le tri par pertinence.
            const nameLower = (node.nom || '').toLowerCase();
            const isNameMatch = terms.some(term => nameLower.includes(term));

            // Si le parent matchait, on considère que l'enfant est pertinent (contexte)
            const isMatch = parentMatched || isNameMatch;

            const hasPrice = node.prix !== undefined || node.prix_unitaire !== undefined;
            const isItem = node.type === 'ARTICLE' || (hasPrice && node.type === 'OUVRAGE');

            // Si c'est un item et qu'il y a un match (direct ou via parent)
            if (isItem && isMatch) {
                results.push({
                    ...node,
                    lotId: currentLotId,
                    prix_unitaire: node.prix || node.prix_unitaire || 0,
                    path: path.join(' > ')
                });
            }

            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(child => {
                    // Note: on passe 'isMatch' aux enfants. Si le dossier parent (ex: "Peinture") matche,
                    // alors tous les enfants seront inclus. C'est peut-être trop large ? 
                    // Pour l'instant on garde ça, le scoring filtrera.
                    traverse(child, [...path, node.nom], isMatch, currentLotId);
                });
            }
        };

        Object.values(libraryData).forEach(lot => traverse(lot, [lot.nom], false, lot.id));
        return results;
    }
};
