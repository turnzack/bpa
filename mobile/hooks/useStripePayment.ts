/**
 * useStripePayment - Hook d'intégration Stripe Checkout
 */
import { useEffect, useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { CONFIG } from '@/constants/Config';
import { masterSupabase } from '../services/authService';
import { devisStore, DevisState } from '../store/devisStore';

const BACKEND_URL = CONFIG.BACKEND_URL;

export function useStripePayment(userId?: string) {
    const [devisState, setDevisStateLocal] = useState<DevisState>({
        hasActiveDevis: false,
        devisUnlocked: false,
        activeDevisId: null,
        paymentMethod: null,
        paymentDate: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialisation
    useEffect(() => {
        devisStore.getState().then(setDevisStateLocal);
    }, []);

    // 🎯 Écoute du retour de Stripe
    useEffect(() => {
        if (!userId) return;

        const handleSuccess = async (scanId: string) => {
            console.log('[StripePayment] 🎉 Confirmation du paiement pour:', scanId);
            try {
                const { LocalHistoryService } = require('@/services/local-history.service');
                await LocalHistoryService.markAsPaid(scanId);
                console.log(`[StripePayment] Document ${scanId} débloqué localement.`);
                await unlockDevis('stripe');
            } catch (e) {
                console.error('[StripePayment] Échec déblocage local:', e);
            }
        };

        // 🌐 Gestion spécifique au WEB (URL params)
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('stripe-success') === 'true') {
                const scanId = params.get('scanId');
                if (scanId) handleSuccess(scanId);
                // Nettoyer l'URL
                window.history.replaceState({}, '', window.location.pathname);
            } else if (params.get('stripe-cancel') === 'true') {
                setError('Paiement annulé.');
                window.history.replaceState({}, '', window.location.pathname);
            }
        }

        // 📱 Gestion NATIVE (Deep Linking)
        const handleDeepLink = async ({ url }: { url: string }) => {
            console.log('[StripePayment] Deep link reçu:', url);
            if (url.includes('stripe-success')) {
                const parsed = Linking.parse(url);
                const scanId = parsed.queryParams?.scanId as string;
                if (scanId) await handleSuccess(scanId);
            } else if (url.includes('stripe-cancel')) {
                setError('Paiement annulé.');
            }
        };

        const sub = Linking.addEventListener('url', handleDeepLink);
        Linking.getInitialURL().then((url) => {
            if (url && (url.includes('stripe-success') || url.includes('stripe-cancel'))) {
                handleDeepLink({ url });
            }
        });

        return () => sub.remove();
    }, [userId]);

    // 🔓 Unlock local
    const unlockDevis = useCallback(async (method: 'stripe' | 'wero' | 'manual') => {
        setIsLoading(true);
        try {
            const newState = await devisStore.unlockDevis(method);
            setDevisStateLocal(newState);
            return true;
        } catch (e: any) {
            console.error('[StripePayment] Erreur auth unlock:', e);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // 💸 Déclencher le paiement Stripe pour un document spécifique
    const payDevis = useCallback(async ({ devisId, amount }: { devisId?: string, amount?: number } = {}) => {
        if (!userId) {
            setError('Utilisateur non connecté.');
            return 'error';
        }
        setIsLoading(true);
        setError(null);

        try {
            const { data: sessionData } = await masterSupabase.auth.getSession();
            const token = sessionData?.session?.access_token;
            if (!token) throw new Error('Authentification requise (session expirée)');

            const stripeUrl = `${BACKEND_URL}/api/stripe/create-scan-checkout`;
            console.log(`[StripePayment] 🚀 Appel backend: ${stripeUrl} pour ${devisId || 'nouveau scan'}`);
            
            const response = await fetch(stripeUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    scanId: devisId, 
                    amount: amount || 249 
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Erreur serveur: ${response.status}`);
            }

            const data = await response.json();

            if (data.url) {
                console.log('[StripePayment] ✅ URL reçue, ouverture navigateur:', data.url);
                
                try {
                    // Tentative avec WebBrowser d'abord (plus premium)
                    const result = await WebBrowser.openBrowserAsync(data.url);
                    console.log('[StripePayment] Browser ouvert result:', result.type);
                } catch (browserErr) {
                    console.warn('[StripePayment] WebBrowser a échoué, fallback Linking:', browserErr);
                    // Fallback sur Linking si WebBrowser échoue
                    await Linking.openURL(data.url);
                }
                
                return 'checkout_opened';
            } else {
                throw new Error('URL de paiement non reçue du serveur.');
            }
        } catch (e: any) {
            setError(e.message);
            console.error('[StripePayment] ❌ Erreur critique:', e);
            Alert.alert('Erreur de paiement', e.message || 'Impossible de lancer le paiement.');
            return 'error';
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    return {
        devisState,
        isLoading,
        error,
        payDevis,
        unlockDevis
    };
}
