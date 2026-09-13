import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '../constants/Config';
import axios from 'axios';
import { Platform } from 'react-native';

// Custom storage for Supabase - stores only essential token data
// Supabase stores session as JSON: { access_token, refresh_token, user, ... }
// We split large sessions across multiple keys to avoid 2048 bytes limit
const SESSION_PREFIX = 'sb_session_';

const authStorage = {
    getItem: (key: string) => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined' && window.localStorage) {
                return Promise.resolve(window.localStorage.getItem(key));
            }
            return Promise.resolve(null);
        }
        // Try to get split session parts
        return getSplitSession(key);
    },
    setItem: (key: string, value: string) => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, value);
            }
            return Promise.resolve();
        }
        // Split large sessions across multiple keys
        return setSplitSession(key, value);
    },
    removeItem: (key: string) => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
            }
            return Promise.resolve();
        }
        return removeSplitSession(key);
    },
};

async function getSplitSession(key: string): Promise<string | null> {
    // First check if we have split parts
    const part0 = await SecureStore.getItemAsync(`${SESSION_PREFIX}${key}_0`);
    if (part0 === null) {
        // No split session, try direct key
        return SecureStore.getItemAsync(key);
    }
    
    // Reconstruct split session
    let fullSession = part0;
    let index = 1;
    while (true) {
        const part = await SecureStore.getItemAsync(`${SESSION_PREFIX}${key}_${index}`);
        if (part === null) break;
        fullSession += part;
        index++;
    }
    return fullSession;
}

async function setSplitSession(key: string, value: string): Promise<void> {
    // Clear any existing split session
    await removeSplitSession(key);
    
    // Split value into chunks of ~1800 bytes (under 2048 limit)
    const chunkSize = 1800;
    let index = 0;
    
    while (index * chunkSize < value.length) {
        const chunk = value.slice(index * chunkSize, (index + 1) * chunkSize);
        await SecureStore.setItemAsync(`${SESSION_PREFIX}${key}_${index}`, chunk);
        index++;
    }
}

async function removeSplitSession(key: string): Promise<void> {
    // Remove direct key
    await SecureStore.deleteItemAsync(key);
    
    // Remove all split parts
    let index = 0;
    while (true) {
        const partKey = `${SESSION_PREFIX}${key}_${index}`;
        const part = await SecureStore.getItemAsync(partKey);
        if (part === null) break;
        await SecureStore.deleteItemAsync(partKey);
        index++;
    }
}

// Master Client for Authentication
export const masterSupabase = createClient(
    CONFIG.MASTER_SUPABASE_URL,
    CONFIG.MASTER_SUPABASE_ANON_KEY,
    {
        auth: {
            storage: authStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    }
);

export async function getBackendPermissions(token: string) {
    try {
        const response = await axios.get(`${CONFIG.BACKEND_URL}/api/auth/permissions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw error;
    }
}

// Récupère les headers d'authentification pour les appels API backend
export async function getAuthHeaders() {
    const { data: { session } } = await masterSupabase.auth.getSession();
    if (!session?.access_token) return {};
    
    return {
        'Authorization': `Bearer ${session.access_token}`
    };
}
