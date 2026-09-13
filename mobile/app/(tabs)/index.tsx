import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, ActivityIndicator, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStripePayment } from '@/hooks/useStripePayment';
import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { CONFIG } from '@/constants/Config';
import { useAuth } from '@/contexts/AuthContext';
import { masterSupabase, getAuthHeaders } from '@/services/authService';
import { WebView } from 'react-native-webview';
import { LocalHistoryService } from '@/services/local-history.service';
import { LocalAiService } from '@/services/local-ai.service';
import * as Linking from 'expo-linking';

// Table de prix locale
const PROJECTS = [
    { id: 1, name: 'Rénovation Maison Dupont', docs: 12, lastSync: 'Il y a 2h', color: '#4CAF50' },
    { id: 2, name: 'Audit Sciences Déco', docs: 5, lastSync: 'Hier', color: '#2196F3' },
    { id: 3, name: 'BTP Martin - Extension', docs: 8, lastSync: '2 Jan', color: '#FF9800' },
    { id: 4, name: 'Design Pro Office', docs: 3, lastSync: '28 Déc', color: '#E91E63' },
];

/** Vérifie dans Supabase si l'utilisateur a un paiement validé */
async function checkPaymentInSupabase(userId: string): Promise<boolean> {
    try {
        const { data } = await masterSupabase
            .from('scan_payments')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .limit(1)
            .single();
        return !!data;
    } catch {
        return false;
    }
}

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

    let html = '<div class="audit-devis">';
    
    // Tableau 1 : Articles
    html += '<h2>📋 Analyse détaillée article par article</h2>';
    html += '<table class="table-audit"><thead><tr><th>N°</th><th>Article</th><th>Qté</th><th>Unité</th><th>Prix Devis</th><th>Prix Réf.</th><th>Écart</th><th>Statut</th><th>Analyse</th></tr></thead><tbody>';
    (a.articles || []).forEach((art: any) => {
        const ecartClass = art.statut === 'vert' ? 'ecart-vert' : art.statut === 'jaune' ? 'ecart-jaune' : art.statut === 'orange' ? 'ecart-orange' : 'ecart-rouge';
        html += `<tr>
            <td>${art.numero || '-'}</td>
            <td>${art.designation || 'Non spécifié'}</td>
            <td>${art.quantite ?? '-'}</td>
            <td>${art.unite || '-'}</td>
            <td>${fn(art.prix_devis)} €</td>
            <td>${fn(art.prix_ref)} €</td>
            <td class="${ecartClass}">${art.ecart_pourcent !== null ? (art.ecart_pourcent > 0 ? '+' : '') + fn(art.ecart_pourcent, 1) + '%' : 'N/A'}</td>
            <td>${art.emoji || '⚪'}</td>
            <td>${art.analyse_expert || ''}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    
    // Tableau 2 : Anomalies
    if (a.anomalies?.length) {
        html += '<h2>⚠️ Points d\'attention & anomalies</h2>';
        html += '<table class="table-alert"><thead><tr><th>Gravité</th><th>Article</th><th>Problème</th><th>Pourquoi</th><th>Action</th></tr></thead><tbody>';
        a.anomalies.forEach((ano: any) => {
            const rowClass = ano.gravite === 'CRITIQUE' ? 'alert-critique' : ano.gravite === 'ATTENTION' ? 'alert-attention' : 'alert-verif';
            html += `<tr class="${rowClass}">
                <td>${ano.emoji || '⚪'} ${ano.gravite}</td>
                <td>${ano.article || '-'}</td>
                <td>${ano.probleme || ''}</td>
                <td>${ano.pourquoi || ''}</td>
                <td>${ano.action || ''}</td>
            </tr>`;
        });
        html += '</tbody></table>';
    }
    
    // Tableau 3 : Estimation globale
    if (a.estimation_globale) {
        const eg = a.estimation_globale;
        html += '<h2>💰 Estimation globale & comparaison</h2>';
        html += '<table class="table-global"><tbody>';
        html += `<tr><td class="label">Main d'œuvre</td><td>${fn(eg.main_oeuvre_devis)} €</td><td>${fn(eg.main_oeuvre_marche)} €</td><td>${eg.appreciation || ''}</td></tr>`;
        html += `<tr class="total-ht"><td class="label"><strong>TOTAL HT</strong></td><td><strong>${fn(eg.total_ht_devis)} €</strong></td><td><strong>${fn(eg.total_ht_marche)} €</strong></td><td><strong>${fn(eg.ecart_pourcent, 1)}% (${fn(eg.ecart_euros)} €)</strong></td></tr>`;
        html += `<tr><td class="label">TVA (${eg.tva_taux || '-'}%)</td><td>${fn(eg.tva_montant)} €</td><td>-</td><td>-</td></tr>`;
        html += `<tr class="total-ttc"><td class="label"><strong>TOTAL TTC</strong></td><td><strong>${fn(eg.total_ttc_devis)} €</strong></td><td><strong>${fn(eg.total_ttc_marche)} €</strong></td><td><strong>${eg.appreciation || ''}</strong></td></tr>`;
        html += '</tbody></table>';
    }
    
    // Tableau 4 : Verdict
    if (a.verdict) {
        const v = a.verdict;
        html += '<h2>✅ Verdict & recommandations</h2>';
        html += '<table class="table-verdict"><tbody>';
        html += `<tr><td class="label"><strong>VERDICT GLOBAL</strong></td><td class="value">${v.global || '-'} ${v.recommandation || ''}</td></tr>`;
        html += `<tr><td class="label"><strong>Confiance</strong></td><td class="value">${v.confiance || '-'}%</td></tr>`;
        html += `<tr><td class="label"><strong>Potentiel négociation</strong></td><td class="value">${fn(v.potentiel_negociation_euros)} €</td></tr>`;
        html += `<tr><td class="label"><strong>Recommandation principale</strong></td><td class="value">${v.recommandation_principale || ''}</td></tr>`;
        html += '</tbody></table>';
    }
    
    // Résumé
    if (a.resume) {
        const r = a.resume;
        html += '<h2>📊 Résumé exécutif</h2>';
        html += '<table class="table-resume"><tbody>';
        html += `<tr><td class="label">Articles analysés</td><td class="value">${r.nombre_articles || '-'}</td></tr>`;
        html += `<tr><td class="label">🟢 Prix cohérents</td><td class="value">${r.articles_vert || 0}</td></tr>`;
        html += `<tr><td class="label">🟡 À vérifier</td><td class="value">${r.articles_jaune || 0}</td></tr>`;
        html += `<tr><td class="label">🟠 Prix élevés</td><td class="value">${r.articles_orange || 0}</td></tr>`;
        html += `<tr><td class="label">🔴 Prix excessifs</td><td class="value">${r.articles_rouge || 0}</td></tr>`;
        html += `<tr><td class="label">Écart global</td><td class="value">${fn(r.ecart_global_pourcent, 1)}% (${fn(r.ecart_global_euros)} €)</td></tr>`;
        html += `<tr><td class="label">Note globale</td><td class="value">${r.note_globale || '-'}/100</td></tr>`;
        html += `<tr><td class="label">Recommandation</td><td class="value">${r.recommandation || '-'}</td></tr>`;
        html += '</tbody></table>';
        if (r.synthese?.length) {
            html += '<div class="synthese"><h3>Synthèse</h3><ol>';
            r.synthese.forEach((s: string) => { html += `<li>${s}</li>`; });
            html += '</ol></div>';
        }
    }
    
    html += '</div>';
    return html;
}

