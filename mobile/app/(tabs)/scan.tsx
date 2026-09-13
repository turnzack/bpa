import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useStripePayment } from '@/hooks/useStripePayment';
import { masterSupabase, getAuthHeaders } from '@/services/authService';
import { CONFIG } from '@/constants/Config';
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system/legacy';

import { LocalHistoryService } from '@/services/local-history.service';
import * as Linking from 'expo-linking';

// Fonction pour générer un HTML propre depuis les données JSON d'analyse
function generateAnalyseHtml(analyseData: any) {
    const a = analyseData?.analyse || analyseData;
    if (!a) return '<div style="color:white; padding:10px;">Données d\'analyse non disponibles</div>';
    
    // Utilitaire pour formater les nombres en toute sécurité
    const fn = (val: any, decimals = 2) => {
        if (val === undefined || val === null) return '-';
        const n = typeof val === 'string' ? parseFloat(val) : val;
        return isNaN(n) ? '-' : n.toFixed(decimals);
    };

    let html = `
    <style>
        .audit-devis { font-family: sans-serif; color: #E0E0E0; line-height: 1.4; padding: 10px; }
        h2 { color: #64B5F6; font-size: 16px; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 5px;}
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; background: #1A1A1A; border-radius: 8px; overflow: hidden; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #333; font-size: 12px; }
        th { background: #333; color: white; }
        .ecart-vert { color: #4CAF50; }
        .ecart-jaune { color: #FFEB3B; }
        .ecart-orange { color: #FF9800; }
        .ecart-rouge { color: #F44336; }
        .total-ht { background: #263238; }
        .total-ttc { background: #1B5E20; }
    </style>
    <div class="audit-devis">
    `;
    
    // Tableau 1 : Articles
    html += '<h2>🔍 Détail des ouvrages</h2>';
    html += '<table><thead><tr><th>Article</th><th>Qté</th><th>Devis</th><th>Réf.</th><th>Écart</th></tr></thead><tbody>';
    (a.articles || []).forEach((art: any) => {
        const statut = art.statut || 'gris';
        const ecartClass = statut === 'vert' ? 'ecart-vert' : statut === 'jaune' ? 'ecart-jaune' : statut === 'orange' ? 'ecart-orange' : 'ecart-rouge';
        html += `<tr>
            <td>${art.designation || 'Non spécifié'}</td>
            <td>${art.quantite ?? '-'} ${art.unite || ''}</td>
            <td>${fn(art.prix_devis)} €</td>
            <td>${fn(art.prix_ref)} €</td>
            <td class="${ecartClass}">${fn(art.ecart_pourcent, 1)}%</td>
        </tr>`;
    });
    html += '</tbody></table>';

    if (a.estimation_globale) {
        const eg = a.estimation_globale;
        html += '<h2>💰 Estimation globale</h2>';
        html += '<table><tbody>';
        html += `<tr><td>Main d'œuvre</td><td>Devis: ${fn(eg.main_oeuvre_devis)} €</td><td>Réf: ${fn(eg.main_oeuvre_marche)} €</td></tr>`;
        html += `<tr class="total-ht"><td><strong>TOTAL HT</strong></td><td><strong>${fn(eg.total_ht_devis)} €</strong></td><td><strong>Écart: ${fn(eg.ecart_pourcent, 1)}%</strong></td></tr>`;
        html += `<tr class="total-ttc"><td><strong>TOTAL TTC</strong></td><td><strong>${fn(eg.total_ttc_devis)} €</strong></td><td>${eg.appreciation || ''}</td></tr>`;
        html += '</tbody></table>';
    }

    if (a.verdict) {
        const v = a.verdict;
        html += '<h2>✅ Verdict</h2>';
        html += `<p style="color:white; background:#333; padding:10px; border-radius:8px;">${v.global || '-'} - ${v.recommandation || ''}</p>`;
    }
    
    html += '</div>';
    return html;
}

