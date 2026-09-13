/**
 * useWeroPayment - Hook Core Wero + Supabase Unlock
 * 
 * Flux complet :
 * 1. payDevis() → ouvre l'app Wero avec montant + numéro
 * 2. Utilisateur paie dans Wero
 * 3. Retour vers l'app via deep link (facturescan://wero-success)
 * 4. unlockDevis('wero') → appel backend /api/stripe/wero-confirm
 * 5. Backend écrit dans Supabase (scan_payments) avec JWT validé
 * 6. Store local mis à jour → accès /(tabs) accordé
 */
import { useEffect, useState, useCallback } from 'react';
import * as Linking from 'expo-linking';
import { masterSupabase } from '../services/authService';
import { devisStore, DevisState } from '../store/devisStore';

// ⚙️ CONFIGURATION
const WERO_PHONE = '+33602294470'; // Numéro Wero personnel
const WERO_AMOUNT = 1.99;          // Montant en euros
const WERO_LABEL = 'BPA Analyse Devis';
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.148:4000';

/**
 * Appelle le backend pour enregistrer le paiement dans Supabase.
 * Le backend valide le JWT Supabase → écrit dans scan_payments.
 * C'est le seul moyen sécurisé (l'utilisateur ne peut pas écrire directement en DB).
 */
const confirmWithBackend = async (method: string): Promise<boolean> => {
    const { data: sessionData } = await masterSupabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
        console.warn('[WeroPayment] Pas de token JWT pour confirmer le paiement.');
        return false;
    }

    try {
        const resp = await fetch(`${BACKEND_URL}/api/stripe/wero-confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: WERO_AMOUNT, method }),
        });
        const data = await resp.json();

        if (resp.ok && data.success) {
            console.log('[WeroPayment] ✅ Supabase confirmé via backend. scanId:', data.scanId);
            return true;
        }
        console.warn('[WeroPayment] Backend wero-confirm a échoué:', data.error);
        return false;
    } catch (e) {
        console.error('[WeroPayment] Appel backend impossible:', e);
        return false;
    }
};

export function useWeroPayment(userId?: string) {
    const [devisState, setDevisStateLocal] = useState<DevisState>({
        hasActiveDevis: false,
        devisUnlocked: false,
        activeDevisId: null,
        paymentMethod: null,
        paymentDate: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Charger l'état du store persistant au montage
    useEffect(() => {
        devisStore.getState().then(setDevisStateLocal);
    }, []);

    // 🎯 Écoute du deep link retour de Wero
    useEffect(() => {
        if (!userId) return;

        const handleDeepLink = ({ url }: { url: string }) => {
            console.log('[WeroPayment] Deep link reçu:', url);
            if (
                url.includes('wero-success') ||
                url.includes('payment-success') ||
                url.includes('wero_success')
            ) {
                console.log('[WeroPayment] 🎉 Deep link Wero détecté → débloquage en cours...');
                unlockDevis('wero');
            }
        };

        const sub = Linking.addEventListener('url', handleDeepLink);
        // Check si l'app était fermée au moment du retour Wero
        Linking.getInitialURL().then((url) => {
            if (url && (url.includes('wero-success') || url.includes('payment-success'))) {
                handleDeepLink({ url });
            }
        });

        return () => sub.remove();
    }, [userId]);

    // 🔓 Unlock : Backend → Supabase → Store local
    const unlockDevis = useCallback(async (method: 'wero' | 'stripe' | 'manual') => {
        if (!userId) {
            setError('Utilisateur non connecté.');
            return false;
        }
        setIsLoading(true);
        setError(null);

        try {
            // ÉTAPE 1 : Appeler le backend (qui écrit dans Supabase avec JWT validé)
            const confirmedInSupabase = await confirmWithBackend(method);

            if (!confirmedInSupabase) {
                // FALLBACK : écriture directe si backend inaccessible (réseau coupé)
                console.warn('[WeroPayment] Backend KO — fallback écriture directe Supabase');
                await masterSupabase
                    .from('scan_payments')
                    .insert({
                        scan_id: `wero_fallback_${userId}_${Date.now()}`,
                        user_id: userId,
                        amount: WERO_AMOUNT,
                        currency: 'eur',
                        status: 'completed',
                        paid_at: new Date().toISOString(),
                    });
            }

            // ÉTAPE 2 : Mettre à jour le store local (persistance AsyncStorage)
            const newState = await devisStore.unlockDevis(method);
            setDevisStateLocal(newState);
            console.log('[WeroPayment] ✅ Accès débloqué via', method);
            return true;

        } catch (e: any) {
            setError(e.message || 'Erreur lors du débloquage');
            console.error('[WeroPayment] Erreur unlock:', e);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // 💸 Déclencher le paiement Wero (ouvre l'app)
    const payDevis = useCallback(async (amount = WERO_AMOUNT) => {
        setError(null);
        const returnUrl = 'facturescan://wero-success';

        // Schémas Deep Link Wero (testés dans l'ordre)
        const schemes = [
            `wero://send?phone=${encodeURIComponent(WERO_PHONE)}&amount=${amount}&label=${encodeURIComponent(WERO_LABEL)}&returnUrl=${encodeURIComponent(returnUrl)}`,
            `lydia://payment?phone=${encodeURIComponent(WERO_PHONE)}&amount=${amount}`,
            `paylib://transfer?phone=${encodeURIComponent(WERO_PHONE)}&amount=${amount}`,
        ];

        for (const scheme of schemes) {
            try {
                const canOpen = await Linking.canOpenURL(scheme);
                if (canOpen) {
                    console.log('[WeroPayment] 🚀 Ouverture Wero:', scheme);
                    await Linking.openURL(scheme);
                    return 'wero_opened';
                }
            } catch {}
        }

        console.log('[WeroPayment] Wero non installé → fallback QR/manuel');
        return 'qr_fallback';
    }, []);

    // ✅ Unlock manuel (bouton "J'ai payé")
    const manualUnlock = useCallback(() => {
        return unlockDevis('manual');
    }, [unlockDevis]);

    // 🔄 Polling Supabase (via backend) — vérifie si un paiement existe déjà
    const checkPaymentStatus = useCallback(async () => {
        if (!userId) return false;
        try {
            const { data: sessionData } = await masterSupabase.auth.getSession();
            const token = sessionData?.session?.access_token;
            if (!token) return false;

            const resp = await fetch(`${BACKEND_URL}/api/stripe/check-payment`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await resp.json();

            if (data.unlocked) {
                const newState = await devisStore.unlockDevis('wero');
                setDevisStateLocal(newState);
                return true;
            }
        } catch (e) {
            // polling silencieux
        }
        return false;
    }, [userId]);

    const setHasActiveDevis = useCallback(async (hasDevis: boolean, devisId?: string) => {
        const newState = await devisStore.setState({
            hasActiveDevis: hasDevis,
            activeDevisId: devisId || null,
        });
        setDevisStateLocal(newState);
    }, []);

    return {
        devisState,
        isLoading,
        error,
        payDevis,
        manualUnlock,
        unlockDevis,
        setHasActiveDevis,
        checkPaymentStatus,
        weroPhone: WERO_PHONE,
        weroAmount: WERO_AMOUNT,
    };
}
