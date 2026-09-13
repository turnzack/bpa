/**
 * PaywallScreen - Mur de paiement après authentification
 * 
 * Affiché APRÈS la connexion réussie, AVANT l'accès à l'analyse.
 * 
 * Flux :
 * 1. Connexion Supabase réussie → cette page
 * 2. Bouton "Payer via Wero" → ouvre Wero sur le téléphone
 * 3. Deep link retour → unlock automatique → accès /(tabs)
 * 4. Fallback "J'ai payé" → unlock manuel
 */
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
    Alert, ScrollView, Clipboard, Share
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useWeroPayment } from '@/hooks/useWeroPayment';
import { Colors } from '@/constants/Colors';

export default function PaywallScreen() {
    const router = useRouter();
    const { user, session } = useAuth();
    const {
        devisState,
        isLoading,
        error,
        payDevis,
        manualUnlock,
        checkPaymentStatus,
        weroPhone,
        weroAmount,
    } = useWeroPayment(user?.id);

    const [weroResult, setWeroResult] = useState<string | null>(null);
    const [polling, setPolling] = useState(false);

    // Si déjà payé → aller directement sur l'app
    useEffect(() => {
        if (devisState.devisUnlocked) {
            router.replace('/(tabs)');
        }
    }, [devisState.devisUnlocked]);

    // Polling Supabase quand l'user revient de Wero
    useEffect(() => {
        if (weroResult === 'wero_opened') {
            setPolling(true);
            let attempts = 0;
            const interval = setInterval(async () => {
                attempts++;
                const paid = await checkPaymentStatus();
                if (paid || attempts > 12) { // 12 × 5s = 1 minute max
                    clearInterval(interval);
                    setPolling(false);
                    if (paid) router.replace('/(tabs)');
                }
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [weroResult]);

    const handleWeroPay = async () => {
        const result = await payDevis(weroAmount);
        setWeroResult(result);

        if (result === 'qr_fallback') {
            Alert.alert(
                '📱 Wero non détecté',
                `Pas d'application Wero sur ce téléphone.\n\nVeuillez faire un virement Wero ou PayLib directement au numéro :\n\n${weroPhone}\n\nMontant : ${weroAmount}€\n\nPuis appuyez sur "J'ai payé ✓"`,
                [{ text: 'OK' }]
            );
        }
    };

    const handleManualUnlock = () => {
        Alert.alert(
            '✅ Confirmer le paiement',
            `Confirmez-vous avoir effectué le paiement de ${weroAmount}€ via Wero ou virement ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Oui, j\'ai payé',
                    onPress: async () => {
                        const ok = await manualUnlock();
                        if (ok) router.replace('/(tabs)');
                    }
                }
            ]
        );
    };

    const handleCopyPhone = () => {
        Clipboard.setString(weroPhone);
        Alert.alert('✅ Copié !', `${weroPhone} copié dans le presse-papier.`);
    };

    const handleShare = async () => {
        await Share.share({
            message: `Paiement BPA via Wero : envoyez ${weroAmount}€ au ${weroPhone}`,
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="lock-closed" size={40} color="#fff" />
                </View>
                <Text style={styles.title}>Accès à l'Analyse IA</Text>
                <Text style={styles.subtitle}>
                    Bienvenue {user?.email?.split('@')[0]} 👋{'\n'}
                    Déverrouillez l'Intelligence IA BPA pour analyser vos devis.
                </Text>
            </View>

            {/* Prix */}
            <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>Analyse complète</Text>
                <Text style={styles.price}>{weroAmount}€</Text>
                <Text style={styles.priceSub}>Paiement unique · Accès immédiat</Text>
            </View>

            {/* Fonctionnalités */}
            <View style={styles.featureList}>
                {[
                    '🧠 Analyse par IA Gemma (100% locale)',
                    '📊 Comparaison avec 45 000 prix de référence',
                    '🔍 Détection des anomalies et surcoûts',
                    '✅ Verdict expert + recommandations',
                    '📄 Rapport complet téléchargeable',
                ].map((feat, i) => (
                    <Text key={i} style={styles.feature}>{feat}</Text>
                ))}
            </View>

            {/* Erreur */}
            {error && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
            )}

            {/* Polling indicator */}
            {polling && (
                <View style={styles.pollingBox}>
                    <ActivityIndicator size="small" color={Colors.accentBlue} />
                    <Text style={styles.pollingText}>
                        Vérification du paiement Wero... (peut prendre quelques secondes)
                    </Text>
                </View>
            )}

            {/* BOUTON PRINCIPAL - Wero */}
            <TouchableOpacity
                style={styles.weroButton}
                onPress={handleWeroPay}
                disabled={isLoading || polling}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Text style={styles.weroButtonEmoji}>💸</Text>
                        <Text style={styles.weroButtonText}>Payer via Wero</Text>
                        <Text style={styles.weroButtonSub}>{weroAmount}€ → {weroPhone}</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Info numéro */}
            <View style={styles.phoneCard}>
                <Text style={styles.phoneLabel}>Numéro Wero / PayLib :</Text>
                <Text style={styles.phoneNumber}>{weroPhone}</Text>
                <View style={styles.phoneActions}>
                    <TouchableOpacity onPress={handleCopyPhone} style={styles.phoneActionBtn}>
                        <Ionicons name="copy-outline" size={16} color={Colors.accentBlue} />
                        <Text style={styles.phoneActionText}>Copier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} style={styles.phoneActionBtn}>
                        <Ionicons name="share-outline" size={16} color={Colors.accentBlue} />
                        <Text style={styles.phoneActionText}>Partager</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Séparateur */}
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Déjà payé ?</Text>
                <View style={styles.dividerLine} />
            </View>

            {/* Confirmation manuelle */}
            <TouchableOpacity
                style={styles.manualButton}
                onPress={handleManualUnlock}
                disabled={isLoading}
            >
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.accentBlue} />
                <Text style={styles.manualButtonText}>J'ai payé ✓ — Débloquer l'accès</Text>
            </TouchableOpacity>

            {/* Debug bypass */}
            <TouchableOpacity
                style={styles.debugButton}
                onPress={() => router.replace('/(tabs)')}
            >
                <Text style={styles.debugText}>Accès démo (test local uniquement)</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0F' },
    content: { padding: 24, paddingTop: 60, paddingBottom: 40 },

    header: { alignItems: 'center', marginBottom: 32 },
    iconContainer: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: Colors.accentBlue,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 26, fontWeight: 'bold', color: '#fff',
        textAlign: 'center', marginBottom: 12,
    },
    subtitle: {
        fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 22,
    },

    priceCard: {
        backgroundColor: '#1A1A2E', borderRadius: 16,
        padding: 24, alignItems: 'center', marginBottom: 24,
        borderWidth: 1, borderColor: '#2A2A4A',
    },
    priceLabel: { color: '#888', fontSize: 13, marginBottom: 8 },
    price: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
    priceSub: { color: '#4ade80', fontSize: 13 },

    featureList: {
        backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 24,
    },
    feature: { color: '#ccc', fontSize: 14, paddingVertical: 6, lineHeight: 20 },

    errorBox: {
        backgroundColor: 'rgba(255,100,100,0.15)', borderRadius: 8,
        padding: 12, marginBottom: 16,
    },
    errorText: { color: '#ff6b6b', fontSize: 13 },

    pollingBox: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: 'rgba(74,158,255,0.1)', borderRadius: 8,
        padding: 12, marginBottom: 16,
    },
    pollingText: { color: Colors.accentBlue, fontSize: 13, flex: 1 },

    weroButton: {
        backgroundColor: '#5B3DF5', borderRadius: 16,
        paddingVertical: 20, alignItems: 'center', marginBottom: 16,
        shadowColor: '#5B3DF5', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
    },
    weroButtonEmoji: { fontSize: 28, marginBottom: 4 },
    weroButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    weroButtonSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

    phoneCard: {
        backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 24,
        borderWidth: 1, borderColor: '#222',
    },
    phoneLabel: { color: '#666', fontSize: 12, marginBottom: 4 },
    phoneNumber: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 12 },
    phoneActions: { flexDirection: 'row', gap: 12 },
    phoneActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    phoneActionText: { color: Colors.accentBlue, fontSize: 13 },

    divider: {
        flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#222' },
    dividerText: { color: '#555', fontSize: 12 },

    manualButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, borderWidth: 1, borderColor: Colors.accentBlue,
        borderRadius: 12, paddingVertical: 14, marginBottom: 12,
    },
    manualButtonText: { color: Colors.accentBlue, fontSize: 15, fontWeight: '500' },

    debugButton: { alignItems: 'center', paddingVertical: 16 },
    debugText: { color: '#333', fontSize: 12, textDecorationLine: 'underline' },
});
