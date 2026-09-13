/**
 * Store Devis - Persistance de l'état du paiement
 * Utilise expo-secure-store (déjà installé dans le projet)
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORE_KEY = 'bpa_devis_state';

export interface DevisState {
    hasActiveDevis: boolean;
    devisUnlocked: boolean;
    activeDevisId: string | null;
    paymentMethod: 'wero' | 'stripe' | 'manual' | null;
    paymentDate: string | null;
}

const DEFAULT_STATE: DevisState = {
    hasActiveDevis: false,
    devisUnlocked: false,
    activeDevisId: null,
    paymentMethod: null,
    paymentDate: null,
};

// SecureStore n'est pas disponible sur Web — fallback mémoire
const memoryStore: { [key: string]: string } = {};

const storage = {
    async get(key: string): Promise<string | null> {
        if (Platform.OS === 'web') return memoryStore[key] ?? null;
        return SecureStore.getItemAsync(key);
    },
    async set(key: string, value: string): Promise<void> {
        if (Platform.OS === 'web') { memoryStore[key] = value; return; }
        return SecureStore.setItemAsync(key, value);
    },
    async delete(key: string): Promise<void> {
        if (Platform.OS === 'web') { delete memoryStore[key]; return; }
        return SecureStore.deleteItemAsync(key);
    },
};

export const devisStore = {
    async getState(): Promise<DevisState> {
        try {
            const raw = await storage.get(STORE_KEY);
            if (!raw) return { ...DEFAULT_STATE };
            return { ...DEFAULT_STATE, ...JSON.parse(raw) };
        } catch {
            return { ...DEFAULT_STATE };
        }
    },

    async setState(partial: Partial<DevisState>): Promise<DevisState> {
        const current = await this.getState();
        const next = { ...current, ...partial };
        await storage.set(STORE_KEY, JSON.stringify(next));
        return next;
    },

    async reset(): Promise<void> {
        await storage.delete(STORE_KEY);
    },

    async unlockDevis(method: 'wero' | 'stripe' | 'manual'): Promise<DevisState> {
        return this.setState({
            devisUnlocked: true,
            paymentMethod: method,
            paymentDate: new Date().toISOString(),
        });
    },
};
