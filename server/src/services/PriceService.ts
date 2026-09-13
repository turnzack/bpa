import fs from 'fs';
import path from 'path';

export interface PriceArticle {
    id: string;
    nom: string;
    type: 'ARTICLE' | 'OUVRAGE' | 'CHAPITRE' | 'LOT';
    prix?: number;
    unite?: string;
    children?: PriceArticle[];
}

export class PriceService {
    private library: Record<string, PriceArticle> = {};
    private isLoaded: boolean = false;

    constructor() {
        this.loadLibrary();
    }

    private loadLibrary() {
        try {
            const libraryPath = path.join(__dirname, '..', '..', 'data', 'bibliotheque_prix.json');
            if (fs.existsSync(libraryPath)) {
                const data = fs.readFileSync(libraryPath, 'utf8');
                this.library = JSON.parse(data);
                this.isLoaded = true;
                console.log(`[PriceService] Library loaded with ${Object.keys(this.library).length} trades.`);
            } else {
                console.warn('[PriceService] Price library file not found.');
            }
        } catch (error) {
            console.error('[PriceService] Failed to load library:', error);
        }
    }

    public findPricesForTrade(tradeId: string): PriceArticle | null {
        return this.library[tradeId] || null;
    }

    public searchInTrade(tradeId: string, keywords: string[]): PriceArticle[] {
        const trade = this.findPricesForTrade(tradeId);
        if (!trade) return [];

        const results: PriceArticle[] = [];
        this.recursiveSearch(trade, keywords, results);
        return results;
    }

    /**
     * Recherche dans TOUS les métiers de la bibliothèque
     * Retourne les meilleurs résultats tous métiers confondus
     */
    public searchAllTrades(keywords: string[], maxResults: number = 10): PriceArticle[] {
        const allResults: PriceArticle[] = [];
        
        // Parcourir tous les métiers
        for (const tradeId of Object.keys(this.library)) {
            const trade = this.library[tradeId];
            const results: PriceArticle[] = [];
            this.recursiveSearch(trade, keywords, results);
            
            // Ajouter les résultats de ce métier
            allResults.push(...results);
        }
        
        // Trier par pertinence (prix défini = article plus spécifique)
        allResults.sort((a, b) => {
            const aHasPrice = a.prix ? 1 : 0;
            const bHasPrice = b.prix ? 1 : 0;
            return bHasPrice - aHasPrice;
        });
        
        return allResults.slice(0, maxResults);
    }

    /**
     * Détecte le métier le plus pertinent basé sur les mots-clés
     */
    public detectTradeFromKeywords(keywords: string[]): string | null {
        const tradeKeywords: Record<string, string[]> = {
            'electricite': ['élec', 'électrique', 'courant', 'câble', 'prise', 'interrupteur', 'disjoncteur', 'tableau', 'ampoule', 'luminaire'],
            'plomberie': ['plomb', 'eau', 'robinet', 'tuyau', 'canalisation', 'évacuation', 'wc', 'toilettes', 'douche', 'baignoire'],
            'menuiserie': ['bois', 'porte', 'fenêtre', 'parquet', 'escalier', 'placard', 'menuis'],
            'peinture': ['peint', 'couleur', 'enduit', 'ravalement', 'façade', 'décoration'],
            'couverture': ['toit', 'tuile', 'ardoise', 'charpent', 'couvreur', 'étanchéité', 'zinc'],
            'maconnerie': ['béton', 'ciment', 'brique', 'parpaing', 'fondation', 'dalle', 'mur', 'maçon'],
            'isolation': ['isol', 'laine', 'thermique', 'phonique', 'double vitrage'],
            'chauffage': ['chauff', 'radiateur', 'chaudière', 'pompe', 'climatisation', 'ventilation'],
            'sol': ['carrel', 'moquette', 'stratifié', 'vinyle', 'terrasse', 'sol'],
            'amenagement_de_jardin': ['jardin', 'terrasse', 'clôture', 'portail', 'aménagemen', 'paysage']
        };

        let bestTrade: string | null = null;
        let bestScore = 0;

        for (const [tradeId, tradeKeywordsList] of Object.entries(tradeKeywords)) {
            const score = keywords.filter(kw => 
                tradeKeywordsList.some(tk => kw.toLowerCase().includes(tk))
            ).length;

            if (score > bestScore) {
                bestScore = score;
                bestTrade = tradeId;
            }
        }

        return bestTrade;
    }

    private recursiveSearch(node: PriceArticle, keywords: string[], results: PriceArticle[]) {
        if (node.type === 'ARTICLE' && node.nom) {
            const nameLower = node.nom.toLowerCase();
            const matchesAll = keywords.every(kw => nameLower.includes(kw.toLowerCase()));
            if (matchesAll) {
                results.push(node);
            }
        }

        if (node.children) {
            for (const child of node.children) {
                this.recursiveSearch(child, keywords, results);
            }
        }
    }

    public getStatus() {
        return {
            isLoaded: this.isLoaded,
            trades: Object.keys(this.library)
        };
    }
}

export const priceService = new PriceService();