export default function LibraryScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user, session } = useAuth();
    const { payDevis, isLoading: stripeLoading } = useStripePayment(user?.id);

    const [realProjects, setRealProjects] = useState<any[]>([]);
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [viewingAnalysis, setViewingAnalysis] = useState<any | null>(null);

    // Charger la bibliothèque réelle depuis le stockage LOCAL
    const fetchLibrary = async () => {
        setLoadingLibrary(true);
        try {
            // Vérifier les paiements réels dans Supabase de façon sécurisée
            let paidIds: string[] = [];
            if (user?.id) {
                try {
                    const { data, error } = await masterSupabase
                        .from('scan_payments')
                        .select('scan_id')
                        .eq('user_id', user.id)
                        .eq('status', 'completed');
                    
                    if (!error && data) {
                        paidIds = data.map(d => d.scan_id);
                    }
                } catch (dbErr) {
                    console.info('[Sync] Table scan_payments inaccessible, utilisation du mode autonome.');
                }
            }

            const data = await LocalHistoryService.getHistory();
            
            // On met à jour le statut 'hasPaid' si Supabase dit que c'est payé
            const updatedData = data.map((s: any) => ({
                ...s,
                hasPaid: s.hasPaid || paidIds.includes(s.id)
            }));

            setRealProjects(updatedData);
        } catch (e) {
            console.error('[Local Library] Error fetching:', e);
        } finally {
            setLoadingLibrary(false);
        }
    };

    useEffect(() => {
        fetchLibrary();
    }, [user?.id]);

    // Rafraîchir quand on revient de Stripe (Web ou Mobile)
    useEffect(() => {
        const sub = Linking.addEventListener('url', () => fetchLibrary());
        return () => sub.remove();
    }, []);

    const handleViewAnalysis = async (project: any) => {
        if (!project.metadata?.html) {
            Alert.alert('Erreur', 'Aucun contenu d\'analyse trouvé pour ce document.');
            return;
        }
        setViewingAnalysis(project);
    };

    const handleScanDocument = async () => {
        await launchScanner();
    };

    const launchScanner = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                setAnalyzing(true);
                
                try {
                    // 1. Envoyer au serveur pour extraction de texte (OCR)
                    console.log("📤 [SOUVERAIN] Envoi pour extraction de texte...");
                    const headers = await getAuthHeaders();
                    
                    const formData = new FormData();
                    formData.append('file', {
                        uri: asset.uri,
                        name: asset.name,
                        type: asset.mimeType || 'application/pdf'
                    } as any);

                    const response = await fetch(`${CONFIG.BACKEND_URL}/api/ai/chat`, {
                        method: 'POST',
                        headers: {
                            ...headers,
                            'Accept': 'application/json',
                        },
                        body: formData
                    });

                    const data = await response.json();
                    
                    // 🛡️ [DIAMOND-SOUVERAIN] On utilise le texte BRUT (sans blabla) pour Gemma
                    const docText = data.raw_text || data.response || `Contenu du fichier ${asset.name}`;

                    // 2. Lancer l'IA LOCALE avec le vrai texte du document
                    console.log("🧠 [SOUVERAIN] Analyse Gemma (On-Device) en cours...");
                    console.log("📝 Texte reçu (50 car.):", docText.substring(0, 50));
                    
                    const localAnalysis = await LocalAiService.getInstance().chat(`Voici le contenu du devis à auditer : \n${docText}`);
                    
                    // Préparation HTML
                    let htmlContent = "";
                    try {
                        const jsonMatch = localAnalysis.match(/\{[\s\S]*\}/);
                        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
                        htmlContent = parsed ? generateAnalyseHtml(parsed) : `<div style="color:white; padding:10px;">${localAnalysis}</div>`;
                    } catch(e) {
                        htmlContent = `<div style="color:white; padding:10px;">${localAnalysis}</div>`;
                    }

                    // 🦁 [SOUVERAIN] Sauvegarde LOCALE
                    console.log('💾 Sauvegarde avec contenu réel...');
                    await LocalHistoryService.saveScan({
                        id: `local_${Date.now()}`,
                        numero: `SCAN-${Date.now()}`,
                        nom_projet: asset.name,
                        status: 'pending',
                        created_at: new Date().toISOString(),
                        metadata: { 
                            html: htmlContent,
                            raw_text: docText
                        },
                        hasPaid: false
                    });

                    setAnalyzing(false);
                    Alert.alert(
                        '🛡️ Audit Gemma Terminé',
                        "Votre devis a été audité avec succès. L'analyse complète est maintenant disponible et sécurisée dans votre bibliothèque.",
                        [{ text: 'Voir ma bibliothèque', onPress: () => fetchLibrary() }]
                    );
                    fetchLibrary();

                } catch (err: any) {
                    console.error('[Scan] Erreur:', err);
                    setAnalyzing(false);
                    Alert.alert('Erreur', 'Impossible de lire le document. Vérifiez la connexion WiFi.');
                }
            }
        } catch (e: any) {
            setAnalyzing(false);
            Alert.alert('Erreur', e.message || 'Impossible de sélectionner le document');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Bibliothèque</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={styles.iconBtn} onPress={fetchLibrary}>
                        <Ionicons name="sync-circle" size={26} color={Colors.accentBlue} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={fetchLibrary}>
                        <Ionicons name="refresh" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.scanBtn} onPress={handleScanDocument} disabled={analyzing}>
                    {analyzing ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="camera" size={24} color="#fff" />
                            <Text style={styles.scanBtnText}>Scanner un nouveau devis</Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Mes Analyses Récentes</Text>

                {loadingLibrary ? (
                    <ActivityIndicator size="large" color={Colors.accentBlue} style={{ marginTop: 20 }} />
                ) : realProjects.length > 0 ? (
                    realProjects.map((project) => (
                        <TouchableOpacity 
                            key={project.id} 
                            style={styles.projectCard}
                            onPress={() => {
                                if (!project.hasPaid) {
                                    Alert.alert(
                                        '🔒 Débloquer l\'audit',
                                        `Souhaitez-vous débloquer l'audit complet pour ${project.nom_projet || 'ce devis'} ? (2.49€)`,
                                        [
                                            { text: 'Annuler', style: 'cancel' },
                                            { text: '💳 Débloquer avec Stripe', onPress: async () => {
                                                const result = await payDevis({ devisId: project.id });
                                                if (result === 'error') {
                                                    Alert.alert('Erreur', 'Impossible d\'ouvrir la page de paiement. Vérifiez votre connexion.');
                                                }
                                            } }
                                        ]
                                    );
                                } else {
                                    // 🦁 [SOUVERAIN] Ouvrir dans le navigateur plein écran
                                    handleViewAnalysis(project);
                                }
                            }}
                        >
                            <View style={[styles.projectIcon, { backgroundColor: project.status === 'completed' ? '#4CAF50' : '#FF9800' }]}>
                                <Ionicons name="document-text" size={24} color="#fff" />
                            </View>
                            <View style={styles.projectInfo}>
                                <Text style={styles.projectName}>{project.nom_projet || project.numero}</Text>
                                <Text style={styles.projectDocs}>
                                    {project.status === 'completed' ? '✅ Débloqué' : '🔒 Audit flouté - 2.49€'}
                                </Text>
                            </View>
                            <View style={styles.projectMeta}>
                                <TouchableOpacity 
                                    style={{ padding: 8, marginRight: 5 }} 
                                    onPress={(e) => {
                                        // Empêcher l'ouverture de l'analyse si on clique sur supprimer
                                        // e.stopPropagation(); // Pas dispo sur tous les composants RN Touchable
                                        Alert.alert(
                                            'Supprimer l\'analyse',
                                            `Voulez-vous vraiment supprimer définitivement ${project.nom_projet || project.numero} ?`,
                                            [
                                                { text: 'Annuler', style: 'cancel' },
                                                { 
                                                    text: 'Supprimer', 
                                                    style: 'destructive', 
                                                    onPress: async () => {
                                                        await LocalHistoryService.deleteScan(project.id);
                                                        fetchLibrary();
                                                    } 
                                                }
                                            ]
                                        );
                                    }}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FF4444" />
                                </TouchableOpacity>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={styles.lastSync}>{new Date(project.created_at).toLocaleDateString()}</Text>
                                    <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="documents-outline" size={64} color="#333" />
                        <Text style={styles.emptyText}>Aucune analyse pour le moment.</Text>
                        <Text style={styles.emptySubText}>Commencez par scanner votre premier devis.</Text>
                    </View>
                )}
            </ScrollView>

            <Modal visible={viewingAnalysis !== null} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#222' }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Rapport d'Audit</Text>
                        <TouchableOpacity onPress={() => setViewingAnalysis(null)}>
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <WebView 
                        originWhitelist={['*']}
                        source={{ html: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                    body { font-family: -apple-system, sans-serif; background-color: #000; color: #fff; padding: 20px; line-height: 1.6; }
                                    .header { border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 30px; }
                                    .badge { background: #1e3a8a; color: #3b82f6; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 10px; }
                                    h1 { font-size: 24px; margin: 0; }
                                    h2, h3 { color: #3b82f6; margin-top: 30px; }
                                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                    th { background: #111; text-align: left; color: #888; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
                                    td, th { padding: 12px; border-bottom: 1px solid #222; }
                                    .price { font-weight: bold; color: #fbbf24; }
                                    .expert-note { background: #111; padding: 15px; border-radius: 12px; margin-top: 10px; font-style: italic; color: #888; border-left: 3px solid #3b82f6; }
                                    .footer { margin-top: 50px; text-align: center; color: #444; font-size: 12px; border-top: 1px solid #222; padding-top: 20px; }
                                </style>
                            </head>
                            <body>
                                <div class="header">
                                    <div class="badge">🛡️ AUDIT SOUVERAIN GEMMA</div>
                                    <h1>${viewingAnalysis?.nom_projet || 'Audit Devis'}</h1>
                                    <p style="color: #666; margin-top: 5px;">Généré le ${new Date(viewingAnalysis?.created_at || Date.now()).toLocaleDateString()}</p>
                                </div>
                                ${viewingAnalysis?.metadata?.html || ''}
                                <div class="footer">&copy; 2026 BPA - Intelligence Artificielle Souveraine</div>
                            </body>
                            </html>
                        ` }}
                        style={{ flex: 1, backgroundColor: 'transparent' }}
                    />
                </SafeAreaView>
            </Modal>

            <Modal visible={analyzing} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ActivityIndicator size="large" color={Colors.accentBlue} />
                        <Text style={styles.modalTitle}>Intelligence Souveraine</Text>
                        <Text style={styles.modalText}>Gemma analyse votre devis par rapport à 45 000 prix de référence...</Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    iconBtn: { padding: 5 },
    content: { flex: 1, paddingHorizontal: 20 },
    scanBtn: {
        backgroundColor: Colors.accentBlue,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        marginVertical: 20,
        gap: 12
    },
    scanBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 15, marginTop: 10 },
    projectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#222'
    },
    projectIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    projectInfo: { flex: 1, marginLeft: 15 },
    projectName: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    projectDocs: { color: Colors.textSecondary, fontSize: 13 },
    projectMeta: { alignItems: 'flex-end', gap: 5 },
    lastSync: { color: '#555', fontSize: 11 },
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, gap: 10 },
    emptyText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    emptySubText: { color: '#666', fontSize: 14, textAlign: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#1a1a1a', padding: 30, borderRadius: 24, alignItems: 'center', width: '80%' },
    modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 15 },
    modalText: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 }
});