export default function ChatScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, session } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Hooks après les états de base pour éviter les conflits d'initialisation
    const { payDevis, isLoading: stripeLoading } = useStripePayment(user?.id);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [devisHistory, setDevisHistory] = useState<any[]>([]); 
    const [selectedDevisIds, setSelectedDevisIds] = useState<number[]>([]);
    const [hasPaidGlobal, setHasPaidGlobal] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [webViewHeights, setWebViewHeights] = useState<{[key: number]: number}>({});
    const [selectedModel, setSelectedModel] = useState<'Gemma (Local)'>('Gemma (Local)');
    const [localAiReady, setLocalAiReady] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);
    const webviewRefs = useRef<{[key: number]: WebView | null}>({});
    
    // Auto-scroll à chaque nouveau message et message d'accueil
    useEffect(() => {
        // Message d'accueil automatique si chat vide
        if (messages.length === 0 && !isLoading) {
            setMessages([{
                id: 'welcome',
                type: 'ai',
                content: "Bonjour ! Je suis Gemma, votre IA souveraine spécialisée en bâtiment. 🏠\n\nPour commencer, veuillez me transmettre un devis (bouton 📄 ou 📷) pour que je puisse l'analyser par rapport à ma bibliothèque de 45 000 prix de référence."
            }]);
        }

        if (scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 500);
        }
    }, [messages, isLoading]);

    // 🧬 [SOUVERAIN] Reprise d'une analyse depuis la bibliothèque
    useEffect(() => {
        const loadResumedAnalysis = async () => {
            if (params.resumeAnalysis === 'true' && params.id) {
                try {
                    const history = await LocalHistoryService.getHistory();
                    const scan = history.find((s: any) => s.id === params.id);
                    
                    if (scan) {
                        let finalHtml = scan.metadata?.html;
                        
                        // Si le HTML est manquant mais qu'on a le JSON brut, on le régénère
                        if (!finalHtml && scan.metadata?.analyse) {
                            finalHtml = generateAnalyseHtml(scan.metadata.analyse);
                        }

                        if (finalHtml) {
                            setMessages([{
                                id: Date.now(),
                                content: `Analyse de : ${scan.nom_projet}`,
                                type: 'ai',
                                isAnalyse: true,
                                html: finalHtml
                            }]);
                            setHasPaidGlobal(true);
                        } else {
                            // Fallback s'il n'y a vraiment rien
                            setMessages([{
                                id: Date.now(),
                                content: "Désolé, le contenu de cette analyse n'a pas pu être récupéré.",
                                type: 'ai'
                            }]);
                        }
                        console.log('[Chat] Analyse reprise avec succès.');
                    }
                } catch (e) {
                    console.error('[Chat] Erreur lors de la reprise de l\'analyse:', e);
                }
            }
        };
        loadResumedAnalysis();
    }, [params.resumeAnalysis, params.id]);

    // Initialisation Intelligence Souveraine
    React.useEffect(() => {
        const initLocalAi = async () => {
            try {
                const ready = await LocalAiService.getInstance().prepareAssets();
                setLocalAiReady(ready);
                if (ready) console.info("🧠 Intelligence Locale Gemma active !");
            } catch (e) {
                console.warn("⚠️ Impossible d'initialiser l'IA locale:", e);
            }
        };
        initLocalAi();

        // Vérification initiale du paiement
        if (user?.id) {
            checkPaymentInSupabase(user.id).then(setHasPaidGlobal);
        }
    }, [user?.id]);

    // 🎯 Synchronisation centralisée : rafraîchir quand on revient de Stripe (Web ou Mobile)
    const refreshLibrary = useCallback(async () => {
        try {
            console.log('[Chat] 🔄 Rafraîchissement de la bibliothèque...');
            const data = await LocalHistoryService.getHistory();
            setDevisHistory(data);
            
            if (user?.id) {
                const paid = await checkPaymentInSupabase(user.id);
                setHasPaidGlobal(paid);
            }
        } catch (e) {
            console.error('[Chat] Refresh error:', e);
        }
    }, [user?.id]);

    useEffect(() => {
        refreshLibrary();

        // Écouteur pour le retour Stripe (Mobile)
        const sub = Linking.addEventListener('url', refreshLibrary);
        
        // Polling ou détection d'URL (Web)
        let interval: any;
        if (Platform.OS === 'web') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('stripe-success') === 'true') {
                refreshLibrary();
            }
            // Petite vérification périodique car le webhook peut être lent
            interval = setInterval(refreshLibrary, 5000);
        }

        return () => {
            sub.remove();
            if (interval) clearInterval(interval);
        };
    }, [user?.id, refreshLibrary]);

    // Également surveiller le retour d'état de stripeLoading pour forcer un refresh
    useEffect(() => {
        if (!stripeLoading) {
            refreshLibrary();
        }
    }, [stripeLoading, refreshLibrary]);

    // Handler pour le paiement Stripe
    const handlePay = async (scanId?: string) => {
        try {
            console.log('💳 Lancement paiement Stripe pour:', scanId || 'current');
            const result = await payDevis({ 
                devisId: scanId || 'local_last', 
                amount: 249 
            });
            if (result === 'checkout_opened') {
                setShowPaywall(false);
            } else if (result === 'error') {
                Alert.alert('Erreur', 'Impossible d\'ouvrir la page de paiement. Vérifiez votre connexion.');
            }
        } catch (e) {
            console.error('Stripe error:', e);
            Alert.alert('Erreur', 'Une erreur inattendue est survenue.');
        }
    };

    // Handler pour recevoir la hauteur du contenu WebView
    const handleWebViewMessage = (msgId: number, event: any) => {
        const height = parseInt(event.nativeEvent.data, 10);
        if (height && height > 0) {
            setWebViewHeights(prev => ({ ...prev, [msgId]: height + 20 })); // +20 pour padding
        }
    };

    // Helper pour générer un ID unique
    const generateId = () => Math.random().toString(36).substring(7);

    const handleUploadDevis = async () => {
        // [MODIF TEASER] On autorise l'upload même si pas payé
        // Mais on prévient l'utilisateur que le résultat sera flouté
        if (!hasPaidGlobal) {
            console.log('[UploadDevis] Mode Teaser : L\'analyse sera floutée.');
        }

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true
            });
            if (!result.canceled) {
                const asset = result.assets[0];
                const devisId = Date.now();
                setMessages(prev => [...prev, {
                    id: devisId,
                    type: 'user',
                    content: `Document téléchargé : ${asset.name}`,
                    isDoc: true
                }]);

                // Message d'attente immédiat
                setMessages(prev => [...prev, {
                    id: 'pending_' + Date.now(),
                    type: 'ai',
                    content: "Excellent ! Je viens de recevoir votre devis. 📑\n\nL'intelligence souveraine Gemma est en train de l'analyser ligne par ligne par rapport aux 45 000 prix de référence. Cela prend environ 30 secondes..."
                }]);

                // Création du FormData pour React Native
                const formData = new FormData();
                
                // Format spécifique pour React Native - utiliser 'photo' ou 'image' comme nom de champ
                const fileToUpload: any = {
                    uri: asset.uri,
                    name: asset.name.replace(/[^a-zA-Z0-9.-]/g, '_'), // Nettoyer le nom
                    type: asset.mimeType || 'application/pdf'
                };
                
                formData.append('file', fileToUpload);

                try {
                    const headers = await getAuthHeaders();
                    // Envoyer au backend avec le paramètre de modèle
                    const uploadHeaders: Record<string, string> = {
                        ...headers,
                    };
                    delete uploadHeaders['Content-Type'];
                    
                    if (selectedModel === 'Gemma (Local)') {
                        formData.append('model', 'gemma');
                    }
                    
                    console.log('[UploadDevis] Début upload model:', selectedModel);
                    
                    const response = await new Promise<any>((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', `${CONFIG.BACKEND_URL}/api/ai/chat`);
                        
                        Object.keys(uploadHeaders).forEach(key => {
                            xhr.setRequestHeader(key, uploadHeaders[key]);
                        });
                        
                        xhr.timeout = 5 * 60 * 1000; // 5 minutes
                        
                        xhr.onload = () => {
                            console.log('[UploadDevis] Réponse status:', xhr.status);
                            try {
                                const parsed = JSON.parse(xhr.responseText);
                                resolve({ ok: xhr.status >= 200 && xhr.status < 300, data: parsed, status: xhr.status });
                            } catch (e) {
                                resolve({ ok: false, data: { error: xhr.responseText }, status: xhr.status });
                            }
                        };
                        
                        xhr.onerror = () => reject(new Error('Erreur réseau (vérifiez la connexion au backend)'));
                        xhr.ontimeout = () => reject(new Error('Délai dépassé (5 minutes) : Gemma est encore en train de réfléchir.'));
                        
                        xhr.send(formData);
                    });
                    
                    if (!response.ok) {
                        const errorText = response.data.error || 'Erreur serveur inconnue';
                        console.error('[UploadDevis] Erreur serveur:', errorText);
                        throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
                    }
                    
                    const data = response.data;
                    console.log('[UploadDevis] Réponse data reçue');
                    
                    // Traiter la réponse comme pour sendMessage
                    let htmlContent = data.response || data.reply || "";
                    let isAnalyseJson = false;
                    
                    if (data.analyse || (htmlContent.startsWith('{') && htmlContent.includes('"articles"'))) {
                        try {
                            const analyseData = data.analyse || JSON.parse(htmlContent);
                            isAnalyseJson = true;
                            htmlContent = generateAnalyseHtml(analyseData);
                            console.log('[UploadDevis] Analyse JSON detected');
                        } catch (e) {
                            console.log('[UploadDevis] Not JSON, using raw response');
                        }
                    }

                    // 🐯 [DIAMOND-SOUVERAIN] Si Gemma Local est sélectionnée
                    if (selectedModel === 'Gemma (Local)') {
                        try {
                            console.info('🛰️ [DIAMOND-AUDIT] Analyse INTERNE au téléphone démarrée...');
                            // Correction : ocrText doit venir du backend
                            const ocrText = data.raw_text || data.ocr || data.response || "";
                            const localAnalysis = await LocalAiService.getInstance().chat(`Analysez ce devis bâtiment et comparez les prix avec la bibliothèque : ${ocrText}`);
                            
                            let displayHtml = "";
                            try {
                                // On tente de parser si c'est du JSON, sinon on affiche tel quel
                                const jsonMatch = localAnalysis.match(/\{[\s\S]*\}/);
                                const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
                                displayHtml = parsed ? generateAnalyseHtml(parsed) : `<div style="color:white; padding:10px;">${localAnalysis}</div>`;
                            } catch(e) {
                                displayHtml = `<div style="color:white; padding:10px;">${localAnalysis}</div>`;
                            }

                            // On ajoute le badge de sécurité
                            htmlContent = `<div style="background:#1e3a8a; padding:10px; border-radius:8px; margin-bottom:10px; border-left:4px solid #3b82f6;">
                                <h3 style="color:white; margin:0; font-size:14px;">🛡️ Audit Souverain Gemma (On-Device)</h3>
                                <p style="color:#bfdbfe; font-size:12px; margin:5px 0 0 0;">Analyse effectuée à 100% sur ce téléphone.</p>
                            </div>` + displayHtml;
                        } catch (localErr) {
                            console.warn('[DIAMOND-AUDIT] Échec IA locale, fallback OCR :', localErr);
                        }
                    }

                    // On ajoute un message d'accompagnement de l'agent
                    const aiGreeting = "🛡️ J'ai terminé l'audit de votre document. J'ai comparé chaque ligne avec ma bibliothèque de 45 000 prix. Les résultats sont prêts à être débloqués.";
                    
                    setMessages(prev => [...prev, 
                        { id: Date.now() - 1, type: 'ai', content: aiGreeting },
                        {
                            id: Date.now(),
                            type: 'ai',
                            content: htmlContent,
                            html: htmlContent,
                            isAnalyse: true,
                            devisId: Date.now()
                        }
                    ]);

                    // 🦁 [SOUVERAIN] Sauvegarde LOCALE
                    try {
                        console.log('💾 Sauvegarde LOCALE sur le téléphone...');
                        await LocalHistoryService.saveScan({
                            id: `local_${Date.now()}`,
                            numero: `SCAN-${Date.now()}`,
                            nom_projet: `Analyse : ${asset.name}`,
                            status: 'pending',
                            created_at: new Date().toISOString(),
                            metadata: { html: htmlContent },
                            hasPaid: false
                        });
                        console.log('✅ Sauvegarde locale réussie.');
                    } catch(e) {
                        console.error('❌ Échec sauvegarde locale:', e);
                    }
                    setIsLoading(false);
                } catch (err: any) {
                    console.error("[UploadDevis] Fetch error:", err);
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        type: 'ai',
                        content: `Erreur lors de l'upload du document.

Document : ${asset.name}
Erreur : ${err.message || 'Erreur inconnue'}
URL : ${CONFIG.BACKEND_URL}/api/ai/chat

Vérifiez que :
1. Le backend tourne sur le PC
2. Votre appareil est sur le même WiFi
3. Le firewall autorise le port 4000`
                    }]);
                }
            }
        } catch (err: any) {
            console.error('[UploadDevis] Error:', err);
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'ai',
                content: `Erreur lors de la sélection du document : ${err.message}`
            }]);
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;
        const userContent = message;
        const newMsg = { id: Date.now(), type: 'user', content: userContent };
        setMessages(prev => [...prev, newMsg]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await new Promise<any>(async (resolve, reject) => {
                const headers = {
                    ...(await getAuthHeaders()),
                    'Content-Type': 'application/json'
                };
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `${CONFIG.BACKEND_URL}/api/ai/chat`);
                
                Object.keys(headers).forEach(key => {
                    xhr.setRequestHeader(key, (headers as any)[key]);
                });
                
                xhr.timeout = 5 * 60 * 1000; // 5 minutes timeout
                
                xhr.onload = () => {
                    console.log('[Chat] Réponse status:', xhr.status);
                    try {
                        const parsed = JSON.parse(xhr.responseText);
                        resolve({ ok: xhr.status >= 200 && xhr.status < 300, data: parsed, status: xhr.status });
                    } catch (e) {
                        resolve({ ok: false, data: { error: xhr.responseText }, status: xhr.status });
                    }
                };
                
                xhr.onerror = () => reject(new Error('Erreur réseau (vérifiez la connexion au backend)'));
                xhr.ontimeout = () => reject(new Error('Délai dépassé (5 minutes) : Gemma est trop lente.'));
                
                xhr.send(JSON.stringify({ 
                    message: userContent,
                    model: 'gemma'
                }));
            });

            if (!response.ok) {
                throw new Error(response.data.error || 'Erreur serveur');
            }

            const data = response.data;
            console.log('[Chat] Réponse data reçue');

            // Vérifier si c'est une réponse JSON structurée (analyse de devis)
            let htmlContent = data.reply || data.response || "";
            let isAnalyseJson = false;
            
            // Si la réponse contient des données d'analyse JSON
            if (data.analyse || (htmlContent.startsWith('{') && htmlContent.includes('"articles"'))) {
                try {
                    const analyseData = data.analyse || JSON.parse(htmlContent);
                    isAnalyseJson = true;
                    
                    // Générer un HTML propre pour l'affichage
                    htmlContent = generateAnalyseHtml(analyseData);
                    console.log('[Chat] Analyse JSON detected and converted to HTML');
                } catch (e) {
                    console.log('[Chat] Not JSON, using raw response');
                }
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'ai',
                content: htmlContent,
                html: htmlContent,
                isAnalyse: isAnalyseJson
            }]);
        } catch (err: any) {
            console.error("Fetch error:", err);
            // Mode dégradé - réponse simulée
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'ai',
                content: `Mode dégradé - Backend inaccessible.

Votre message : "${userContent}"

Le serveur backend est actuellement injoignable. Vérifiez que :
1. Le serveur tourne sur le PC
2. Votre appareil est sur le même réseau WiFi
3. Le firewall Windows autorise le port 4000

Erreur technique : ${err.message || 'Network error'}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler pour le scan caméra
    const handleScanDocument = async () => {
        try {
            // Demande dynamique de permission si non accordée via config native
            const { status } = await require('expo-image-picker').requestCameraPermissionsAsync();
            if (status !== 'granted') {
                return Alert.alert('Permission requise', 'FactureScan a besoin d\'accéder à l\'appareil photo pour scanner vos devis.');
            }

            const ImagePicker = require('expo-image-picker');
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images',
                quality: 0.8,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                const devisId = Date.now();
                setMessages(prev => [...prev, {
                    id: devisId,
                    type: 'user',
                    content: `Photo capturée : Devis_Scan_${devisId}.jpg`,
                    isDoc: true
                }]);

                setMessages(prev => [...prev, {
                    id: 'pending_' + Date.now(),
                    type: 'ai',
                    content: "Photo bien reçue ! 📷\n\nJe suis en train d'extraire le texte et de chercher les prix sur le marché. Veuillez patienter environ 30 secondes..."
                }]);

                const formData = new FormData();
                const fileToUpload: any = {
                    uri: asset.uri,
                    name: `Devis_Scan_${devisId}.jpg`,
                    type: asset.mimeType || 'image/jpeg'
                };
                
                formData.append('file', fileToUpload);
                
                if (selectedModel === 'Gemma (Local)') {
                    formData.append('model', 'gemma');
                }

                try {
                    const uploadHeaders = await getAuthHeaders();
                    delete uploadHeaders['Content-Type'];

                    const response = await new Promise<any>((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', `${CONFIG.BACKEND_URL}/api/ai/chat`);
                        Object.keys(uploadHeaders).forEach(key => {
                            xhr.setRequestHeader(key, uploadHeaders[key]);
                        });
                        xhr.timeout = 5 * 60 * 1000;
                        xhr.onload = () => {
                            try {
                                resolve({ ok: xhr.status >= 200 && xhr.status < 300, data: JSON.parse(xhr.responseText), status: xhr.status });
                            } catch (e) {
                                resolve({ ok: false, data: { error: xhr.responseText }, status: xhr.status });
                            }
                        };
                        xhr.onerror = () => reject(new Error('Erreur réseau.'));
                        xhr.ontimeout = () => reject(new Error('Délai dépassé.'));
                        xhr.send(formData);
                    });

                    if (!response.ok) throw new Error(response.data.error || 'Erreur serveur inconnue');
                    const data = response.data;
                    let htmlContent = data.response || data.reply || "";

                    if (selectedModel === 'Gemma (Local)') {
                        try {
                            const ocrText = data.raw_text || data.ocr || data.response || "";
                            const { LocalAiService } = await import('@/services/local-ai.service');
                            const localAnalysis = await LocalAiService.getInstance().chat(`Analysez ce devis : ${ocrText}`);
                            
                            const jsonMatch = localAnalysis.match(/\{[\s\S]*\}/);
                            const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
                            const displayHtml = parsed ? generateAnalyseHtml(parsed) : `<div style="color:white; padding:10px;">${localAnalysis}</div>`;

                            htmlContent = `<div style="background:#1e3a8a; padding:10px; border-radius:8px; margin-bottom:10px; border-left:4px solid #3b82f6;">
                                <h3 style="color:white; margin:0; font-size:14px;">🛡️ Audit Souverain Gemma (On-Device)</h3>
                                <p style="color:#bfdbfe; font-size:12px; margin:5px 0 0 0;">Analyse effectuée à 100% sur ce téléphone.</p>
                            </div>` + displayHtml;
                        } catch (localErr) {
                            console.warn('[DIAMOND-AUDIT] Échec IA locale, fallback OCR :', localErr);
                        }
                    }

                    const aiGreeting = "🛡️ J'ai terminé l'audit de votre photo. Les résultats certifiés sont prêts à être débloqués.";
                    setMessages(prev => [...prev, 
                        { id: Date.now() - 1, type: 'ai', content: aiGreeting },
                        { id: Date.now(), type: 'ai', content: htmlContent, html: htmlContent, isAnalyse: true, devisId: Date.now() }
                    ]);

                    await LocalHistoryService.saveScan({
                        id: `local_${Date.now()}`,
                        numero: `SCAN-${Date.now()}`,
                        nom_projet: `Analyse : Photo [${new Date().toLocaleTimeString()}]`,
                        status: 'pending_payment',
                        created_at: new Date().toISOString(),
                        metadata: { html: htmlContent },
                        hasPaid: false
                    });
                    setIsLoading(false);
                } catch (err: any) {
                    setMessages(prev => [...prev, { id: Date.now(), type: 'ai', content: "Erreur technique: " + err.message }]);
                }
            }
        } catch (error: any) {
            console.error('[ScanDocument] Error:', error);
            Alert.alert('Erreur', error.message || 'Impossible de lancer la caméra.');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.mainLayout}>
                {/* Sidebar (Optional overlay or fixed if room) */}
                {isSidebarOpen && (
                    <View style={styles.sidebar}>
                        <View style={styles.sidebarHeader}>
                            <Text style={styles.sidebarTitle}>Devis analysés</Text>
                        </View>
                        <ScrollView style={styles.sidebarContent}>
                            <Text style={styles.recentText}>Historique</Text>
                            {devisHistory.map(project => (
                                <TouchableOpacity 
                            key={project.id} 
                            style={styles.projectCard}
                            onPress={() => {
                                if (project.status === 'pending') {
                                    Alert.alert(
                                        '🔒 Débloquer l\'analyse',
                                        `Souhaitez-vous débloquer l'audit complet pour ${project.nom_projet} ? (2.49€)`,
                                        [
                                            { text: 'Annuler', style: 'cancel' },
                                            { text: '💳 Débloquer', onPress: async () => {
                                                const result = await payDevis({ devisId: project.id });
                                                if (result === 'error') {
                                                    Alert.alert('Erreur', 'Impossible d\'ouvrir la page de paiement. Vérifiez votre connexion.');
                                                }
                                            } }
                                        ]
                                    );
                                } else {
                                    router.push('/(tabs)');
                                }
                            }}
                        >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.projectItemText} numberOfLines={1}>{project.nom_projet || project.name}</Text>
                                        <Text style={{ fontSize: 10, color: Colors.textSecondary }}>{new Date(project.created_at).toLocaleDateString()}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            Alert.alert(
                                                'Supprimer',
                                                'Supprimer définitivement ?',
                                                [
                                                    { text: 'Non', style: 'cancel' },
                                                    { text: 'Oui', style: 'destructive', onPress: async () => {
                                                        await LocalHistoryService.deleteScan(project.id);
                                                        refreshLibrary();
                                                    }}
                                                ]
                                            );
                                        }}
                                        style={{ padding: 5 }}
                                    >
                                        <Ionicons name="trash-outline" size={16} color="#FF4444" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                            ))}
                            {selectedDevisIds.length > 1 && (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Comparaison :</Text>
                                    {selectedDevisIds.map(id => {
                                        const devis = devisHistory.find(d => d.id === id);
                                        return devis ? (
                                            <View key={id} style={{ marginVertical: 4, padding: 4, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
                                                <Text style={{ fontWeight: 'bold' }}>{devis.name}</Text>
                                                <Text>{devis.result}</Text>
                                            </View>
                                        ) : null;
                                    })}
                                </View>
                            )}
                        </ScrollView>
                    </View>
                )}

                {/* Main Chat Area */}
                <View style={[styles.chatArea, !isSidebarOpen && { flex: 1 }]}>
                    {/* Top navigation matching Image 1 */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity onPress={() => setSidebarOpen(!isSidebarOpen)}>
                                <Ionicons name="menu" size={24} color={Colors.textPrimary} />
                            </TouchableOpacity>
                            <View style={styles.headerDivider} />
                            <TouchableOpacity>
                                <Ionicons name="add" size={24} color={Colors.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.headerCenter}>
                             <Text style={styles.headerProjectTitle} numberOfLines={1}>2025-03-17_analyse_devis</Text>
                        </View>

                        <View style={styles.headerRight}>
                            <Ionicons name="time-outline" size={22} color={Colors.textSecondary} />
                        </View>
                    </View>

                    {/* Chat Content */}
                    <ScrollView 
                        ref={scrollViewRef}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {isLoading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={Colors.accentBlue} />
                                <Text style={styles.loadingText}>Analyse en cours...</Text>
                            </View>
                        )}
                        {messages.length === 0 && !isLoading ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.aiName}>Assistant IA <Text style={styles.aiProvider}>Gemma (Local)</Text></Text>
                                <Text style={styles.welcomeText}>Décrivez ce que vous voulez analyser et l'IA s'en occupera pour vous.</Text>
                            </View>
                        ) : (
                            messages.map(msg => {
                                return (
                                    <View key={msg.id} style={[styles.messageBubble, msg.type === 'user' ? styles.userBubble : styles.aiBubble]}>
                                        {msg.type === 'ai' && msg.isAnalyse === true ? (
                                            <View style={styles.webViewWrapper}>
                                                <View style={[styles.webViewContainer, !hasPaidGlobal && styles.blurredContent]}>
                                                    <WebView 
                                                        originWhitelist={['*']}
                                                        source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body { font-family: sans-serif; color: white; margin: 0; padding: 10px; background: transparent; line-height: 1.5; } h2, h3 { color: #3b82f6; border-bottom: 1px solid #333; padding-bottom: 5px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 8px; border: 1px solid #333; }</style></head><body>${msg.html}</body></html>` }}
                                                        style={styles.webView}
                                                        scrollEnabled={hasPaidGlobal}
                                                    />
                                                </View>
                                                {!hasPaidGlobal && (
                                                    <View style={styles.lockOverlay}>
                                                        <Ionicons name="lock-closed" size={40} color={Colors.accentBlue} />
                                                        <Text style={styles.lockTitle}>Analyse Souveraine Terminée</Text>
                                                        <Text style={styles.lockSubtitle}>Les résultats sont prêts et sécurisés.</Text>
                                                        <TouchableOpacity 
                                                            style={styles.payButton}
                                                            onPress={() => handlePay()}
                                                        >
                                                            <Text style={styles.unlockButtonText}>Débloquer pour 2.49€</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            </View>
                                        ) : (
                                            <Text style={styles.messageText}>{msg.content}</Text>
                                        )}
                                        {msg.isDoc && (
                                            <View style={styles.docBanner}>
                                                <Ionicons name="document-text" size={20} color={Colors.accentBlue} />
                                                <Text style={styles.docBannerText}>{msg.content}</Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })
                        )}
                    </ScrollView>

                    {/* Complex Input Area */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputBarWrapper}>
                            <View style={styles.inputIconsTop}>
                                <TouchableOpacity onPress={handleUploadDevis}>
                                    <Ionicons name="attach" size={28} color={Colors.accentBlue} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleScanDocument}>
                                    <Ionicons name="camera" size={24} color={Colors.accentBlue} />
                                </TouchableOpacity>
                            </View>
                            
                            <TextInput 
                                style={styles.input}
                                placeholder="Décrivez ce qu'il faut construire..."
                                placeholderTextColor={Colors.textSecondary}
                                multiline
                                value={message}
                                onChangeText={setMessage}
                            />

                            <View style={styles.inputToolbar}>
                                <View style={styles.toolbarLeft}>
                                    <View style={styles.modelSelector}>
                                        <Text style={styles.modelText}>Gemma 4 (Local)</Text>
                                        <Ionicons name="shield-checkmark" size={14} color={Colors.accentBlue} />
                                    </View>
                                </View>
                                
                                <TouchableOpacity 
                                    style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
                                    onPress={sendMessage}
                                >
                                    <Ionicons name="paper-plane" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* MODAL PAYWALL STRIPE */}
                <Modal visible={showPaywall} animationType="slide" transparent={true}>
                    <View style={chatStyles.modalOverlay}>
                        <View style={chatStyles.modalContent}>
                            <View style={chatStyles.modalIcon}>
                                <Ionicons name="shield-checkmark" size={50} color={Colors.accentBlue} />
                            </View>
                            <Text style={chatStyles.modalTitle}>Débloquer l'Analyse IA</Text>
                            <Text style={chatStyles.modalSubtitle}>
                                L'agent <Text style={{ fontWeight: 'bold', color: '#fff' }}>Gemma Souverain</Text> va auditer votre devis ligne par ligne contre <Text style={{ fontWeight: 'bold', color: '#fff' }}>45 000 prix</Text> locaux.{"\n"}
                                Paiement unique : <Text style={chatStyles.priceHighlight}>2.49€</Text>
                            </Text>

                            <TouchableOpacity style={chatStyles.stripeBtn} onPress={() => handlePay()} disabled={stripeLoading}>
                                {stripeLoading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={chatStyles.stripeBtnText}>💳  Payer par Carte / Apple Pay</Text>
                                }
                            </TouchableOpacity>
                            <Text style={chatStyles.stripeHint}>Paiement 100% sécurisé via Stripe</Text>

                            <TouchableOpacity onPress={() => setShowPaywall(false)} style={chatStyles.cancelBtn}>
                                <Text style={chatStyles.cancelText}>Plus tard</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const chatStyles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: '#1a1a1a', borderRadius: 24, padding: 30, width: '100%', maxWidth: 400, borderWidth: 1, borderColor: '#333' } as any,
    modalIcon: { alignSelf: 'center', marginBottom: 20, backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 20, borderRadius: 30 },
    modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    modalSubtitle: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
    priceHighlight: { color: '#fbbf24', fontWeight: 'bold', fontSize: 16 },
    stripeBtn: { backgroundColor: '#635BFF', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 6 },
    stripeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    stripeHint: { color: '#555', fontSize: 12, textAlign: 'center', marginBottom: 20 },
    cancelBtn: { alignItems: 'center', paddingVertical: 10 },
    cancelText: { color: '#444', fontSize: 14 },
    blurOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    blurText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    unlockBtn: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        ...Platform.select({
            web: { boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)' },
            default: {
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5
            }
        })
    },
    unlockBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    mainLayout: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: 250,
        backgroundColor: '#0F0F0F',
        borderRightWidth: 1,
        borderRightColor: Colors.border,
        padding: 15,
    },
    sidebarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sidebarTitle: {
        color: Colors.textSecondary,
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1,
    },
    sidebarContent: {
        flex: 1,
    },
    recentText: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginBottom: 10,
        marginTop: 10,
    },
    projectItem: {
        paddingVertical: 10,
    },
    projectItemText: {
        color: Colors.textPrimary,
        fontSize: 14,
    },
    chatArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    webViewWrapper: {
        width: '100%',
        minHeight: 300,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 10,
    },
    lockTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    lockSubtitle: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 20,
        textAlign: 'center',
    },
    unlockButtonInChat: {
        backgroundColor: Colors.accentBlue,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        ...Platform.select({
            web: { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' },
            default: {
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            }
        })
    },
    unlockButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    webViewContainer: {
        flex: 1,
        minHeight: 300,
        borderRadius: 8,
        overflow: 'hidden',
    },
    blurredContent: {
        opacity: 0.4, // Meilleure visibilité pour le teaser
    },
    webView: {
        flex: 1,
        height: 400, // Taille fixe pour garantir l'affichage test
        backgroundColor: 'transparent',
    },
    headerDivider: {
        width: 1,
        height: 20,
        backgroundColor: Colors.border,
        marginHorizontal: 10,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerProjectTitle: {
        color: Colors.textPrimary,
        fontWeight: '600',
        fontSize: 14,
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 4,
    },
    headerRight: {
        width: 40,
        alignItems: 'flex-end',
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    loadingText: {
        color: Colors.textSecondary,
        marginTop: 10,
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    aiName: {
        color: Colors.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    aiProvider: {
        color: Colors.textSecondary,
        fontSize: 12,
        fontWeight: 'normal',
    },
    welcomeText: {
        color: Colors.textSecondary,
        textAlign: 'center',
        fontSize: 14,
        maxWidth: 300,
    },
    messageBubble: {
        maxWidth: '85%',
        padding: 12,
        borderRadius: 12,
        marginBottom: 15,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: 'transparent',
    },
    messageText: {
        color: Colors.textPrimary,
        fontSize: 15,
        lineHeight: 22,
    },
    docBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#121212',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    docBannerText: {
        color: Colors.textPrimary,
        marginLeft: 8,
        fontSize: 13,
    },
    inputContainer: {
        padding: 15,
        backgroundColor: Colors.background,
    },
    inputBarWrapper: {
        backgroundColor: '#161616',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 10,
    },
    inputIconsTop: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 5,
    },
    input: {
        color: Colors.textPrimary,
        fontSize: 16,
        minHeight: 40,
        maxHeight: 150,
        textAlignVertical: 'top',
        paddingTop: 5,
    },
    inputToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#222',
        paddingTop: 10,
    },
    toolbarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toolIcon: {
        marginRight: 15,
    },
    toolbarDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#333',
        marginRight: 15,
    },
    modelSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    modelText: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginRight: 4,
    },
    sendButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.accentBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#333',
    },
    // 🧬 Styles pour l'affichage de l'audit
    webViewWrapper: {
        width: '100%',
        minHeight: 400,
        backgroundColor: '#111',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
        marginVertical: 10,
    },
    webViewContainer: {
        flex: 1,
        minHeight: 380,
    },
    webView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    blurredContent: {
        opacity: 0.3,
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    lockTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        textAlign: 'center',
    },
    lockSubtitle: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 20,
    },
    payButton: {
        backgroundColor: Colors.accentBlue,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        ...Platform.select({
            web: { boxShadow: `0 4px 8px ${Colors.accentBlue}4D` },
            default: { elevation: 5 }
        }),
    },
    unlockButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    }
});
