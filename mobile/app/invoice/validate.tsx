import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTenant } from '@/contexts/TenantContext';

export default function InvoiceValidationScreen() {
    const { invoiceId } = useLocalSearchParams();
    const { artisanClient } = useTenant();
    const router = useRouter();

    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        fournisseur_nom: '',
        date_emission: '',
        montant_ht: '',
        montant_ttc: '',
        tva: ''
    });

    useEffect(() => {
        if (!invoiceId || !artisanClient) return;

        const fetchInvoice = async () => {
            const { data, error } = await artisanClient
                .from('invoices')
                .select('*')
                .eq('id', invoiceId)
                .single();

            if (error) {
                Alert.alert('Erreur', error.message);
            } else {
                setInvoice(data);
                setForm({
                    fournisseur_nom: data.fournisseur_nom || '',
                    date_emission: data.date_emission || '',
                    montant_ht: data.montant_ht?.toString() || '',
                    montant_ttc: data.montant_ttc?.toString() || '',
                    tva: JSON.stringify(data.tva_details || {})
                });
            }
            setLoading(false);
        };

        fetchInvoice();
    }, [invoiceId, artisanClient]);

    const saveValidation = async () => {
        if (!artisanClient) return;

        const { error } = await artisanClient
            .from('invoices')
            .update({
                fournisseur_nom: form.fournisseur_nom,
                date_emission: form.date_emission,
                montant_ht: parseFloat(form.montant_ht),
                montant_ttc: parseFloat(form.montant_ttc),
                status: 'valide',
                validated_at: new Date().toISOString()
            })
            .eq('id', invoiceId);

        if (error) {
            Alert.alert('Erreur', 'Mise à jour échouée: ' + error.message);
        } else {
            Alert.alert('Succès', 'Facture validée');
            router.replace('/(tabs)'); // Back to home
        }
    };

    if (loading) return <View style={styles.center}><Text>Chargement...</Text></View>;
    if (!invoice) return <View style={styles.center}><Text>Facture introuvable</Text></View>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Validation Facture</Text>
            <Text style={styles.subHeader}>Confiance OCR: {invoice.confidence_score}%</Text>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Fournisseur</Text>
                <TextInput
                    style={styles.input}
                    value={form.fournisseur_nom}
                    onChangeText={t => setForm({ ...form, fournisseur_nom: t })}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                    style={styles.input}
                    value={form.date_emission}
                    onChangeText={t => setForm({ ...form, date_emission: t })}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>Montant HT</Text>
                    <TextInput
                        style={styles.input}
                        value={form.montant_ht}
                        keyboardType="numeric"
                        onChangeText={t => setForm({ ...form, montant_ht: t })}
                    />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Montant TTC</Text>
                    <TextInput
                        style={styles.input}
                        value={form.montant_ttc}
                        keyboardType="numeric"
                        onChangeText={t => setForm({ ...form, montant_ttc: t })}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.btnValidate} onPress={saveValidation}>
                <Text style={styles.btnText}>Valider et Enregistrer</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    subHeader: { color: '#666', marginBottom: 20 },
    formGroup: { marginBottom: 15 },
    label: { marginBottom: 5, fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
    row: { flexDirection: 'row' },
    btnValidate: { backgroundColor: '#34C759', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
