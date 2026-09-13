import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';
import { getBackendPermissions } from '../services/authService';

interface TenantContextType {
    artisanClient: SupabaseClient | null;
    permissions: any | null;
    loading: boolean;
    error: string | null;
    hasActiveSubscription: boolean;
    checkScanPaymentStatus: (scanId?: string) => Promise<boolean>;
}

const TenantContext = createContext<TenantContextType>({} as TenantContextType);

export function TenantProvider({ children }: { children: React.ReactNode }) {
    const { session } = useAuth();
    const [artisanClient, setArtisanClient] = useState<SupabaseClient | null>(null);
    const [permissions, setPermissions] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const checkScanPaymentStatus = async (scanId?: string): Promise<boolean> => {
        // TEMPORAIRE: Désactivé tant que le backend n'est pas accessible
        console.log('[TenantContext] checkScanPaymentStatus désactivé (backend inaccessible)');
        return false;
        /*
        if (!session?.access_token) return false;

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/payments/check-scan-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ scanId })
            });

            if (response.ok) {
                const data = await response.json();
                return data.hasValidPayment;
            }
            return false;
        } catch (error) {
            console.error('Error checking scan payment:', error);
            return false;
        }
        */
    };

    useEffect(() => {
        if (!session?.access_token) {
            setArtisanClient(null);
            setPermissions(null);
            return;
        }

        const initTenant = async () => {
            setLoading(true);
            setError(null);
            try {
                // TEST DE CONNEXION AU BACKEND
                const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.148:4000';
                console.log('[TenantContext] Tentative de connexion au backend:', backendUrl);

                let backendAvailable = false;

                try {
                    const testResponse = await fetch(`${backendUrl}/health`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    console.log('[TenantContext] Réponse backend:', testResponse.status);
                    const healthData = await testResponse.json();
                    console.log('[TenantContext] Health check:', healthData);
                    backendAvailable = testResponse.ok && healthData.ok === true;
                } catch (fetchError: any) {
                    console.error('[TenantContext] ÉCHEC connexion backend:', fetchError.message);
                    console.error('[TenantContext] Erreur détaillée:', fetchError);
                }

                if (backendAvailable) {
                    console.log('[TenantContext] Backend accessible - mode normal');
                } else {
                    console.log('[TenantContext] Mode dégradé - backend inaccessible');
                }

                // 1. Get Permissions from Backend Master (DÉSACTIVÉ)
                // const perms = await getBackendPermissions(session.access_token);

                // Pour l'instant, on met null et on utilise seulement Supabase Master
                setPermissions(null);
                setHasActiveSubscription(false);
                setArtisanClient(null);

            } catch (err: any) {
                console.error("Tenant Init Error", err);
                setError(err.message || "Failed to load tenant configuration");
            } finally {
                setLoading(false);
            }
        };

        initTenant();
    }, [session]);

    return (
        <TenantContext.Provider value={{ artisanClient, permissions, loading, error, hasActiveSubscription, checkScanPaymentStatus }}>
            {children}
        </TenantContext.Provider>
    );
}

export const useTenant = () => useContext(TenantContext);
