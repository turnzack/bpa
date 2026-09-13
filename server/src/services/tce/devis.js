import { ArtisanDbService } from './artisanDb';
import { AuthService } from './auth';

export const DevisService = {
    async generateNumero() {
        const db = ArtisanDbService.getClient();
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const prefix = `${yyyy}-${mm}-${dd}`;

        const { data, error } = await db
            .from('devis')
            .select('numero')
            .ilike('numero', `${prefix}%`)
            .order('created_at', { ascending: false })
            .limit(1);

        let sequence = 1;
        if (data && data.length > 0) {
            const lastNum = data[0].numero;
            const parts = lastNum.split('-');
            if (parts.length === 4) {
                const lastSeq = parseInt(parts[3], 10);
                if (!isNaN(lastSeq)) sequence = lastSeq + 1;
            }
        }
        return `${prefix}-${String(sequence).padStart(2, '0')}`;
    },

    async getAll() {
        const db = ArtisanDbService.getClient();

        // On récupère les devis avec les infos du client associé
        const { data, error } = await db
            .from('devis')
            .select(`
                *,
                client:clients(*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error loading devis:', error);
            throw error;
        }

        return data || [];
    },

    async getById(id) {
        const db = ArtisanDbService.getClient();
        const { data, error } = await db
            .from('devis')
            .select(`
                *,
                client:clients(*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('❌ Error loading devis details:', error);
            throw error;
        }
        return data;
    },

    async create(devisData) {
        const user = await AuthService.getUser();
        if (!user) throw new Error("User not authenticated");

        const db = ArtisanDbService.getClient();

        // Si items est présent, assurez-vous que c'est du JSON valide
        const cleanData = { ...devisData };
        if (cleanData.client) {
            // Le frontend envoie parfois l'objet client entier, on veut juste l'ID pour la liaison
            if (cleanData.client.id) {
                cleanData.client_id = cleanData.client.id;
            }
            delete cleanData.client;
        }

        // Génération automatique du numéro au format AAAA-MM-JJ-XX
        if (!cleanData.numero) {
            cleanData.numero = await this.generateNumero();
        }

        if (cleanData.items && Array.isArray(cleanData.items)) {
            let ht = 0;
            let totalTva = 0;

            // Recalculer chaque item et les totaux
            cleanData.items = cleanData.items.map(item => {
                const qty = Number(item.quantite) || 0;
                const pu = Number(item.prix_unitaire) || 0;
                const rowHt = qty * pu;
                const tvaRate = (Number(item.tva) || 20) / 100;

                ht += rowHt;
                totalTva += rowHt * tvaRate;

                return {
                    ...item, // Préserver TOUS les champs (métier, catégorie, etc.)
                    total_ht: rowHt,
                    quantite: qty,
                    prix_unitaire: pu,
                    tva: (tvaRate * 100)
                };
            });

            cleanData.total_ht = ht.toFixed(2);
            cleanData.total_tva = totalTva.toFixed(2);
            cleanData.total_ttc = (ht + totalTva).toFixed(2);
        }

        const { data, error } = await db
            .from('devis')
            .insert({
                ...cleanData,
                user_id: user.id
            })
            .select()
            .single();

        if (error) {
            console.error('❌ Error creating devis:', JSON.stringify(error, null, 2));
            throw error;
        }

        return data;
    },

    async update(id, updates) {
        const db = ArtisanDbService.getClient();

        const cleanUpdates = { ...updates };
        if (cleanUpdates.client) {
            // Extraction ID si objet complet passé par erreur
            cleanUpdates.client_id = cleanUpdates.client.id;
            delete cleanUpdates.client;
        }

        // ⚠️ Preservation explicite de tva_mention (si présent dans l'objet devis mais pas dans updates explicites, on l'ajoute)
        // Mais ici 'updates' contient normalement tout l'objet devis modifié, donc 'tva_mention' devrait y être.
        // On s'assure juste qu'il n'est pas effacé par inadvertance.
        if (updates.tva_mention !== undefined) {
            cleanUpdates.tva_mention = updates.tva_mention;
        }

        // delete cleanUpdates.template; // Temporaire : colonne manquante en prod - RETABLIE POUR SAUVEGARDE

        const { data, error } = await db
            .from('devis')
            .update(cleanUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('❌ Error updating devis:', error);
            throw error;
        }
        return data;
    },

    async delete(id) {
        const db = ArtisanDbService.getClient();
        const { error } = await db
            .from('devis')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('❌ Error deleting devis:', error);
            throw error;
        }
        return true;
    },

    async addItems(devisId, items) {
        const db = ArtisanDbService.getClient();
        const current = await this.getById(devisId);
        if (!current) throw new Error("Devis introuvable");

        const currentItems = current.items || [];

        // Formater les nouveaux items en préservant métier et catégorie
        const newItemsFormatted = items.map(item => ({
            metier: item.metier || '',
            categorie: item.categorie || '',
            description: item.nom || item.description || 'Article',
            quantite: item.quantite || 1,
            prix_unitaire: item.prix || item.prix_unitaire || 0,
            unite: item.unite || 'U',
            total_ht: (item.prix || item.prix_unitaire || 0) * (item.quantite || 1),
            tva: item.tva || 20
        }));

        // AJOUTER aux items existants (ne pas écraser)
        const allItems = [...currentItems, ...newItemsFormatted];

        let ht = 0;
        let totalTva = 0;

        const finalItems = allItems.map(item => {
            const qty = Number(item.quantite) || 0;
            const pu = Number(item.prix_unitaire) || 0;
            const rowHt = qty * pu;
            const tvaRate = (Number(item.tva) || 20) / 100;
            ht += rowHt;
            totalTva += rowHt * tvaRate;

            return {
                ...item,
                total_ht: rowHt
            };
        });

        const { data, error } = await db
            .from('devis')
            .update({
                items: finalItems,
                total_ht: ht.toFixed(2),
                total_tva: totalTva.toFixed(2),
                total_ttc: (ht + totalTva).toFixed(2)
            })
            .eq('id', devisId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
