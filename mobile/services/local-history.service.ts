import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const HISTORY_FILE = FileSystem.documentDirectory ? `${FileSystem.documentDirectory}bpa_local_history.json` : 'bpa_local_history.json';
const WEB_STORAGE_KEY = 'bpa_local_history';

export interface LocalScan {
    id: string;
    numero: string;
    nom_projet: string;
    status: 'pending' | 'completed';
    created_at: string;
    metadata: {
        html: string;
        raw_text?: string;
    };
    hasPaid: boolean;
}

export const LocalHistoryService = {
    async saveScan(scan: LocalScan) {
        try {
            const history = await this.getHistory();
            const newHistory = [scan, ...history];
            
            if (Platform.OS === 'web') {
                localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(newHistory));
                return true;
            }

            await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify(newHistory));
            return true;
        } catch (e) {
            console.error('[LocalHistory] Save error:', e);
            return false;
        }
    },

    async getHistory(): Promise<LocalScan[]> {
        try {
            if (Platform.OS === 'web') {
                try {
                    const data = localStorage.getItem(WEB_STORAGE_KEY);
                    return data ? JSON.parse(data) : [];
                } catch (jsonErr) {
                    console.error('[WebHistory] Format JSON invalide:', jsonErr);
                    return [];
                }
            }

            try {
                const data = await FileSystem.readAsStringAsync(HISTORY_FILE);
                return data ? JSON.parse(data) : [];
            } catch (parseErr) {
                console.error('[LocalHistory] Erreur lecture fichier:', parseErr);
                return [];
            }
        } catch (e) {
            console.error('[LocalHistory] Load error:', e);
            return [];
        }
    },

    async markAsPaid(scanId: string) {
        return this.updatePaymentStatus(scanId, true);
    },

    async updatePaymentStatus(scanId: string, paid: boolean) {
        try {
            console.log(`[LocalHistory] Mise à jour paiement pour ${scanId}: ${paid}`);
            const history = await this.getHistory();
            const newHistory = history.map(s => 
                s.id === scanId ? { ...s, hasPaid: paid, status: (paid ? 'completed' : s.status) as any } : s
            );

            if (Platform.OS === 'web') {
                localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(newHistory));
                return true;
            }

            await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify(newHistory));
            return true;
        } catch (e) {
            console.error('[LocalHistory] Update status error:', e);
            return false;
        }
    },

    async deleteScan(scanId: string) {
        try {
            console.log(`[LocalHistory] Suppression du scan: ${scanId}`);
            const history = await this.getHistory();
            const newHistory = history.filter(s => s.id !== scanId);

            if (Platform.OS === 'web') {
                localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(newHistory));
                return true;
            }

            await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify(newHistory));
            return true;
        } catch (e) {
            console.error('[LocalHistory] Delete error:', e);
            return false;
        }
    },

    async clearHistory() {
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem(WEB_STORAGE_KEY);
                return;
            }
            await FileSystem.deleteAsync(HISTORY_FILE, { idempotent: true });
        } catch (e) {}
    }
};
